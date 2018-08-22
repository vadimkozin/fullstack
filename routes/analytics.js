const router = require('express').Router()
const controller = require('../controllers/analytics')
const pass = require('../middleware/pass')

router.get('/overview', pass(), controller.overview)

router.get('/analytics', pass(), controller.analytics)

module.exports = router