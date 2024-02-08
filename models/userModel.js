const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    contact: {
        type: Number,
        require: true
    },
    package: {
        type: String,
        require: true
    },
    nic: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("User",userSchema);