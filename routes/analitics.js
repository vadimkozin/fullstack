const router = require('express').Router()
const controller = require('../controllers/analitics')

router.get('/owerview', controller.overview)

router.get('/analytics', controller.analytics)

module.exports = router