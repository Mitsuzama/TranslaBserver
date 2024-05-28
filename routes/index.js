// const express = require('express')
import express from 'express'
const indexRouter = express.Router()
// const Episod = equire('../models/episod')
import { Episod, translatedFileBasePath } from '../models/episod.js'

indexRouter.get('/', async (req, res) => {
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


// module.exports = router
export default indexRouter