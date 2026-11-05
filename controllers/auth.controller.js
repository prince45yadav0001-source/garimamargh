const bcrypt=require("bcryptjs"),jwt=require("jsonwebtoken");const User=require("../models/user.model");
const {requireJwtSecret,cookieOptions}=require("../config/security");
const db=require("../config/database");
const passwordResetOtps=new Map();
const normalizePhone=phone=>phone.replace(/\D/g,"").replace(/^977/, "");

exports.registerClient=async(req,res)=>{
  if(req.body.password!==req.body.confirmPassword){
    return res.status(400).json({message:"Passwords do not match"});
  }
  let connection;
  try{
    connection=await db.getConnection();
    await connection.beginTransaction();
    const hash=await bcrypt.hash(req.body.password,12);
    const [result]=await connection.query(
      "INSERT INTO users (name,email,password_hash,role) VALUES (?, ?, ?, 'client')",
      [req.body.name,req.body.email.toLowerCase(),hash]
    );
    await connection.query(
      "INSERT INTO client_profiles (user_id,phone,company_name) VALUES (?, ?, NULL)",
      [result.insertId,req.body.phone]
    );
    await connection.commit();
    return res.status(201).json({
      message:"Client account registered successfully",
      user:{id:result.insertId,name:req.body.name,email:req.body.email.toLowerCase(),role:"client"}
    });
  }catch(error){
    if(connection){
      try{await connection.rollback()}catch(rollbackError){}
    }
    if(error.code==="ER_DUP_ENTRY")return res.status(409).json({message:"An account with this email already exists"});
    return res.status(500).json({message:"Unable to register client account"});
  }finally{
    if(connection)connection.release();
  }
};

async function findStaffPhone(phone){
  return await User.findStaffByPhone(phone);
}
exports.login=async(req,res)=>{
  const {email,password,role}=req.body;
  let user=null;
  try{user=await User.findByEmail(email)}catch(error){return res.status(500).json({message:"Unable to authenticate"})}
  if(!user||user.role!==role||!(await bcrypt.compare(password,user.password_hash))){
    return res.status(401).json({message:"Invalid email or password"});
  }
  const token=jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},requireJwtSecret(),{expiresIn:process.env.JWT_EXPIRES_IN||"8h"});
  res.cookie("gmarg_token",token,{...cookieOptions(),maxAge:8*60*60*1000});
  res.json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
};
exports.logout=(req,res)=>{res.clearCookie("gmarg_token",cookieOptions());res.json({message:"Logged out"})};
exports.me=async(req,res)=>{
  try{const user=await User.findById(req.user.id);if(!user)return res.status(404).json({message:"User not found"});res.json(user)}catch(error){res.json(req.user)}
};

exports.requestStaffPasswordReset=async(req,res)=>{
  const phone=normalizePhone(req.body.phone);
  const staff=await findStaffPhone(phone);
  if(!staff)return res.status(404).json({message:"You are not a staff member"});
  const otp=String(Math.floor(100000+Math.random()*900000));
  passwordResetOtps.set(phone,{otp,email:staff.email,expiresAt:Date.now()+10*60*1000});
  res.json({
    message:"OTP sent to the staff member's number"
  });
};

exports.verifyStaffOtp=async(req,res)=>{
  const phone=normalizePhone(req.body.phone);
  const record=passwordResetOtps.get(phone);
  if(!record||record.expiresAt<Date.now())return res.status(400).json({message:"OTP expired or not requested"});
  if(record.otp!==req.body.otp)return res.status(400).json({message:"Invalid OTP"});
  record.verified=true;
  res.json({message:"OTP verified"});
};

exports.resetStaffPassword=async(req,res)=>{
  const phone=normalizePhone(req.body.phone);
  const record=passwordResetOtps.get(phone);
  if(!record||record.expiresAt<Date.now())return res.status(400).json({message:"OTP expired or not requested"});
  if(record.otp!==req.body.otp)return res.status(400).json({message:"Invalid OTP"});
  if(!record.verified)return res.status(400).json({message:"OTP has not been verified"});
  const hash=await bcrypt.hash(req.body.password,12);
  try{await User.updatePasswordByEmail(record.email,hash)}
  catch(error){return res.status(500).json({message:"Unable to update password"})}
  passwordResetOtps.delete(phone);
  res.json({message:"Password reset successfully"});
};
