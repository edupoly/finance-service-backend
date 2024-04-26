var mongoose = require('mongoose');
const { Schema } = mongoose;

const loanSchema = new Schema(
    {
        "agentMail": String,
        "customerName": String,
        "customerEmail": String,
        "date":Number,
        "loanItem":String,
        "itemPrice": Number,
        "downPayment": Number,
        "tenure": Number,
        "emiStarted":Boolean,
        "panUrl": String,
        "aadhaarUrl": String,
        "status":String,
        "installments":Array
    }
);

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;