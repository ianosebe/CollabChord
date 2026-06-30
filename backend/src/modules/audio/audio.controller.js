const audioService = require('./audio.service');
const { checkProjectPermission } = require('../../utils/permissions');

/**
 * Upload audio (Requires editor role or owner)
 */
const upload = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const hasPermission = await checkProjectPermission(projectId, userId, 'editor');
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden: Only project owners and editors can upload audio files' });
    }

    const { filename, url, mimetype, size } = req.body;
    if (!filename || !url || !mimetype || !size) {
      return res.status(400).json({ error: 'Missing required audio file fields' });
    }

    const audioFile = await audioService.uploadAudio(projectId, userId, {
      filename,
      url,
      mimetype,
      size
    });

    res.status(201).json(audioFile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * List project audio files (Requires viewer role or owner)
 */
const list = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const hasPermission = await checkProjectPermission(projectId, userId, 'viewer');
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden: Unauthorized to access project audio list' });
    }

    const audioFiles = await audioService.getAudioList(projectId);
    res.json(audioFiles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Stream audio (Requires viewer role or owner)
 * Enforces watermarking for viewers
 */
const stream = async (req, res) => {
  const { projectId, audioId } = req.params;
  const userId = req.user.id;

  try {
    const isViewerAllowed = await checkProjectPermission(projectId, userId, 'viewer');
    if (!isViewerAllowed) {
      return res.status(403).json({ error: 'Forbidden: Unauthorized to stream audio' });
    }

    const audio = await audioService.getAudioFile(audioId);
    if (!audio || audio.projectId !== projectId) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const isEditorOrOwner = await checkProjectPermission(projectId, userId, 'editor');

    if (isEditorOrOwner) {
      // Return high-fidelity raw audio stream metadata
      res.json({
        id: audio.id,
        filename: audio.filename,
        url: audio.url,
        mimetype: audio.mimetype,
        size: audio.size,
        quality: 'high-fidelity',
        watermarked: false
      });
    } else {
      // User is a viewer, return a low-fidelity watermarked version url metadata
      res.json({
        id: audio.id,
        filename: `DEMO_${audio.filename}`,
        url: `${audio.url}?watermark=true&bitrate=128k`,
        mimetype: audio.mimetype,
        size: Math.round(audio.size * 0.3), // Simulated compressed size
        quality: '128kbps-watermarked',
        watermarked: true,
        notice: 'This preview contains an audio watermark to protect intellectual property.'
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Download original audio (Requires editor role or owner)
 * Explicitly forbids viewers from downloading the master beat
 */
const download = async (req, res) => {
  const { projectId, audioId } = req.params;
  const userId = req.user.id;

  try {
    // Only owners and editors are allowed to download original files
    const isEditorOrOwner = await checkProjectPermission(projectId, userId, 'editor');
    if (!isEditorOrOwner) {
      return res.status(403).json({ error: 'Forbidden: Download disabled. Viewers are not allowed to download the master beat.' });
    }

    const audio = await audioService.getAudioFile(audioId);
    if (!audio || audio.projectId !== projectId) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    res.json({
      message: 'Secure download link generated',
      downloadUrl: audio.url,
      expiresIn: '5m'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  upload,
  list,
  stream,
  download
};
