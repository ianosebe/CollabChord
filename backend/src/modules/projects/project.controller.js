const projectService = require('./project.service');

/**
 * POST /projects
 */
const create = async (req, res) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /projects
 */
const getAll = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /projects/:id
 */
const getOne = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  remove
};
