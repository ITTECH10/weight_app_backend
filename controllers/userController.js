const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Recording = require('../models/recordingModel')
const User = require('../models/userModel')

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    if (!users) {
        return next(new AppError('No users were found in our database.', 404))
    }

    res.status(200).json({
        message: 'success',
        users
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const me = await User.findOne({ _id: req.user._id })

    if (!me) {
        return next(new AppError('Failed to load your account data, please try again later.', 500))
    }

    res.status(200).json({
        message: 'success',
        me
    })
})

exports.recordStatistics = catchAsync(async (req, res, next) => {
    const recording = await Recording.create({
        statisticFor: req.user._id,
        currentHeight: req.body.currentHeight,
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

exports.getUserRelatedRecordings = catchAsync(async (req, res, next) => {
    const recordings = await Recording.find({ statisticFor: req.user._id })

    if (!recordings) {
        return next(new AppError('There were no recordings found for your account.', 404))
    }

    res.status(200).json({
        message: 'success',
        recordings
    })
})

exports.getMostRecentAndInitialRecording = catchAsync(async (req, res, next) => {
    const mostRecentRecording = await Recording.findOne({ statisticFor: req.user._id }).sort({ 'recordingDate': -1 })
    const initialRecording = await Recording.findOne({ statisticFor: req.user._id }).sort({ 'recordingDate': 1 })

    if (!mostRecentRecording || !initialRecording) {
        return next(new AppError('Most recent or initial recording missing', 404))
    }

    res.status(200).json({
        message: 'success',
        mostRecentRecording,
        initialRecording
    })
})

exports.setWeightAndBodyFatGoal = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })

    if (!user) {
        return next(new AppError('There was a problem setting your goal. Please try again later.', 500))
    }

    user.weightGoal = req.body.weightGoal || user.weightGoal
    user.bodyFatGoal = req.body.bodyFatGoal || user.bodyFatGoal
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.takeRecordingNote = catchAsync(async (req, res, next) => {
    const recording = await Recording.findOne({ _id: req.params.recordingId })

    if (!recording) {
        return next(new AppError('Recording does not exist', 404))
    }

    recording.recordingNote = req.body.recordingNote || recording.recordingNote
    await recording.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        recording
    })
})