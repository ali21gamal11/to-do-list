const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const User = require('../models/User');

const registerSchema  = joi.object({
    username: joi.string().min(3).max(20).required(),
    password: joi.string().min(8).max(30).required()
});

const loginSchema  = joi.object({
    username: joi.string().required(),
    password: joi.string().required()
});

router.post("/register", async (req,res)=>{
    const { error } = registerSchema.validate(req.body);
    if(error){
        res.status(400).json({msg: error.details[0].message});
    }

    const { username , password }  = req.body;
    try{
        const exist = await User.findOne({ username });
        if (exist){
            return res.status(400).json({msg:"username already taken"})
        }

        const hash  = await bcrypt.hash(password,10);
        const user = new User({  username : username, password: hash });
        await user.save();
        res.json({msg:"User registered successfully :)"});

    }
    catch(error){
        console.error("Register error:", error);
        res.status(500).json({msg:"something wrong on server or dataBase"})
    }
})


router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg:'User not found..'});


    const match = await bcrypt.compare(password, user.password);

    if (!match ) return res.status(400).json({ msg:'wrong password'});

    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET,{expiresIn: '1h'});
      res.json({ token });


} catch (err) {
    res.status(500).json({ msg:"something wrong on server or dataBase"});
  }
});

module.exports = router;