const Category = require('../models/Category')
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find({user: req.user.id})
        res.status(200).json(categories)
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const category = await Category.findById(req.params.id)
        res.status(200).json(category)
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Category.remove({_id: req.params.id})
        await Position.remove({category: req.params.id})
        res.status(200).json({
            message: 'Категория удалена'
        })
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.create = async function (req, res) {
    try {
        const category = await new Category({
            name: req.body.name,
            imgSrc: req.file ? req.file.path : '',
            user: req.user.id
        }).save()
        res.status(201).json(category)
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name
    }

    if (req.file) {
        updated.imgSrc = req.file.path
    }

    try {
        const category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated}, // req.body
            {new: true}
        )
        res.status(200).json(category)
    } catch (err) {
        errorHandler(res, err)
    }
}