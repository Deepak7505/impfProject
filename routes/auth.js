const express = require("express");
require("../model/dbConnection");
const user_collection = require("../model/userModel");
const multer = require("multer");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const { url } = require("inspector");


/// storage
const Storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename:(req,file,cb)=>{
        cb(null,file.filename+"_"+Date.now()+path.extname(file.originalname));
    },
});  

const upload = multer({
    storage:Storage
}).single('file');




router.post("/register",upload, async (req, res) => {
   
const {
    name,
    email,
    dob,
    password,
    confirmPassword,
    githubid,
} = req.body;
const file = req.file.filename;
console.log(req.body);
const invalidField = (!name || !email || !file || !dob ||  !githubid || !password || !confirmPassword );
if (invalidField) {
    return res.status(422).json({ message: "plz fill the fields properly"});
} 

try {
    const userExist = await user_collection.findOne({ email: email });
    if (userExist) {

        return res.status(422).json({ message: "user already existe's"})

    }

    const user = new user_collection({ name, email, dob, file, githubid , password, confirmPassword });

    // genrating a token 

    const token = await user.genrateAuthToken();
    console.log(`token part is ${token}`); 
    res.cookie("jwt",token,{
        expires:new Date(Date.now() + 600000),
        httpOnly:true
    });
     

       await user.save();
       await res.render('Login');

 }catch (error) {
    console.log(error);
}
});




router.get("/postdata",(req,res)=>{
    res.render("PostData");
})

router.post("/postdata",(req,res)=>{ 
    console.log(req.body);
    res.render("PostData");
})


router.get("/datauser",(req,res)=>{
       res.render("portfolio");
})



router.post("/datauser", async (req, res) => {

    try {
        const { email, password } = req.body;
        emailData = email;

        const userLogin = await user_collection.findOne({ email: email });
        

        if (userLogin) {

           const isMatch = await bcrypt.compare(password, userLogin.password);

            
           const token = await userLogin.genrateAuthToken();
           console.log(`token part is ${token}`);
          
            res.cookie("jwt",token,{
            expires:new Date(Date.now() + 600000),
            httpOnly:true,
            });
            

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials" });
            } else {
                
                const userData = await user_collection.find({ email: email });
                const { name , githubid  , dob , file } = userData[0];
                const userEmail = userData[0].email;
                console.log(`this is the user data ${name} or id ${githubid} and file ${file}`);
                res.render('portfolio',{name,githubid,dob,file,userEmail, data:userData});
                try {
                    router.get("/apidata",(req,res)=>{
                        res.json({datauser:userData});
                    })
                } catch (error) {
                    console.log("errr frome /apidata");
                }
                // res.json({userData})
                // res.send(userData + "it's userdata");
            }
        } else {  
            res.status(400).json({ error: "Invalid Credientials" });
        }

    } catch (error) {
        console.log(error); 
    }

})



module.exports = router; 