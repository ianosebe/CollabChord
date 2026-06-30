const prisma = require('../../config/prisma');

/**
 * Create notification
 */
const createNotification = async (data) => {
  return await prisma.notification.create({
    data: {
      type: data.type,
      message: data.message,
      userId: data.userId,
      projectId: data.projectId || null
    }
  });
};

/**
 * Get user notifications
 */
const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const markAsRead = async (notificationId, userId) => {
  const notif = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notif) {
    throw new Error('Notification not found');
  }

  if (notif.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};
