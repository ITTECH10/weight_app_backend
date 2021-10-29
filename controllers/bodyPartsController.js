const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const BodyPartMeasurement = require('../models/bodyPartsModel')
const Recording = require('../models/recordingModel')
const User = require('../models/userModel')
const DateGenerator = require('../utils/DateGenerator')

exports.recordCircumferences = catchAsync(async (req, res, next) => {
    const circumference = await BodyPartMeasurement.create({
        statisticFor: req.user._id,
        neck: req.body.neck,
        shoulder: req.body.shoulder,
        bust: req.body.bust,
        waist: req.body.waist,
        abdomen: req.body.abdomen,
        hip: req.body.hip,
        leftBiceps: req.body.leftBiceps,
        rightBiceps: req.body.rightBiceps,
        leftThigh: req.body.leftThigh,
        rightThigh: req.body.rightThigh,
        leftCalf: req.body.leftCalf,
        rightCalf: req.body.rightCalf,
        recordingDate: req.body.recordingDate
    })

    res.status(201).json({
        message: 'success',
        circumference
    })
})

exports.getCustomerBodyPartMeasurements = catchAsync(async (req, res, next) => {
    const measurements = await BodyPartMeasurement.find({ statisticFor: req.user._id })

    res.status(200).json({
        message: 'success',
        measurements
    })
})

exports.getWeeklyBodyPartRecordings = catchAsync(async (req, res, next) => {
    const today = new Date()
    const weekInPast = new DateGenerator().daysInPast(7)

    const weeklyRecordings = await BodyPartMeasurement.find({ statisticFor: req.user._id, recordingDate: { $lte: today, $gte: weekInPast } }).sort({ _id: 1 })

    res.status(200).json({
        message: 'success',
        weeklyRecordings
    })
})

exports.getMostRecentAndInitialBodyPartMeasure = catchAsync(async (req, res, next) => {
    const mostRecentBodyPartMeasure = await BodyPartMeasurement.findOne({ statisticFor: req.user._id }).sort({ 'recordingDate': -1 })
    const initialBodyPartMeasure = await BodyPartMeasurement.findOne({ statisticFor: req.user._id }).sort({ 'recordingDate': 1 })

    if (!mostRecentBodyPartMeasure || !initialBodyPartMeasure) {
        return next(new AppError('Most recent or initial body part measurement missing', 404))
    }

    res.status(200).json({
        message: 'success',
        mostRecentBodyPartMeasure,
        initialBodyPartMeasure
    })
})

exports.getAverageMonthlyBodyPartDimensions = catchAsync(async (req, res, next) => {
    const currentMonth = new Date().getMonth() + 1

    const averageMonthlyRecordings = await BodyPartMeasurement.aggregate([
        {
            $match: { statisticFor: req.user._id }
        },
        {
            $group: {
                _id: { $month: '$recordingDate' },
                averageNeckDimension: { $avg: '$neck' },
                averageShoulderDimension: { $avg: '$shoulder' },
                averageBustDimension: { $avg: '$bust' },
                averageWaistDimension: { $avg: '$waist' },
                averageAbdomenDimension: { $avg: '$abdomen' },
                averageHipDimension: { $avg: '$hip' },
                averageLeftBicepsDimension: { $avg: '$leftBiceps' },
                averageRightBicepsDimension: { $avg: '$rightBiceps' },
                averageLeftThighDimension: { $avg: '$leftThigh' },
                averageRightThighDimension: { $avg: '$rightThigh' },
                averageLeftCalfDimension: { $avg: '$leftCalf' },
                averageRightCalfDimension: { $avg: '$rightCalf' },
            }
        },
        {
            $project: {
                _id: 0,
                month: '$_id',
                averageNeckDimension: { $round: ['$averageNeckDimension', 1] },
                averageShoulderDimension: { $round: ['$averageShoulderDimension', 1] },
                averageBustDimension: { $round: ['$averageBustDimension', 1] },
                averageWaistDimension: { $round: ['$averageWaistDimension', 1] },
                averageAbdomenDimension: { $round: ['$averageAbdomenDimension', 1] },
                averageHipDimension: { $round: ['$averageHipDimension', 1] },
                averageLeftBicepsDimension: { $round: ['$averageLeftBicepsDimension', 1] },
                averageRightBicepsDimension: { $round: ['$averageRightBicepsDimension', 1] },
                averageLeftThighDimension: { $round: ['$averageLeftThighDimension', 1] },
                averageRightThighDimension: { $round: ['$averageRightThighDimension', 1] },
                averageLeftCalfDimension: { $round: ['$averageLeftCalfDimension', 1] },
                averageRightCalfDimension: { $round: ['$averageRightCalfDimension', 1] }
            }
        },
        {
            $sort: { month: 1 }
        },
        {
            $match: { month: { $lte: currentMonth, $gte: (currentMonth - 4) } }
        }
    ])

    res.status(200).json({
        message: 'success',
        averageMonthlyRecordings
    })
})
