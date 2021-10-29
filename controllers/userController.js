const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Recording = require('../models/recordingModel')
const User = require('../models/userModel')
const DateGenerator = require('../utils/DateGenerator')
const EmailNotifications = require('./../services/EMAIL/EmailNotifications')
const signToken = require('./../utils/signToken')
const crypto = require('crypto')

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

exports.editProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    if (!user) {
        return next(new AppError('Editing profile failed, user does not exist in our db.', 404))
    }

    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.gender = req.body.gender || user.gender
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.deleteProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id)
    await Recording.deleteMany({ statisticFor: req.user._id })

    res.status(204).json({
        message: 'success'
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

exports.getWeeklyRecordings = catchAsync(async (req, res, next) => {
    const today = new Date()
    const weekInPast = new DateGenerator().daysInPast(7)

    const weeklyRecordings = await Recording.find({ statisticFor: req.user._id, recordingDate: { $lte: today, $gte: weekInPast } }).sort({ _id: 1 })

    res.status(200).json({
        message: 'success',
        weeklyRecordings
    })
})

exports.getAverageMontlyRecordings = catchAsync(async (req, res, next) => {
    const currentMonth = new Date().getMonth() + 1

    const averageMonthlyRecordings = await Recording.aggregate([
        {
            $match: { statisticFor: req.user._id }
        },
        {
            $group: {
                _id: { $month: '$recordingDate' },
                averageWeight: { $avg: '$currentWeight' },
                averageBMI: { $avg: '$BMI' },
                averageBodyFat: { $avg: '$bodyFat' }
            }
        },
        {
            $project: {
                _id: 0,
                month: '$_id',
                averageWeight: { $round: ['$averageWeight', 1] },
                averageBMI: { $round: ['$averageBMI', 1] },
                averageBodyFat: { $round: ['$averageBodyFat', 1] }
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('Customer associated with this email does not exist.', 404))
    }

    const resetToken = user.createPasswordResetToken()

    const resetURL = resetToken
    await user.save({ validateBeforeSave: false })

    try {
        await new EmailNotifications().sendPasswordResetToken(user, resetURL)

        res.status(200).json({
            message: 'success'
        })

    } catch (err) {
        console.log(err)
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending the email. Please try again later.', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const encryptedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: encryptedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or it is expired.', 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save({ validateBeforeSave: true });

    const token = signToken(user._id)

    res.status(200).json({
        message: 'success',
        token
    })
});
