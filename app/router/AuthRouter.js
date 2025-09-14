const express=require("express");
const AuthController=require("../controller/AuthController");

const router=express.Router()



router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.register);
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.login);










module.exports=router