const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     dob:{
        type:String,
        required:true
     },
     file:{
         data:Buffer,
         type: String,
         required:true
     }, 
     githubid:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true
     },
     confirmPassword:{
        type:String,
        required:true
     },
     tokens:[{
      token:{
        type:String,
        required:true 
      }
    }]
    
});

// token generation ===>>>
UserSchema.methods.genrateAuthToken = async function(){
   try {
        const token = jwt.sign({_id:this._id.toString()},"mynameisdeepak");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
   } catch (error) {
      console.log(error);
   }
}


// password bycrypt ===>>>>>>>>>>
UserSchema.pre('save',async function(next){
   if(this.isModified('password')){
      this.password = await bcrypt.hash(this.password,12);
      this.confirmPassword = await bcrypt.hash(this.confirmPassword,12);
   }
   next();
});



const user_collection = mongoose.model("USERDATA",UserSchema);
module.exports = user_collection;