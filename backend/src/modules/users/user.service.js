const prisma = require('../../config/prisma');

/**
 * Get logged-in user profile
 */
const getMyProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      avatar: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

/**
 * Update logged-in user profile
 */
const updateMyProfile = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      bio: data.bio,
      avatar: data.avatar
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      avatar: true,
      updatedAt: true
    }
  });
};

/**
 * Get public profile of another user
 */
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      bio: true,
      avatar: true,
      createdAt: true
    }
  });
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getUserById
};
