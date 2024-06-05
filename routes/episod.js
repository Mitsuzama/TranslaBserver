import express from 'express'
import { Episod, translatedFileBasePath } from '../models/episod.js'
import Serie from '../models/serie.js'
import path from 'path'
import multer from 'multer'
import fs from 'fs'

const episodRouter = express.Router()

const uploadTranslatedFilePath = path.join('public', translatedFileBasePath)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadTranslatedFilePath)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
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

    const episod = new Episod({
        episodeNumber: req.body.episodeNumber,
        title: req.body.title,
        totalNumberOfLines: req.body.totalNumberOfLines,
        ownerSerie: req.body.ownerSerie,
        translatedFileType: 'text/plain'
    })

    try {
        saveTranslatedFile(episod, req.body.translatedFile)
        const newEpisod = await episod.save()
        res.redirect(`episodes/${newEpisod.id}`)
    } catch (err) {
        console.log(err)
        // if (episod.translatedFile != null) {
        //     removeTranslationFile(episod.translatedFile)
        // }
        renderNewPage(res, episod, true)
    }
})

// Show Episode Route
episodRouter.get('/:id', async (req, res) => {
    try {
        const episod = await Episod.findById(req.params.id)
                                    .populate('ownerSerie')
                                    .exec()
        res.render('episodes/show', { episod: episod })
    } catch (err){
        console.log(err)
        res.redirect('/')
    }
})

// Edit Episode Route
episodRouter.get('/:id/edit', async (req, res) => {
    try {
        // res.redirect('/')
        const episod = await Episod.findById(req.params.id)
        renderEditPage(res, episod)
    } catch {
        res.redirect('/')
    }
})

//Update episode
episodRouter.put('/:id', async (req, res) => {
    let episod

    try {
        episod = await Episod.findById(req.params.id)
        episod.title = req.body.title
        episod.episodeNumber = req.body.episodeNumber
        episod.totalNumberOfLines = req.body.totalNumberOfLines
        episod.ownerSerie = req.body.ownerSerie
        if (req.body.translatedFile != null && req.body.translatedFile !== '') {
            saveTranslatedFile(episod, req.body.translatedFile)
        }

        await episod.save()
        res.redirect(`/episodes/${episod.id}`)
    } catch {
        if (episod != null) {
            renderEditPage(res, episod, true)
        } else {
            redirect('/')
        }
    }
})

// Delete Episode Page
episodRouter.delete('/:id', async (req, res) => {
    let episod
    try {
        episod = await Episod.findById(req.params.id)
        await episod.deleteOne()
        res.redirect('/episodes')
    } catch {
        if (episod != null) {
            res.render('episodes/show', {
                episod: episod,
                errorMessage: 'Could not remove episod'
            })
        } else {
            res.redirect('/')
        }
    }
})

// function that unlinks the cover file
function removeTranslationFile(fileName) {
    fs.unlink(path.join(uploadTranslatedFilePath, fileName), err => {
        if(err) {
            console.err(err)
        }
    })
}

// Render a form that represents the page for a new episode
async function renderNewPage(res, episod, hasError = false) {
    renderFormPage(res, episod, 'new', hasError)
}

// Render a form that represents the page used for editing an episode
async function renderEditPage(res, episod, hasError = false) {
    renderFormPage(res, episod, 'edit', hasError)
}

// Generalised function to render an edit or new page for episodes
async function renderFormPage(res, episod, form, hasError = false) {
    try {
        const series = await Serie.find({})
        const params = {
            series: series,
            episod: episod
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error editing the episode!!'
            } else {
                params.errorMessage = 'Error creating a new episode!!'
            }
        }
        // render a new or existing episode
        res.render(`episodes/${form}`, params)
    } catch {
        res.redirect('/episodes')
    }
}

function saveTranslatedFile(episod, trfileEncoded) {
    if (trfileEncoded == null) {
        return
    }
    const translatedFile = JSON.parse(trfileEncoded)
    if (translatedFile != null) {
        episod.translatedFile = new Buffer.from(translatedFile.data, 'base64')
        episod.translatedFileType = translatedFile.type
        episod.aws_s3_title = Date.now() + '_' + translatedFile.name
    }
}

// module.exports = router
export default episodRouter