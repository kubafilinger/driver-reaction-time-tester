const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use('/public', express.static('public'))

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.get('/times', (req, res) => {
  console.log('list')
})

app.post('/times', (req, res) => {
  console.log('save')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))