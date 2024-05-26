const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/coverImage'

const serieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    coverPicture: {
        type: String,
        required: true
    },
    listOfTranslatedEpisodes: [{
        // list of episodes
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episod'
    }],
    description: {
        type: String
    },
    noOfEpisodes: {
        type: String
    }
})

module.exports = mongoose.model('Serie', serieSchema)
module.exports.coverImageBasePath = coverImageBasePath
