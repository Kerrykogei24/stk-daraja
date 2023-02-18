const express = require('express');
const cors = require("cors");
const app = express();

const connectDB = require('./db/connect')



// routes
const stkpushRouter = require('./routes/token')
const stkpushCAllback = require('./routes/token')


app.use(express.json());
app.use(cors());


app.use('/', stkpushRouter)
app.use('/', stkpushCAllback)






const port = process.env.PORT || 3000


const start = async() => {
    try {

        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {

            console.log(`server running on port ${port
            }`);
        })

    } catch (error) {
        console.log(error);

    }
}

start();