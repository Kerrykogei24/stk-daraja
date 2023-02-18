require('dotenv').config()
const UserDataSchema = require('../db/connect')
const axios = require("axios");

const createToken = async(req, res, next) => {
    const secret = process.env.STK_SECRET;
    const consumer = process.env.STK_KEY;
    const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
    await axios
        .get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
                headers: {
                    authorization: `Basic ${auth}`,
                },
            }
        )
        .then((data) => {
            token = data.data.access_token;
            console.log(data.data);
            next();
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err.message);
        });
};

const stkPush = async(req, res) => {
    const shortCode = 174379;
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const date = new Date();
    const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
    const password = new Buffer.from(shortCode + passkey + timestamp).toString(
        "base64"
    );
    const data = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: 174379,
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://stk-daraja.up.railway.app/callback",
        AccountReference: "Mpesa Test",
        TransactionDesc: "Testing stk push",
    };

    await axios
        .post(url, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        .then((data) => {
            console.log(data);
            res.status(200).json(data.data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err.message);
        });
};




const callback = async(req, res) => {


    // res.send('working')
    const callBackData = req.body;
    console.log(callBackData)

    if (!callBackData.body.stkCallback.callBackMetaData) {
        console.log(callBackData.body)
        return res.json('ok')
    }

    console.log(callBackData.body.stkCallback.callBackMetaData);

    const phone = callBackData.body.stkCallback.callBackMetaData.Item[4].Value
    const amount = callBackData.body.stkCallback.callBackMetaData.Item[0].Value
    const transaction = callBackData.body.stkCallback.callBackMetaData.Item[2].Value
    const transactionDate = callBackData.body.stkCallback.callBackMetaData.Item[3].Value

    console.log(phone, amount, transaction, transactionDate);

    const userdata = new UserDataSchema();
    userdata.phone = phone;
    userdata.amount = amount;
    userdata.transaction = transaction;
    userdata.transactionDate = transactionDate;


    try {
        userdata.save()
        console.log({ message: "data saved successfully" }, data)

    } catch (error) {
        console.log(error.message);
    }

}
module.exports = { createToken, stkPush, callback };