const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Recording = require('../models/recordingModel')

exports.recordStatistics = catchAsync(async (req, res, next) => {
    const recording = await Recording.create({
        statisticFor: "61694f514a0be9c60b108ee0",
        currentWeight: req.body.currentWeight,
        bodyFat: req.body.bodyFat,
        recordingDate: req.body.recordingDate
    })

    // ROUTE VALIDATE TODO

    res.status(201).json({
        message: 'success',
        recording
    })
})