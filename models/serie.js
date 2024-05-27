const mongoose = require('mongoose')
const path = require('path')

const serieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    coverPicture: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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

serieSchema.virtual('coverImagePath').get(function() {
    if (this.coverPicture != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverPicture.toString('base64')}`
    }
})

module.exports = mongoose.model('Serie', serieSchema)
