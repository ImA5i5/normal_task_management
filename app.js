require("dotenv").config()
const express=require("express");
const db=require("./app/config/db");
const cookieParser=require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const path=require("path");


const app=express()
db()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine","ejs")
app.set("views","views")
app.use(session({
  secret: 'asis12345',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use(express.static(path.join(__dirname,"public")))
app.use("/uploads", express.static("uploads"));



const AuthRouter=require("./app/router/AuthRouter")
app.use("/auth",AuthRouter)

const superadminRouter=require("./app/router/superadminRouter");
app.use("/superadmin",superadminRouter)



const port=5001 || process.env.PORT
app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})