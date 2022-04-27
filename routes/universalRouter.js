const express = require('express');
const router = express.Router();

const service = require('../services/universalService');

router.post('/login', service.login);
router.post('/register', service.register);
router.post('/forget', service.forget);
router.post('/verify', service.verify);
router.get('/checkUpdates', service.checkUpdates);

module.exports = router;
