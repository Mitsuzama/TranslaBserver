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

serieSchema.virtual('coverImagePath').get(function() {
    if (this.coverPicture != null) {
        return path.join('/', coverImageBasePath, this.coverPicture)
    }
})

module.exports = mongoose.model('Serie', serieSchema)
module.exports.coverImageBasePath = coverImageBasePath
