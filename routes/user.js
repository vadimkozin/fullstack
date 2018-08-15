const router = require('express').Router()
const controller = require('../controllers/user')
const pass = require('../middleware/pass')

// router.get('/', pass(), controller.getAll)
router.get('/', controller.getAll)


module.exports = router