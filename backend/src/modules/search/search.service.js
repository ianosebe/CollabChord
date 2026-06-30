const prisma = require('../../config/prisma');

/**
 * Search users by username
 */
const searchUsers = async (query) => {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: query
      }
    },
    select: {
      id: true,
      username: true,
      bio: true,
      avatar: true
    }
  });
};

/**
 * Search projects by title or genre
 */
const searchProjects = async (query) => {
  return await prisma.project.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query
          }
        },
        {
          genre: {
            contains: query
          }
        }
      ]
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      }
    }
  });
};

module.exports = {
  searchUsers,
  searchProjects
};
