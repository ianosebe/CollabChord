const prisma = require('../../config/prisma');
const activityService = require('../activity/activity.service');
const analytics = require('../analytics/analytics.service');
const logger = require('../../utils/logger');

/**
 * Create a new project
 */
const createProject = async (userId, data) => {
  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      genre: data.genre,
      ownerId: userId
    }
  });

  try {
    await activityService.createActivity({
      type: 'project_created',
      message: `New project "${project.title}" created`,
      userId,
      projectId: project.id
    });
  } catch (err) {
    logger.error('Failed to log project creation activity', { error: err.message });
  }

  try {
    await analytics.trackEvent({
      type: 'project_created',
      userId,
      projectId: project.id
    });
  } catch (err) {
    logger.error('Failed to track project_created analytics event', { error: err.message });
  }

  return project;
};

/**
 * Get all projects (global feed for now)
 */
const getAllProjects = async () => {
  return await prisma.project.findMany({
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

/**
 * Get single project
 */
const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id },
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

const deleteProject = async (id, userId) => {
  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.ownerId !== userId) {
    throw new Error('Unauthorized');
  }

  return await prisma.project.delete({
    where: { id }
  });
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject
};
