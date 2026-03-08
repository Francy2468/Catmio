const { Router } = require('express');
const { loadScript } = require('../controllers/loaderController');

const router = Router();

router.get('/:script_id', loadScript);

module.exports = router;
