import express, { json } from "express"

import dotenv from 'dotenv'
import cors from'cors';
import router from "./routers/authRoutes.js";
import connectDb from "./utils/db.js";
import movieRoutes from './routers/movieRoutes.js'
import path from "path";
import bookingrouter from "./controllers/Booking.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express()
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files
dotenv.config();
app.use(express.json())
app.use(cors())


const port=5000
app.get("/",(req,res)=>{
    res.send("hello world");
})

connectDb();

app.use("/api/auth",router);
app.use("/api/movies",movieRoutes);
app.use("/api/bookings",bookingrouter)


app.listen(port,()=>{
    console.log(`app is running in the port ${port}`)
})
