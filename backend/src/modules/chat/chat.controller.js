const chatService = require('./chat.service');
const prisma = require('../../config/prisma');

/**
 * GET /chat/:projectId
 */
const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

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

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId !== userId && project.collaborators.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await chatService.getMessages(projectId);
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getMessages
};
