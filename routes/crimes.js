const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Crimes = require('../models/crime')

router.get('/crimesInArea',async (req,res,next)=>{
    console.log("function chala",);
    await Crimes.getCrimesInRadius({lat:parseFloat(req.query.lat),lng:parseFloat(req.query.lng)},parseFloat(req.query.radius),(err,result)=>{
        if (err) throw err;
        res.json({success:true,msg:"data sent",data:result})
    })
    // res.json({success:false,msg:"data not sent"})
})

router.get('/crimesInAreaAgainstWomen',async (req,res,next)=>{
    await Crimes.getCrimesAgainstWomen({lat:parseFloat(req.query.lat),lng:parseFloat(req.query.lng)},parseFloat(req.query.radius),(err,result)=>{
        if (err) throw err;
        res.json({success:true,msg:"data sent",data:result})
    })
    // res.json({success:false,msg:"data not sent"})
})
module.exports = router;