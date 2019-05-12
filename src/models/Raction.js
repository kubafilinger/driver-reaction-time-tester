class Reaction {
  constructor(time, withSound, age = null, sex = null, driverLicense = null) {
    this.time = parseFloat(time)
    this.withSound = withSound
    this.age = parseInt(age)
    this.sex = sex
    this.driverLicense = parseInt(driverLicense)
    this.createdAt = new Date()
  }

  toJson() {
    return {
      time: this.time,
      withSound: this.withSound,
      age: this.age,
      sex: this.sex,
      driverLicense: this.driverLicense,
      createdAt: this.createdAt.getTime(),
    }
  }
}

module.exports = Reaction;