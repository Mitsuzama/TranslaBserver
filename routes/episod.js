import express from 'express'
import { Episod, translatedFileBasePath } from '../models/episod.js'
import Serie from '../models/serie.js'
import path from 'path'
import multer from 'multer'
import fs from 'fs'

const episodRouter = express.Router()

const uploadTranslatedFilePath = path.join('public', translatedFileBasePath)
const upload = multer({
    dest: uploadTranslatedFilePath
})


// All Episodes route
episodRouter.get('/', async (req, res) => {
    let query = Episod.find()

    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.episodeNumber != null && req.query.episodeNumber != '') {
        query = query.regex('episodeNumber', new RegExp(req.query.episodeNumber, 'i'))
    }
    
    try {
        const episodes = await query.exec()
        res.render('episodes/index', {
            episodes: episodes,
            searchParameters: req.query
        })
    }
    catch {
        res.redirect('/')
    }
})

// New Episode Route
episodRouter.get('/new', async (req, res) => {
    renderNewPage(res, new Episod())
})

// Create Episode
episodRouter.post('/', upload.single('translatedFile'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null

    const episod = new Episod({
        episodeNumber: req.body.episodeNumber,
        title: req.body.title,
        totalNumberOfLines: req.body.totalNumberOfLines,
        ownerSerie: req.body.ownerSerie,
        translatedFile: fileName
    })

    try {
        const newEpisod = await episod.save()
        // res.redirect(`books/${newEpisod.id}`)
        res.redirect(`episodes`)
    }
    catch {
        if(episod.translatedFile != null){
            removeTranslationFile(episod.translatedFile)
        }
        renderNewPage(res, episod, true)
    }
})

async function renderNewPage(res, episod, hasError = false) {
    try {
        const series = await Serie.find({})
        const params = {
            series: series,
            episod: episod
        }
        if(hasError){
            params.errorMessaage = 'Error creating a new episode!!'
        }

        // render a new or existing episode
        res.render('episodes/new', params)
    } catch {
        res.redirect('/episodes')
    }
}

// function that unlinks the cover file
function removeTranslationFile(fileName) {
    fs.unlink(path.join(uploadTranslatedFilePath, fileName), err => {
        if(err) {
            console.err(err)
        }
    })
}

// module.exports = router
export default episodRouter