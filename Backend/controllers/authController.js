const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req,res)=>{

 try{

  const {email,password} = req.body;

  const user = await User.findOne({email});

  if(!user){
   return res.status(401).json({message:"Invalid credentials"});
  }
  const isMatch = await bcrypt.compare(password,user.password);
console.log(isMatch)

  if(!isMatch){
   return res.status(401).json({message:"Invalid credentials"});
  }

  const token = jwt.sign(
   {
    id:user._id,
    role:user.role
   },
   process.env.JWT_SECRET,
   {expiresIn:"1d"}
  );

  res.json({
   token,
   role:user.role,
   email:user.email
  });

 }catch(error){
    console.log(error)
  res.status(500).json({message:"Server error"});
 }
};