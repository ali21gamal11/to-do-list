
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log("connected to to-do-list")})
    .catch((error)=>{console.log("fail to connect >> error: ",error)});

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
const PORT = process.env.PORT;
app.listen(PORT,()=>{console.log(`server running on port: ${PORT}`)});


