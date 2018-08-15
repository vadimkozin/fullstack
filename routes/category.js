const router = require('express').Router()
//const passport = require('passport')
const pass = require('../middleware/pass')
const upload = require('../middleware/upload')
const controller = require('../controllers/category')

router.get('/', pass() ,controller.getAll)
router.get('/:id', pass(), controller.getById)
router.delete('/:id', pass(), controller.remove)
router.post('/', pass(), upload.single('image'), controller.create)
router.patch('/:id',pass(), upload.single('image'), controller.update)

//function pass() {
//    return passport.authenticate('jwt', {session: false})
//}
module.exports = router