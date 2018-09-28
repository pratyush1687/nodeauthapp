const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');



const DiseaseSchema = mongoose.Schema({
    category:{
        type:String,
        enum :['dengue','malaria','chikanguniya','swine flue'],
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
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number
        }
    },
    customId:{
        type:String,
        required:true,
        unique:true
    }
})

const Diseases = module.exports = mongoose.model('Disease',DiseaseSchema);
calculateDistance = function(location1,location2){
    lat1 = location1.lat*Math.PI/180;
    lat2 = location2.lat*Math.PI/180;
    lng1 = location1.lng*Math.PI/180;
    lng2 = location2.lng*Math.PI/180;
    d = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1-lng2));
    return d*6371;
};

module.exports.getDiseasesInArea = function(Currentlocation,radius,callback){
    // const query =  {location:{loc:{$gte:Currentlocation.lat-radius/111,$lte:Currentlocation.lat+radius/111}}}
    Diseases.find((err,result)=>{
        let finalResult = []
        result.forEach((tempDisease,i) => {
            let d = calculateDistance(tempDisease.location,Currentlocation);
            if(d<radius){
                finalResult.push(tempDisease)
            }
        });
        callback(err,finalResult);
    })
}

