const mongoose = require("mongoose");
require("./userModel");

mongoose.connect("mongodb://127.0.0.1:27017/IMPF")
.then(()=>{console.log("mongoose connection successfull")})
.catch((err)=>{console.log(err)});