const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async (req, res) => {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [] //заказов вчера

        // Количесто заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length

        // Количесто заказов
        const totalOrdersNumber = allOrders.length

        // Количество дней всего
        const daysNumber = Object.keys(ordersMap).length

        // Заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)

        // ((заказов вчера / кол-во заказов в день) - 1) * 100
        // Процент для кол-ва заказов
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)

        // общая выручка
        const totalGain = calculatePrice(allOrders)

        // выручка в день
        const gainPerDay = totalGain / daysNumber

        // выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)

        // процент выручки
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)

        // Сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)

        // Сравнение кол-ва заказов
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: { // выручка
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: gainPercent > 0   // является ли выручка за вчера больше чем средняя
            },
            orders: { // заказы
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),  // сравнение заказов
                yesterday: +yesterdayOrdersNumber,  // заказов вчера
                isHigher: ordersPercent > 0   
            }
        })

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = async (req, res) => {
    try {
        // все заказы пользователя, отсортированные по дате
        const allOrders = await Order.find({user: req.user.id}).sort({data: 1})
        // карта заказов, где ключи - это дни в формате "dd.MM.yyyy"
        const ordersMap = getOrdersMap(allOrders)
        // средний чек
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        const chart = Object.keys(ordersMap).map(label => {
            // label == 05.05.2018
            const gain = calculatePrice(ordersMap[label])   // выручка за один день
            const order = ordersMap[label].length           // кол-во заказов за день

            return {label, order, gain}
        })

        res.status(200).json({average, chart})  // средний чек и данные для графиков: выручки и заказов

    } catch (e) {
        errorHandler(res, e)
    }
}

function getOrdersMap(orders = []) {
    const daysOrders = {}

    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }
        daysOrders[date].push(order)
    })

    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice    
    }, 0)
}