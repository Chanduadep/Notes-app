import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js'
import noteRouter from './routes/notes.routes.js'

import cors from 'cors';

dotenv.config()
mongoose.connect(process.env.MONGODBURL).then(()=>{
    console.log("connect to Mongo Db")
})
.catch((error)=>{
    console.log(error)
})

const app=express()


//to make input as json
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:"https://notes-app-frontend-g2h0.onrender.com",credentials:true }))


app.listen(3000,()=>{
    console.log("server is listening port 3000")
})

//routes

app.use("/api/auth",authRouter)
app.use("/api/note",noteRouter)

//error handler

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message =err.message||"Internal server"

    return res.status(statusCode).json({
        success:false,statusCode,message,
    })
})