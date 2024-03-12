// require('dotenv').config()

import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})


connectDB()
.then(() =>{
    app.listen(process.env.PORT || 3000, () =>{
        console.log(`Server Running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection Failed", error)
})
    