const router = require('express').Router()
const controller = require('../controllers/position')
const pass = require('../middleware/pass')

router.get('/:categoryId', pass(), controller.getByCategoryId)
router.post('/', pass(), controller.create)
router.patch('/:id', pass(), controller.update)
router.delete('/:id', pass(), controller.remove)

module.exports = router