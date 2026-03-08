const { Router } = require('express');
const {
  getUsers,
  banUser,
  unbanUser,
  banHwid,
  unbanHwid,
  resetHwid,
  getAnalytics,
  getAllExecutions,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

const router = Router();

/** Middleware that ensures the authenticated user has the admin role. */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// All admin routes require a valid JWT AND the admin role
router.use(authMiddleware, requireAdmin);

router.get('/users', getUsers);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/unban', unbanUser);
router.post('/users/:id/ban-hwid', banHwid);
router.post('/users/:id/unban-hwid', unbanHwid);
router.post('/users/:id/reset-hwid', resetHwid);
router.get('/analytics', getAnalytics);
router.get('/executions', getAllExecutions);

module.exports = router;
