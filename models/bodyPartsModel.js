const mongoose = require('mongoose')

const bodyPartsSchema = new mongoose.Schema({
    statisticFor: {
        type: mongoose.Schema.ObjectId
    },
    neck: {
        type: Number
    },
    shoulder: {
        type: Number
    },
    bust: {
        type: Number
    },
    waist: {
        type: Number
    },
    abdomen: {
        type: Number
    },
    hip: {
        type: Number
    },
    leftBiceps: {
        type: Number
    },
    rightBiceps: {
        type: Number
    },
    leftThigh: {
        type: Number
    },
    rightThigh: {
        type: Number
    },
    leftCalf: {
        type: Number
    },
    rightCalf: {
        type: Number
    },
    recordingDate: {
        type: Date,
        default: new Date()
    }
})

const BodyPartMeasurement = mongoose.model('BodyPartMeasurement', bodyPartsSchema)

module.exports = BodyPartMeasurement