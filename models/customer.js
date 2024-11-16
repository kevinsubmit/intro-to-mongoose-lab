


const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    name:String,
    age:Number
})
const Customer = mongoose.model('Customer',todoSchema);
module.exports = Customer;