const User = require('../models/User.js')
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/bad-request.js');
const UnauthenticatedError = require('../errors/unauthenticated.js');

const login = async (req,res) => {

    const {email, password} = req.body;
    if(!email | !password){
        throw new BadRequestError("Please provide email and password")
    }

    const user = await User.findOne({email: email})

    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

    const check = await user.checkPassword(password);
    if(!check){
        throw new UnauthenticatedError("Invalid credentials");
    }
    const token = await user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name},token})
}

const register = async (req,res) => {
    const user = await User.create({...req.body})

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name},token})
}

module.exports = {
    register,
    login
}