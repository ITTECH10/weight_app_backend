const AppError = require('../utils/appError')

const sendValidatorErrors = (err) => {
    console.log(err.errors)
    // let message = err.errors.message
    // return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const sendDevErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

// const sendProdErrors = (err, res) => {
//     if (err.isOperational) {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message,
//         })
//     }

//     else {
//         res.status(500).json({
//             status: 'error',
//             message: 'Something went wrong!'
//         })
//     }
// }

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    // let error = { ...err }
    // error.message = err.message

    // if (err.name === 'ValidationError') error = sendValidatorErrors(error)
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    sendDevErrors(err, res)
}