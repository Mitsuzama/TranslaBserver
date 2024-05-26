const express = require('express')
const router = express.Router()
const Serie = require('../models/serie')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Serie.coverImageBasePath)
const upload = multer({
    dest: uploadPath
})

// All Anime Shows(Serie) route
router.get('/', async (req, res) => {
    let searchOptions = {}

    if (req.query.title != null && req.query.title !== ''){
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    
    try {
        const series = await Serie.find(searchOptions)
        res.render('series/index', {
            series: series,
            searchOptions: req.query
        })
    } catch(err) {
        res.redirect('/')
    }
})

// New Anime Show (Serie) Route
router.get('/new', (req, res) =>
    res.render('series/new', { serie: new Serie() })
)

// Create Translated Anime Show
router.post('/', upload.single('cover'), async (req, res) => {
    console.log('Request file:', req.file)
    const fileName = req.file != null ? req.file.filename : null

    const serie = new Serie({
        title: req.body.title,
        description: req.body.description,
        noOfEpisodes: req.body.noOfEpisodes,
        coverPicture: fileName
    })

    try {
        const newSerie = await serie.save();
        // res.redirect(`series/${newSerie.id}`);
        res.redirect(`series`);
    }
    catch (err){
        if(serie.coverPicture != null){
            removeCoverPicture(serie.coverPicture)
        }
        res.render('series/new', {
            serie: serie,
            errorMessage: 'Error creating Serie'
        });
    }
})

function removeCoverPicture(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) {
            console.err(err)
        }
    })
}

module.exports = router