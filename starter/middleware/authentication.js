const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const procees = require('process')
const authenticationMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError("Not logged in")
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = await jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Not Logged In")
    }
}
module.exports = authenticationMiddleware