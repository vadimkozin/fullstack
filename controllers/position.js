const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async (req, res) => {
    try {
        const posiotions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        })
        res.status(200).json(posiotions)
    } catch(e) {
        errorHandler(e)
    }
}

module.exports.create = async (req, res) => {
    try {
        const positions = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id,
        }).save()
        res.status(201).json(positions)
    } catch(e) {
        errorHandler(e)
    }
}

module.exports.remove = async (req, res) => {
    try {
        //await Position.findByIdAndRemove({_id: req.params.id})
        await Position.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Позиция была удалена'
        })
    } catch(e) {
        errorHandler(e)
    }
}

module.exports.update = async (req, res) => {
    try {
         const position = await  Position.findOneAndUpdate(
             {_id: req.params.id},
             {$set: req.body},  // все ключи для обновления берём из body
             {new: true}        // вернёт обновлённую позицию
            )
        res.status(200).json(position)
    } catch(e) {
        errorHandler(e)
    }
}
