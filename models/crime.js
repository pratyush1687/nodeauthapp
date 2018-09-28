const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
/**
 * incident schema subobject to crime schema
 */



const crimeSchema = mongoose.Schema({
    category:{
        type:String,
        enum :["kidnapping","car-theft","house-theft","phone-theft","chain-snatching","purse-snatching",
                "rape","sexual-harrasment","eve-teasing","molestation"],
        required:true
    },
    incidents:[{
        type:Date,
        default:Date.now()
    }],
    no_of_incidents:{
        type:Number,
        default:0,
    },
    women_safety:{
        type:Boolean,
        default:false,
        required:true,
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number
        },
    },
    customID:{
        type:String,
        unique:true,
        required:true
    }
})

const Crimes = module.exports = mongoose.model('Crime',crimeSchema);
calculateDistance = function(location1,location2){
    lat1 = location1.lat*Math.PI/180;
    lat2 = location2.lat*Math.PI/180;
    lng1 = location1.lng*Math.PI/180;
    lng2 = location2.lng*Math.PI/180;
    d = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1-lng2));
    return d*6371;
};

module.exports.getCrimesInRadius = function(Currentlocation,radius,callback){
    // console.log(Currentlocation);
    
    // const query =  {location:{lat:{$gte:Currentlocation.lat-radius/111,$lte:Currentlocation.lat+(radius/111)}}}
    // console.log(query);
    
    Crimes.find((err,result)=>{
        // console.log(result);
        
        let finalResult = []
        result.forEach((tempCrime,i) => {
            let d = calculateDistance(tempCrime.location,Currentlocation);
            console.log(`main d hun ${d}`);
            
            if(d<=radius){
                finalResult.push(tempCrime)
            }
        });
        callback(err,finalResult);
    })
}

module.exports.getCrimesAgainstWomen = function(Currentlocation,radius,callback){
    const query =  {location:{lat:{$gte:Currentlocation.lat-radius/111,$lte:Currentlocation.lat+(radius/111)}},women_safety:true}
    Crimes.find({women_safety:true},(err,result)=>{
        console.log(result);
        
        let finalResult = []
        result.forEach((tempCrime,i) => {
            let d = calculateDistance(tempCrime.location,Currentlocation);
            if(d<=radius){
                finalResult.push(tempCrime)
            }
        });
        callback(err,finalResult);
    })
}
