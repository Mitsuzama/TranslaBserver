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
        type: Buffer
    },
    translatedFileType: {
        type: String
    },
    aws_s3_title: {
        type: String
    }
})

episodSchema.virtual('translatedFilePath').get(function() {
    if(this.translatedFile != null) {
        return `data:${this.translatedFileType};charset=utf-8;base64,${this.translatedFile.toString('base64')}`
    }
})
export const Episod = mongoose.model('Episod', episodSchema)
export const translatedFileBasePath = 'uploads/translatedFiles'
