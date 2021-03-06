const Reaction = require("../models/Raction")
const { Parser } = require('json2csv')
const ReactionRepository = require('../repositories/ReactionRepository')

module.exports = {
  saveAction: (req, res) => {
    const reactionRepository = new ReactionRepository()
    const { age, sex, driverLicense, reactionWithSound, reactionWithoutSound } = req.body

    for (let i = 0; i < reactionWithSound.length; i++) {
      const reactionWithSoundObj = new Reaction(reactionWithSound[i], true, age, sex, driverLicense)
      reactionRepository.save(reactionWithSoundObj)
    }

    for (let i = 0; i < reactionWithoutSound.length; i++) {
      const reactionWithoutSoundObj = new Reaction(reactionWithoutSound[i], false, age, sex, driverLicense)
      reactionRepository.save(reactionWithoutSoundObj)
    }

    res.statusCode = 201
    res.send('OK')
  },

  listAction: async (req, res) => {
    const reactionRepository = new ReactionRepository()
    const reactions = await reactionRepository.find(100)

    res.statusCode = 200
    res.json(reactions)
  },
}
