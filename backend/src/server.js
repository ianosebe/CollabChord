require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const chatService = require('./modules/chat/chat.service');
const analytics = require('./modules/analytics/analytics.service');
const logger = require('./utils/logger');

const server = http.createServer(app);

const { verifyToken } = require('./utils/jwt');
const prisma = require('./config/prisma');

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Socket.io JWT Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  logger.info('User connected', { socketId: socket.id, username: socket.user.username });

  /**
   * Join project room
   */
  socket.on('join_project', async (projectId) => {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            where: {
              userId: socket.user.id,
              status: 'accepted'
            }
          }
        }
      });

      if (!project) {
        return socket.emit('error', 'Project not found');
      }

      if (project.ownerId !== socket.user.id && project.collaborators.length === 0) {
        return socket.emit('error', 'Unauthorized');
      }

      socket.join(projectId);
      logger.info('User joined project room', { username: socket.user.username, projectId });
    } catch (err) {
      socket.emit('error', 'Failed to join project room');
    }
  });

  /**
   * Send message
   */
  socket.on('send_message', async (data) => {
    const { projectId, message } = data;
    const userId = socket.user.id;

    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            where: {
              userId,
              status: 'accepted'
            }
          }
        }
      });

      if (!project || (project.ownerId !== userId && project.collaborators.length === 0)) {
        return socket.emit('error', 'Unauthorized to post messages to this project');
      }

      // Save to database
      const savedMsg = await chatService.saveMessage({
        content: message,
        userId: userId,
        projectId
      });

      try {
        await analytics.trackEvent({
          type: 'message_sent',
          userId: userId,
          projectId
        });
      } catch (err) {
        logger.error('Failed to track message_sent analytics event', { error: err.message });
      }

      io.to(projectId).emit('receive_message', {
        id: savedMsg.id,
        message,
        user: {
          id: socket.user.id,
          username: socket.user.username,
          avatar: socket.user.avatar
        },
        timestamp: savedMsg.createdAt
      });
    } catch (err) {
      logger.error('Failed to save message to DB', { error: err.message });
      socket.emit('error', 'Failed to send message');
    }
  });

  /**
   * Typing indicator
   */
  socket.on('typing', async (data) => {
    const { projectId } = data;
    const userId = socket.user.id;

    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            where: {
              userId,
              status: 'accepted'
            }
          }
        }
      });

      if (!project || (project.ownerId !== userId && project.collaborators.length === 0)) {
        return;
      }

      socket.to(projectId).emit('typing', {
        user: socket.user.username
      });
    } catch (err) {
      // Ignore
    }
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected', { socketId: socket.id });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
