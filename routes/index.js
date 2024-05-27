const express = require('express')
const router = express.Router()
const Episod = require('../models/episod')

router.get('/', async (req, res) => {
    let episodes
    
    try {
        episodes = await Episod.find().sort({ createAt: 'desc'}).exec()
    }
    catch (err){
        console.err(err)
        episodes = []
    }
    res.render('index', { episodes: episodes})
})


module.exports = router