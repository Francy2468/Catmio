const { Router } = require('express');
const { obfuscate } = require('../controllers/obfuscatorController');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.post('/', authMiddleware, obfuscate);

module.exports = router;
