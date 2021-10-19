const mongoose = require('mongoose')

const recordingSchema = new mongoose.Schema({
    statisticFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    currentHeight: {
        type: String
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
    BMI: {
        type: String
    },
    recordingDate: {
        type: Date,
        default: Date.now()
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