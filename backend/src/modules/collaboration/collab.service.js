const prisma = require('../../config/prisma');
const notifService = require('../notifications/notification.service');
const activityService = require('../activity/activity.service');
const logger = require('../../utils/logger');

const inviteUser = async (projectId, userId, requesterId, role = 'viewer') => {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.ownerId !== requesterId) {
    throw new Error('Unauthorized');
  }

  const assignedRole = role === 'editor' ? 'editor' : 'viewer';

  const collab = await prisma.collaboration.create({
    data: {
      projectId,
      userId,
      status: 'pending',
      role: assignedRole
    }
  });

  try {
    await notifService.createNotification({
      type: 'invite',
      message: `You were invited to a project`,
      userId: userId,
      projectId
    });
  } catch (err) {
    logger.error('Failed to create notification for invite', { error: err.message });
  }

  try {
    await activityService.createActivity({
      type: 'invite_sent',
      message: `Invited a collaborator to project "${project.title}"`,
      userId: project.ownerId,
      projectId
    });
  } catch (err) {
    logger.error('Failed to log invite activity', { error: err.message });
  }

  return collab;
};

/**
 * Accept invite
 */
const acceptInvite = async (collabId, userId) => {
  const collab = await prisma.collaboration.findUnique({
    where: { id: collabId },
    include: { project: true }
  });

  if (!collab || collab.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updatedCollab = await prisma.collaboration.update({
    where: { id: collabId },
    data: { status: 'accepted' }
  });

  try {
    await notifService.createNotification({
      type: 'accept',
      message: `Someone accepted your project invite`,
      userId: collab.project.ownerId,
      projectId: collab.projectId
    });
  } catch (err) {
    logger.error('Failed to create notification for accept', { error: err.message });
  }

  try {
    await activityService.createActivity({
      type: 'invite_accepted',
      message: `Joined project "${collab.project.title}" as collaborator`,
      userId: userId,
      projectId: collab.projectId
    });
  } catch (err) {
    logger.error('Failed to log accept activity', { error: err.message });
  }

  return updatedCollab;
};

/**
 * Reject invite
 */
const rejectInvite = async (collabId, userId) => {
  const collab = await prisma.collaboration.findUnique({
    where: { id: collabId },
    include: { project: true }
  });

  if (!collab || collab.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updatedCollab = await prisma.collaboration.update({
    where: { id: collabId },
    data: { status: 'rejected' }
  });

  try {
    await notifService.createNotification({
      type: 'reject',
      message: `Someone rejected your project invite`,
      userId: collab.project.ownerId,
      projectId: collab.projectId
    });
  } catch (err) {
    logger.error('Failed to create notification for reject', { error: err.message });
  }

  try {
    await activityService.createActivity({
      type: 'invite_rejected',
      message: `Declined project invite for "${collab.project.title}"`,
      userId: userId,
      projectId: collab.projectId
    });
  } catch (err) {
    logger.error('Failed to log reject activity', { error: err.message });
  }

  return updatedCollab;
};

/**
 * Get all collaborators for a project
 */
const getProjectCollaborators = async (projectId) => {
  return await prisma.collaboration.findMany({
    where: {
      projectId,
      status: 'accepted'
    },
    include: {
      user: {
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
  inviteUser,
  acceptInvite,
  rejectInvite,
  getProjectCollaborators
};
