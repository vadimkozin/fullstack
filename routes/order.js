const router = require('express').Router()
const controller = require('../controllers/order')
const pass = require('../middleware/pass')

router.get('/', pass(), controller.getAll)
router.post('/', pass(), controller.create)

module.exports = router