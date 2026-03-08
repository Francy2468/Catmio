const { Router } = require('express');
const { logExecution, getExecutions, getExecutionStats } = require('../controllers/executionController');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.post('/', authMiddleware, logExecution);
router.get('/stats', authMiddleware, getExecutionStats);
router.get('/', authMiddleware, getExecutions);

module.exports = router;
