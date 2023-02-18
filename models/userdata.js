const mongoose = require('mongoose')



const UserDataSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    amount: {
        type: String,
        required: [true, 'amount  is required']
    },
    transaction: {
        type: String,
        required: [true, 'transactions is required']
    },
    transactionsDate: {
        type: Date,
        required: [true, 'transactions date is required']
    }

}, { timestamps: true })



module.exports = ('UserDate', UserDataSchema)