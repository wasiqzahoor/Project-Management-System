const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  uploadAttachment,
  getAllUserTasks
} = require('../controllers/taskController');
const { auth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(auth);
router.get('/all', getAllUserTasks);
router.get('/project/:projectId', getTasks);
router.post('/project/:projectId', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);
router.post('/:id/upload', upload.single('file'), uploadAttachment);

module.exports = router;