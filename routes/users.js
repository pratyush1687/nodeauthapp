const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    email: req.body.email,
    password: req.body.password,
    location: {lat:req.body.loc.lat,lngg: req.body.loc.lng}

  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByUsername(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

/**update location of user 
 * 
*/
router.post('/updateLoc',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  console.log(req.user);
  
  User.getUserById(req.user.id,(err,tempUser)=>{
    if(err) res.json({success:false,msg:err.msg});
    console.log(tempUser)
    tempUser.location.lat = req.body.loc.lat;
    tempUser.location.lngg = req.body.loc.lngg;
    tempUser.save((err)=>{
      if(err) throw err;
      res.json({success:true,msg:`location updated for userid ${tempUser.id}`});
    })
  })
})

module.exports = router;
