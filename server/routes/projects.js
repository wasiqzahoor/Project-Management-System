const express = require('express');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/stats', getProjectStats);

module.exports = router;