const express = require('express');


const router = express.Router()

const { createToken, stkPush, callback } = require('../controller/token')


router.post('/token', createToken, stkPush)
router.post('/callback', callback)




module.exports = router