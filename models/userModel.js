const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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

const User = mongoose.model('User', userSchema)

module.exports = User