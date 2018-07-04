const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async (req, res) => {

    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // Проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // Генерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})

            res.status(200).json({ 
                token: `Bearer ${token}`
            })

        } else {
            // Пароли не совпали
            res.status(401).json({  // 401 - Unauthorized
                message: 'Пароли не совпадают. Попробуйте снова.'
            })
        }
    } else {
        // Пользователя нет, ошибка
         res.status(404).json({
             message: 'Пользователь с таким email не найден.'
         })
    }

}

module.exports.register = async (req, res) => {
    // email password
    const candidate = await User.findOne({email: req.body.email})
    
    if (candidate) {
        // Пользователь существует, нужно отправить ошибку
        res.status(409).json({ // 409- Conflict
            message: 'Такой email уже занят. Попробуйте другой.'
        })        
    } else {
        // Нужно соэдать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password

        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            // 201 - Created
            res.status(201).json(user)
        } catch(e) {
            // Обработать ошибку
            errorHandler(res, e)
        }
        
    }
}