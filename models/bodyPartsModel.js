const mongoose = require('mongoose')

const bodyPartsSchema = new mongoose.Schema({
    statisticFor: {
        type: mongoose.Schema.ObjectId
    },
    neck: {
        type: String
    },
    shoulder: {
        type: String
    },
    bust: {
        type: String
    },
    waist: {
        type: String
    },
    abdomen: {
        type: String
    },
    hip: {
        type: String
    },
    leftBiceps: {
        type: String
    },
    rightBiceps: {
        type: String
    },
    leftThigh: {
        type: String
    },
    rightThigh: {
        type: String
    },
    leftCalf: {
        type: String
    },
    rightCalf: {
        type: String
    },
    recordingDate: {
        type: Date,
        default: new Date()
    }
})

const BodyPartMeasurement = mongoose.model('BodyPartMeasurement', bodyPartsSchema)

module.exports = BodyPartMeasurement