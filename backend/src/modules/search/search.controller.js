const searchService = require('./search.service');

/**
 * GET /search/users?q=...
 */
const users = async (req, res) => {
  try {
    const result = await searchService.searchUsers(req.query.q || '');
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /search/projects?q=...
 */
const projects = async (req, res) => {
  try {
    const result = await searchService.searchProjects(req.query.q || '');
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  users,
  projects
};
