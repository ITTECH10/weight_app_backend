const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String
    },
    password: {
        type: String
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'Password do not match!'
        }
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