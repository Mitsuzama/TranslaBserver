const mongoose = require('mongoose')

const serieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Serie', serieSchema)