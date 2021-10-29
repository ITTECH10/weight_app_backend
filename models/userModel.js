const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const AppError = require('./../utils/appError')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        unique: true,
        type: String
    },
    password: {
        type: String,
        select: false
    },
    confirmPassword: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresIn: {
        type: Date
    },
    weightGoal: {
        type: Number,
        default: 0
    },
    bodyFatGoal: {
        type: Number,
        default: 0
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined

    next()
})

userSchema.methods.comparePasswords = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
};

userSchema.methods.createPasswordResetToken = function () {
    const plainToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return plainToken;
};

const User = mongoose.model('User', userSchema)

module.exports = User