const router = require('express').Router()
const { Blog } = require('../models')
const { fn, col } = require('sequelize')

router.get('/', (req,res)=>{
    const authors = Blog.findAll({
        attributes:[
            'author',
            [fn('COUNT', col('id')),'blogs'],
            [fn('SUM',col('likes')),'likes']
        ],
        group:['author'],
        order:[
            [fn('SUM', col('likes')),'DESC']
        ]
    })
    res.json(authors)
})

module.exports = router