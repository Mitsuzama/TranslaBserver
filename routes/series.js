// const express = require('express')
import express from 'express'
const router = express.Router()
// const Serie = require('../models/serie')
import Serie from '../models/serie.js'

///
// dependencies
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// create S3 client
// const s3 = new S3Client({region: 'us-east-1'})
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
    // saveCover(serie, req.body.cover)

    //Save the cover
    if(req.body.cover == null)
            return

    const cover = JSON.parse(req.body.cover)
    if (cover != null) {
        serie.coverPicture = new Buffer.from(cover.data, 'base64')
        serie.coverImageType = cover.type
    }

    // AWS part
    const command = new PutObjectCommand({
        Bucket: "translabserver-bucket",
        Key: `covers/${Date.now()}_${req.body.title}`,
        Body: serie.coverPicture,
        ContentType: serie.coverImageType
    })

    try {
        const newSerie = await serie.save()
        // res.redirect(`series/${newSerie.id}`)

        // AWS s3
        const response = await client.send(command)
        console.log(response)
        //

        res.redirect(`series`)
    }
    catch (err){
        console.error(err)

        res.render('series/new', {
            serie: serie,
            errorMessage: 'Error creating Serie'
        })
    }
})

// Check if we have a valid cover. If true, save it
// function saveCover(serie, coverEncoded) {
//     if(coverEncoded ==null) return
//     const cover = JSON.parse(coverEncoded)
//     if (cover != null) {
//         serie.coverPicture = new Buffer.from(cover.data, 'base64')
//         serie.coverImageType = cover.type
//     }
// }

export default router