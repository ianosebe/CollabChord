const prisma = require('../../config/prisma');
const activityService = require('../activity/activity.service');
const analytics = require('../analytics/analytics.service');
const logger = require('../../utils/logger');

/**
 * Upload an audio file record
 */
const uploadAudio = async (projectId, userId, fileData) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const audioFile = await prisma.audioFile.create({
    data: {
      filename: fileData.filename,
      url: fileData.url,
      mimetype: fileData.mimetype,
      size: fileData.size,
      projectId,
      uploadedBy: userId
    }
  });

  // Log activity
  try {
    await activityService.createActivity({
      type: 'audio_uploaded',
      message: `Uploaded audio beat "${audioFile.filename}" to project "${project.title}"`,
      userId,
      projectId
    });
  } catch (err) {
    logger.error('Failed to log audio upload activity', { error: err.message });
  }

  // Log analytics event
  try {
    await analytics.trackEvent({
      type: 'audio_uploaded',
      userId,
      projectId,
      metadata: { filename: audioFile.filename, size: audioFile.size }
    });
  } catch (err) {
    logger.error('Failed to track audio_uploaded analytics event', { error: err.message });
  }

  return audioFile;
};

/**
 * Get all audio files for a project
 */
const getAudioList = async (projectId) => {
  return await prisma.audioFile.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get details of a single audio file
 */
const getAudioFile = async (audioId) => {
  return await prisma.audioFile.findUnique({
    where: { id: audioId }
  });
};

module.exports = {
  uploadAudio,
  getAudioList,
  getAudioFile
};
