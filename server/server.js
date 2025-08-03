import express from 'express'
import cors from 'cors'
import env from "dotenv"
import adminRoute from './routes/adminRoute.js';
import blogRouter from './routes/blogRoute.js';
import db from './configs/db.js';
// import ImageKit from 'imagekit';
// import fs from 'fs';

const app = express();
env.config();

db.connect().then(()=> console.log("Database connected"));

app.use(cors());   
app.use(express.json())

// Routes
app.get('/', (req, res)=> res.send("API is working"))
app.use('/api/admin', adminRoute)
app.use('/api/blog', blogRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})