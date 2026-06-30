const prisma = require('../../config/prisma');

const trackEvent = async (data) => {
  return await prisma.analyticsEvent.create({
    data: {
      type: data.type,
      userId: data.userId || null,
      projectId: data.projectId || null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null
    }
  });
};

/**
 * Get platform stats (admin view)
 */
const getPlatformStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalProjects = await prisma.project.count();
  const totalAudio = await prisma.audioFile.count();
  const totalMessages = await prisma.message.count();

  return {
    totalUsers,
    totalProjects,
    totalAudio,
    totalMessages
  };
};

/**
 * Get user activity summary
 */
const getUserStats = async (userId) => {
  const projects = await prisma.project.count({
    where: { ownerId: userId }
  });

  const uploads = await prisma.audioFile.count({
    where: { uploadedBy: userId }
  });

  const messages = await prisma.message.count({
    where: { userId }
  });

  return {
    projects,
    uploads,
    messages
  };
};

module.exports = {
  trackEvent,
  getPlatformStats,
  getUserStats
};
