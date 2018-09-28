const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Diseases = require('../models/disease')

router.get('/diseasesInArea',async (req,res,next)=>{
    console.log("function chala",);

    await Diseases.getDiseasesInArea({lat:parseFloat(req.query.lat),lon:parseFloat(req.query.lon)},parseFloat(req.query.radius),(err,result)=>{
        if (err) throw err;
        res.json({success:true,msg:"data sent",data:result})
    })
    // res.json({success:false,msg:"data not sent"})
})

// router.get('/crimesInAreaAgainstWomen',async (req,res,next)=>{
//     await Crimes.getCrimesAgainstWomen(req.query.location,req.query.radius,(err,result)=>{
//         if (err) throw err;
//         res.json({success:true,msg:"data sent",data:result})
//     })
//     res.json({success:false,msg:"data not sent"})
// })
module.exports = router;