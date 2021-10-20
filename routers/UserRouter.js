const express = require('express')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')

const router = express.Router()

router.route('/signup')
    .post(authController.signup)

router.route('/login')
    .post(authController.login)

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/')
    .get(userController.getAllUsers)

router.route('/recordings')
    .get(userController.getUserRelatedRecordings)

router.route('/me')
    .get(userController.getMe)

router.route('/record')
    .post(userController.recordStatistics)
    .get(userController.getMostRecentAndInitialRecording)

router.route('/goals')
    .put(userController.setWeightAndBodyFatGoal)

router.route('/recording/:recordingId')
    .put(userController.takeRecordingNote)

module.exports = router