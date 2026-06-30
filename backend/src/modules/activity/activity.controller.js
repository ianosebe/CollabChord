const activityService = require('./activity.service');

/**
 * GET /feed/global
 */
const globalFeed = async (req, res) => {
  try {
    const feed = await activityService.getGlobalFeed();
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /feed/me
 */
const myFeed = async (req, res) => {
  try {
    const feed = await activityService.getUserFeed(req.user.id);
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  globalFeed,
  myFeed
};
