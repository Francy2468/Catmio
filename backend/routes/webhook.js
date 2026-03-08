const { Router } = require('express');
const { updateWebhookUrl, testWebhook } = require('../controllers/webhookController');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.put('/url', authMiddleware, updateWebhookUrl);
router.post('/test', authMiddleware, testWebhook);

module.exports = router;
