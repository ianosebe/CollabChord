const analyticsService = require('./analytics.service');

/**
 * GET /analytics/platform
 */
const platformStats = async (req, res) => {
  try {
    const stats = await analyticsService.getPlatformStats();
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /analytics/me
 */
const myStats = async (req, res) => {
  try {
    const stats = await analyticsService.getUserStats(req.user.id);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  platformStats,
  myStats
};
