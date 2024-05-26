const mongoose = require('mongoose')

const translatedFileBasePath = 'uploads/translatedFiles'

const episodSchema = new mongoose.Schema({
    episodeNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    totalNumberOfLines: {
        type: Number,
        required: true
    },
    ownerSerie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Serie'
    },
    translatedFile: {
        type: String
    }
})

module.exports = mongoose.model('Episod', episodSchema)
module.exports.translatedFileBasePath = translatedFileBasePath
