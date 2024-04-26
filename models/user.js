var mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        "userType": String,
        "fullname":String,
        "email": String,
        "password": String
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;