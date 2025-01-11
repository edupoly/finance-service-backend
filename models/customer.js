var mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema(
    {
        "fullname": String,
        "mobile": String,
        "email": String,
        "password": String
    }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;