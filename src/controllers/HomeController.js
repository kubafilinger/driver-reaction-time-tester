const path = require('path')

module.exports = {
  homeAction: (req, res) => {
    res.sendFile(path.resolve('index.html'))
  }
}