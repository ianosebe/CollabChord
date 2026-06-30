const userService = require('./user.service');

/**
 * GET /users/me
 */
const getMe = async (req, res) => {
  try {
    const user = await userService.getMyProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * PUT /users/me
 */
const updateMe = async (req, res) => {
  try {
    const updated = await userService.updateMyProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /users/:id
 */
const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getMe,
  updateMe,
  getUser
};
