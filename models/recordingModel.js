const mongoose = require('mongoose')

const recordingSchema = new mongoose.Schema({
    statisticFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    currentWeight: {
        type: Number
    },
    weightUnit: {
        type: String,
        default: 'kg'
    },
    bodyFat: {
        type: Number
    },
    recordingDate: {
        type: Date,
        default: Date.now()
    }
})

recordingSchema.pre(/^find/, function () {
    this.populate('statisticFor')
})

const Recording = mongoose.model('Recording', recordingSchema)

module.exports = Recording