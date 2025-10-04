import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import userRoute from './Routes/userRoute.js';
import adminRoute from './Routes/adminRoutes.js';
import productRoute from './Routes/productRoutes.js';
import orderRoute from './Routes/orderRoutes.js';
import path from 'path';


dotenv.config();
const app=express();
const PORT=process.env.PORT || 3000;



const allowedOrigins = [
    'http://localhost:5173', // local frontend
    'https://project-bolt-sb1-gwnss92e.vercel.app', // main production domain
    'https://project-bolt-sb1-gwnss92e-git-w-4470e0-abdulraheman74s-projects.vercel.app', // branch deployment
    'https://project-bolt-sb1-gwnss92e-ma08opnw7-abdulraheman74s-projects.vercel.app' // previous branch or other preview
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman or server-to-server requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
  

app.use(express.json());
connectDb()

app.use('/api/users',userRoute)
app.use('/api/admins',adminRoute)
app.use('/api/products',productRoute)
app.use("/images",express.static("uploads"));
// Serve uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use('/api/orders',orderRoute)

app.get('/',(req,res)=>{
    res.send('Welcome to the API');
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

