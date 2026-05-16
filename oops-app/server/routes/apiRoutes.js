const express = require('express');
const router = express.Router();
const { getForecast, getProfiles, getExMessage, getRedFlags, validatePassword } = require('../controllers/apiController');

router.get('/forecast', getForecast);
router.get('/profiles', getProfiles);
router.get('/ex-message', getExMessage);
router.get('/red-flags', getRedFlags);
router.post('/validate-password', validatePassword);

module.exports = router;
