const express = require('express')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')
const bodyPartsController = require('./../controllers/bodyPartsController')

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

router.route('/circumferences')
    .post(bodyPartsController.recordCircumferences)
    .get(bodyPartsController.getCustomerBodyPartMeasurements)

router.route('/circumferences/initial/recent')
    .get(bodyPartsController.getMostRecentAndInitialBodyPartMeasure)

router.route('/recordings/weekly')
    .get(userController.getWeeklyRecordings)

router.route('/circumferences/weekly')
    .get(bodyPartsController.getWeeklyBodyPartRecordings)

router.route('/recordings/monthly')
    .get(userController.getAverageMontlyRecordings)

router.route('/me')
    .get(userController.getMe)
    .delete(userController.deleteProfile)

router.route('/me/edit')
    .put(userController.editProfile)

router.route('/record')
    .post(userController.recordStatistics)
    .get(userController.getMostRecentAndInitialRecording)

router.route('/goals')
    .put(userController.setWeightAndBodyFatGoal)

router.route('/recording/:recordingId')
    .put(userController.takeRecordingNote)

module.exports = router