import mongoose from 'mongoose'
import { Episod } from './episod.js'

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
    description: {
        type: String
    },
    noOfEpisodes: {
        type: String
    },
    aws_s3_title: {
        type: String
    }
})

serieSchema.virtual('coverImagePath').get(function() {
    if (this.coverPicture != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverPicture.toString('base64')}`
    }
})

// In case we want to delete a series, we should not be able in case of linked episodes
serieSchema.pre('remove', function(next) {
    Episod.find({ ownerSerie: this.id }, (err, episods) => {
        if (err) { // if we have errors
            next(err)
        } else if (episods.length > 0) { //if we have episodes
            next(new Error('This anime series has episodes attached'))
        } else {
            next()
        }
    })
})

const Serie = mongoose.model('Serie', serieSchema)
export default Serie
