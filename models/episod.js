// const mongoose = require('mongoose')
import mongoose from 'mongoose'

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

// module.exports = mongoose.model('Episod', episodSchema)
// module.exports.translatedFileBasePath = translatedFileBasePath

// export default mongoose.model('Episod', episodSchema)
// export default translatedFileBasePath

export const Episod = mongoose.model('Episod', episodSchema)
export const translatedFileBasePath = 'uploads/translatedFiles'
// export const translatedFileBasePath = translatedFileBasePath;
