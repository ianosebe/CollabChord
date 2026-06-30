const prisma = require('../config/prisma');

/**
 * Checks if a user has a specific permission on a project.
 * Roles: owner (full access), editor (upload/download/read), viewer (stream/read only).
 * 
 * @param {string} projectId 
 * @param {string} userId 
 * @param {string} requiredRole - 'owner' | 'editor' | 'viewer'
 * @returns {Promise<boolean>}
 */
const checkProjectPermission = async (projectId, userId, requiredRole = 'viewer') => {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Project owner always has full access
  if (project.ownerId === userId) {
    return true;
  }

  if (requiredRole === 'owner') {
    return false; // Only the owner can satisfy 'owner' requiredRole
  }

  // Check collaboration status
  const collab = await prisma.collaboration.findFirst({
    where: {
      projectId,
      userId,
      status: 'accepted'
    }
  });

  if (!collab) {
    return false; // User has no accepted collaboration on this project
  }

  // Role validation
  if (requiredRole === 'editor') {
    return collab.role === 'editor';
  }

  if (requiredRole === 'viewer') {
    return collab.role === 'editor' || collab.role === 'viewer';
  }

  return false;
};

module.exports = {
  checkProjectPermission
};
