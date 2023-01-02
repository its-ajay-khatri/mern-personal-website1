const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB, { useNewUrlParser: true })
.then(() => {
    console.log("Connection Successful")
}).catch((err) => {
    console.log("Db didn't not connected :(")
})