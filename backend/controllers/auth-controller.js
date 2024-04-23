import User from '../models/user-model.js'
import { StatusCodes } from 'http-status-codes'
import {BadRequestError, UnauthenticatedError} from '../errors/index.js'

export const signup = async(req, res) => {
    const {username, email, password} = req.body
    if(!username || !email || !password){
        throw new BadRequestError('Please provide all fields')
    }
    const user = await User.create({username, email, password})
    res.status(StatusCodes.OK).json(user)
}

export const signin = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }
    const passwordMatch = await user.comparePassword(password)
    if(!passwordMatch){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const {password: pass, ...rest} = user._doc
    const token = user.createJwt()
    res.status(StatusCodes.OK).cookie('access_token', token, {httpOnly: true}).json(rest)
}