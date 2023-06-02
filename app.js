const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

require("./model/dbConnection");


app.use(require("./routes/auth"));


const cssPath = path.join(__dirname, './public/css');
const imagePath = path.join(__dirname,'./public/images');
const UploadimagePath = path.join(__dirname,'./public/uploads');

app.set('view engine','ejs');
app.set("views",path.join(__dirname, './views'));
app.use(express.static(cssPath));
app.use(express.static(imagePath));
app.use(express.static(UploadimagePath));


app.get("/",(req,res)=>{
    res.render("Home");
});


app.get("/register",(req,res)=>{
    res.render("Register");
})


app.get("/login",(req,res)=>{
    console.log(req.body);
    res.render("Login");
})




app.listen(PORT,()=>console.log(`listening on port ${PORT}`));