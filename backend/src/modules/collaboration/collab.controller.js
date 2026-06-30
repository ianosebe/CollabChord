const collabService = require('./collab.service');

const invite = async (req, res) => {
  try {
    const { projectId, userId, role } = req.body;

    const result = await collabService.inviteUser(projectId, userId, req.user.id, role);
    res.status(201).json(result);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /collaboration/accept
 */
const accept = async (req, res) => {
  try {
    const result = await collabService.acceptInvite(
      req.body.collabId,
      req.user.id
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /collaboration/reject
 */
const reject = async (req, res) => {
  try {
    const result = await collabService.rejectInvite(
      req.body.collabId,
      req.user.id
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /collaboration/project/:id
 */
const getProjectCollabs = async (req, res) => {
  try {
    const result = await collabService.getProjectCollaborators(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  invite,
  accept,
  reject,
  getProjectCollabs
};
