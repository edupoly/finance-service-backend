var mongoose =  require('mongoose');
const { Schema } = mongoose;

const businessAccountSchema = new Schema(
    {
      "businessName": String,
      "primaryMobile": String,
      "email": String,
      "password": String,
      "services":Array,
      "plans":Array,
      "customers":Array,
      "transactions": Array
    }
  );

const Businessaccount = mongoose.model('Businessaccount', businessAccountSchema);

module.exports = Businessaccount;