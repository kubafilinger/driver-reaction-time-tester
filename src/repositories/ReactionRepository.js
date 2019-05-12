const mongoose = require('mongoose')

class ReactionRepository {
  constructor() {
    this.db = mongoose.connection
  }

  save(reaction) {
    this.db.collection('reactions').insertOne(reaction.toJson(), (err, res) => {
      if (err) throw err
    })
  }

  findAll() {
    return this.db.collection('reactions').find({}, {
      projection: {
        _id: 0,
        time: 1,
        withSound: 1,
        age: 1,
        sex: 1,
        driverLicense: 1,
        createdAt: 1,
      }
    }).toArray()
  }
}

module.exports = ReactionRepository