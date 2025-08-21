const router = require('express').Router();
const { addtask, getAllTasks, deleteTasks, updateTasks } = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/add', verifyToken,addtask);
router.get('/',verifyToken, getAllTasks);
router.put('/:id', verifyToken, updateTasks);
router.delete('/:id',verifyToken, deleteTasks);

module.exports = router;