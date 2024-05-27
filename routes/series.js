const express = require('express')
const router = express.Router()
const Serie = require('../models/serie')

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
router.post('/', async (req, res) => {
    console.log('Request file:', req.file)

    const serie = new Serie({
        title: req.body.title,
        description: req.body.description,
        noOfEpisodes: req.body.noOfEpisodes
    })
    saveCover(serie, req.body.cover)

    try {
        const newSerie = await serie.save();
        // res.redirect(`series/${newSerie.id}`);
        res.redirect(`series`);
    }
    catch (err){
        res.render('series/new', {
            serie: serie,
            errorMessage: 'Error creating Serie'
        });
    }
})

// Check if we have a valid cover. If true, save it
function saveCover(serie, coverEncoded) {
    if(coverEncoded ==null) return
    const cover = JSON.parse(coverEncoded)
    if (cover!=null) {
        serie.coverPicture = new Buffer.from(cover.data, 'base64')
        serie.coverImageType = cover.type
    }
}

module.exports = router