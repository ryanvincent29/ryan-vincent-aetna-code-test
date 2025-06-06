const router = require('express').Router();
const healthcheckController = require('../controllers/healthcheckController')

router.get('/health', healthcheckController.healthcheck);

module.exports = router;