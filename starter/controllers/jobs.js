const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job.js');
const NotFoundError = require('../errors/not-found.js');
const BadRequestError = require('../errors/bad-request.js');
const getAllJobs = async (req,res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count: jobs.length});
}

const getJob = async (req,res) => {
    const {user: {userId},params: {id:jobId}} = req
    const job = await Job.findOne({createdBy: userId, _id: jobId})
    if(!job){
        throw new NotFoundError(`Job with ${jobId} not present`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req,res) => {
    const {
        user: {userId},
        params: {id:jobId},
        body: {company,position,status}
    } = req

    if(company==='' || position==='' || status===''){
        throw new BadRequestError('Please provide position, company and status')
    }
    const job = await Job.findOneAndUpdate({createdBy: userId, _id: jobId},req.body,{new: true, runValidators: true})
    if(!job){
        throw new NotFoundError(`Job with ${jobId} not found`)
    }
    res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req,res) => {
    const {user: {userId},params: {id:jobId}} = req
    const job = await Job.findByIdAndRemove({createdBy: userId,_id: jobId})
    if(!job){
        throw new NotFoundError(`Job with ${jobId} not found`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    updateJob,
    createJob,
    deleteJob
}