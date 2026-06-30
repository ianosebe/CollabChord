const prisma = require('../../config/prisma');

/**
 * Create activity entry
 */
const createActivity = async (data) => {
  return await prisma.activity.create({
    data: {
      type: data.type,
      message: data.message,
      userId: data.userId,
      projectId: data.projectId || null
    }
  });
};

/**
 * Get global feed (all activity)
 */
const getGlobalFeed = async () => {
  return await prisma.activity.findMany({
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
      createdAt: 'desc'
    },
    take: 50
  });
};

/**
 * Get user-specific feed
 */
const getUserFeed = async (userId) => {
  return await prisma.activity.findMany({
    where: { userId },
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
      createdAt: 'desc'
    },
    take: 50
  });
};

module.exports = {
  createActivity,
  getGlobalFeed,
  getUserFeed
};
