const mongoose = require('mongoose')

const JobsSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name"],
        maxLength:50
    },
    position: {
        type: String,
        required: [true,"Please provide a position"],
        maxLength: 100
    },
    status: {
        type: String,
        enum : ["pending","interview","declined","approved"],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a user"]
    }
},{timestamps: true})

module.exports = mongoose.model('Jobs',JobsSchema)