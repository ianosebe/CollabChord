const prisma = require('../../config/prisma');

/**
 * Save message to DB
 */
const saveMessage = async (data) => {
  return await prisma.message.create({
    data: {
      content: data.content,
      userId: data.userId,
      projectId: data.projectId
    }
  });
};

/**
 * Get chat history
 */
const getMessages = async (projectId) => {
  return await prisma.message.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
};

module.exports = {
  saveMessage,
  getMessages
};
