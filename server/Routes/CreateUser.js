const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require("express-validator");
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken");
// Load environment variables from .env
require('dotenv').config();

router.post(
  "/createuser",
  //here we use express validator
  [
    body("name","Enter a Valid Name").isLength({ min: 5 }),
    body("email","Incorrect Email").isEmail(),
    body("password","Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors= validationResult(req);
   if (!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword=await bcrypt.hash(req.body.password,salt)
    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (err) {
      console.log(err.message);
      res.json({ success: false });
    }
  }
);
router.post(
  "/loginuser",[
    body("email","Incorrect Email").isEmail(),
    body("password","Incorrect Password").isLength({ min: 5 }),
  ],
  //here we use express validator
  async (req, res) => {
    const errors= validationResult(req);
   if (!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    let email = req.body.email;
    try {
    let userData = await User.findOne({email});
    if(!userData){
      return res.status(400).json({errors:"try logging with correct credentials"});
    }
    const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
    if(!pwdCompare){
      return res.status(400).json({errors:"try logging with correct credentials"});
    }
    const data = {
      user:{
        id:userData.id
      }
    }
    const authToken = jwt.sign(data, process.env.JWTSECRETEKEY);
    return res.json({success: true,authToken:authToken});
    } catch (err) {
      console.log(err.message);
      res.json({ success: false });
    }
  }
);
module.exports = router;
