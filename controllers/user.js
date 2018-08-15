const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async (req, res) => {
    try {
        const users = await User.find({}, 'email')
        res.status(200).json(users)
    } catch(e) {
        errorHandler(e)
    }
}