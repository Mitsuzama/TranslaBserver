import dotenv from 'dotenv'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import indexRouter from './routes/index.js'
import serieRouter from './routes/series.js'
import episodRouter from './routes/episod.js'

const app = express()

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

mongoose.connect(process.env.DATABASE_URL, { })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.error('Connected to My Goose(i know it\'s mongoose)'))

app.use('/', indexRouter)
app.use('/series', serieRouter)
app.use('/episodes', episodRouter)

app.listen(process.env.PORT || 3000)
