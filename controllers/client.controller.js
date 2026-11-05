const Client=require("../models/client.model");
const Inquiry=require("../models/inquiry.model");
exports.profile=async(req,res)=>{const profile=await Client.profile(req.user.id);if(!profile)return res.status(404).json({message:"Profile not found"});res.json(profile)};
exports.inquiries=async(req,res)=>res.json(await Client.inquiries(req.user.id));
exports.createInquiry=async(req,res)=>{const id=await Inquiry.create({user_id:req.user.id,...req.body});res.status(201).json({id,message:"Inquiry submitted"})};
