import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from "./config/db.js";
import userRoutes from './route/userRoutes.js';
dotenv.config()
connectDB();

const app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.use('/app/v1/auth', userRoutes);

const port = process.env.PORT || 1000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})