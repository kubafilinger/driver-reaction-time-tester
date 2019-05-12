const Reaction = require("./src/models/Raction")
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./src/config')
const ReactionController = require('./src/controllers/ReactionController')
const HomeController = require('./src/controllers/HomeController')

const app = express()
const port = 3000

mongoose.connect(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`, {useNewUrlParser: true});

app.use(bodyParser.json())
app.use('/public', express.static('public'))

app.get('/', HomeController.homeAction)
app.get('/times', ReactionController.listAction)
app.get('/times/:format', ReactionController.downloadAction)
app.post('/times', ReactionController.saveAction)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))