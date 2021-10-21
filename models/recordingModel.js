const mongoose = require('mongoose')

const recordingSchema = new mongoose.Schema({
    statisticFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    currentHeight: {
        type: String,
        default: '170'
    },
    currentWeight: {
        type: Number,
        default: 0
    },
    weightUnit: {
        type: String,
        default: 'kg'
    },
    bodyFat: {
        type: Number,
        default: 15
    },
    BMI: {
        type: Number,
        default: 0
    },
    recordingDate: {
        type: Date,
        default: Date.now()
    },
    recordingNote: {
        type: String
    }
})

recordingSchema.pre(/^find/, function () {
    this.populate('statisticFor')
})

recordingSchema.pre('save', function () {
    // CALCULATING BMI
    this.BMI = Number(this.currentWeight / (+this.currentHeight * +this.currentHeight) * 10000).toFixed(1)
})

const Recording = mongoose.model('Recording', recordingSchema)

module.exports = Recording