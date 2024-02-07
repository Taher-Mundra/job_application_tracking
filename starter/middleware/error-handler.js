const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "There is some error please try again"
  }
  if(err.code && err.code === 11000){
    customError.statusCode = 400,
    customError.msg = `The email ${Object.values(err.keyValue)} is already exists`
  }
  if(err.name && err.name === "ValidationError"){
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = err.message
  }
  if(err.name === 'CastError'){
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Id format of ${err.value} is not correct`
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  return res.status(customError.statusCode).json({error: customError.msg })
}

module.exports = errorHandlerMiddleware
