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
      const reactionWithoutSoundObj = new Reaction(reactionWithoutSound[i], true, age, sex, driverLicense)
      reactionRepository.save(reactionWithoutSoundObj)
    }

    res.statusCode = 201
    res.send('OK')
  },

  listAction: async (req, res) => {
    const reactionRepository = new ReactionRepository()
    const reactions = await reactionRepository.findAll()

    res.statusCode = 200
    res.json(reactions)
  },

  downloadAction: async (req, res) => {
    const reactionRepository = new ReactionRepository()
    const reactions = await reactionRepository.findAll()
    const fields = ['time', 'withSound', 'age', 'sex', 'driverLicense', 'createdAt']
    const parser = new Parser({ fields })

    const { format } = req.params;

    if (format === 'csv') {
      const csv = parser.parse(reactions)

      res.statusCode = 200
      res.send(csv)
    } else {
      res.statusCode = 422
      res.json({
        error: {
          message: "Format not supported"
        }
      })
    }
  }
}
