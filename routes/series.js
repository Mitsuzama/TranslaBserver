import express from 'express'
import Serie from '../models/serie.js'
import { Episod } from '../models/episod.js'

const router = express.Router()
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// dependencies
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const client = new S3Client({})
///

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
    } catch {
        res.redirect('/')
    }
})

// New Anime Show (Serie) Route
router.get('/new', (req, res) =>
    res.render('series/new', { serie: new Serie() })
)

// Create Translated Anime Show
router.post('/', async (req, res) => {
    console.log('Create Translated Anime Show: req.body:', req.body)

    const serie = new Serie({
        title: req.body.title,
        description: req.body.description,
        noOfEpisodes: req.body.noOfEpisodes
    })
    try {
        saveCover(serie, req.body.cover)

        // AWS part
        const command = new PutObjectCommand({
            Bucket: "translabserver-bucket",
            Key: `covers/${serie.aws_s3_title}`,
            Body: serie.coverPicture,
            ContentType: serie.coverImageType
        })

    
        const newSerie = await serie.save()
        res.redirect(`series/${newSerie.id}`)

        // AWS s3
        const response = await client.send(command)
        console.log(response)
        //
    } catch {
        res.render('series/new', {
            serie: serie,
            errorMessage: 'Error creating Serie'
        })
        // renderNewPage(res, book, true)
    }
})

// :id - A variable with the value id will be passed along with the request
router.get('/:id', async (req, res) => {
    try {
        const serie = await Serie.findById(req.params.id)
        const episodes = await Episod.find({ ownerSerie: serie.id }).limit(6).exec()
        res.render('series/show', {
            serie: serie,
            episodesOfSeries: episodes
        })
    } catch {
        res.redirect('/')
    }
})

// Edit path
router.get('/:id/edit', async (req, res) => {
    try {
        const serie = await Serie.findById(req.params.id)
        res.render('series/edit', { serie: serie })
    } catch(err) {
        res.redirect('/series')
    }
})

//Update route
router.put('/:id', async (req, res) => {
    let serie
    try {
        serie = await Serie.findById(req.params.id)

        //Update the series
        serie.title = req.body.title
        serie.description = req.body.description
        serie.noOfEpisodes = req.body.noOfEpisodes
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(serie, req.body.cover)
        }
        //

        // AWS part
        const command = new PutObjectCommand({
            Bucket: "translabserver-bucket",
            Key: `covers/${serie.aws_s3_title}`,
            Body: serie.coverPicture,
            ContentType: serie.coverImageType
        })

        // AWS s3
        const response = await client.send(command)
        console.log(response)
        //

        await serie.save()
        res.redirect(`/series/${serie.id}`)

        
    } catch {
        if (serie == null) {
            res.redirect('/')
        } else {
            res.render('series/edit', {
                serie: serie,
                errorMessage: 'Error Updating Serie'
            })
        }
    }
})

// Delete route
router.delete('/:id', async (req, res) => {
    let serie
    try {
        serie = await Serie.findById(req.params.id)

        // AWS part
        // const command = new DeleteObjectCommand ({
        //     Bucket: "translabserver-bucket",
        //     Key: `covers/${serie.aws_s3_title}`
        // })

        await serie.deleteOne()
        res.redirect('/series')

        // AWS s3
        // const response = await client.send(command)
        // console.log(response)
        //
    } catch{
        if (serie == null) {
            res.redirect('/')
        } else {
        res.redirect(`/series/${serie.id}`)
        }
    }
})

function saveCover(serie, coverEncoded) {
    if (coverEncoded == null) {
        return
    }
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        serie.coverPicture = new Buffer.from(cover.data, 'base64')
        serie.coverImageType = cover.type
        serie.aws_s3_title = Date.now() + '_' + cover.name
    }
}


export default router