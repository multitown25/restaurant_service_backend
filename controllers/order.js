const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    // filters
    const query = {
        user: req.user.id
    }

    // all orders from start (older than start)
    if (req.query.start) {
        query.date = {
            $gte: req.query.start
        }
    }

    // to end (earlier than end)
    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }
        query.date['$lte'] = req.query.end
    }

    // specific order number
    if (req.query.order) {
        query.order = +req.query.order
    }

    try {
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.body.limit)

        res.status(200).json(orders)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    const lastOrder = await Order
        .findOne({user: req.user.id})
        .sort({date: -1})

    const maxOrder = lastOrder ? lastOrder.order : 0

    try {
        const order = await new Order({
            user: req.user.id,
            list: req.body.list,
            order: maxOrder + 1,
            date: Date.now()
        }).save()
        console.log(maxOrder)
        res.status(201).json(order)
    } catch (e) {
        errorHandler(res, e)
    }
}