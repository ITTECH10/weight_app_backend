const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const User = require('./../models/userModel')

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    res.status(201).json({
        message: 'success',
        user
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { password, email } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 401))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !await user.comparePasswords(password, user.password)) {
        return next(new AppError('Netačan e-mail ili lozinka.', 401))
    }

    res.status(201).json({
        message: 'success',
        user
    })
})