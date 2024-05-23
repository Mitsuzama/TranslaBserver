const express = require('express')
const router = express.Router()
const Serie = require('../models/serie')


// All Anime Shows(Serie) route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
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
    const serie = new Serie({
        name: req.body.name
    })

    try {
        const newSerie = await serie.save();
        // res.redirect(`series/${newSerie.id}`);
        res.redirect('series');
    } catch (err) {
        res.render('series/new', {
            serie: serie,
            errorMessage: 'Error creating Serie'
        });
    }
})


module.exports = router