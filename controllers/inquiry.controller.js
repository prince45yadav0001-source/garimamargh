const Inquiry=require("../models/inquiry.model");
exports.createPublic=async(req,res)=>{const id=await Inquiry.create(req.body);res.status(201).json({message:"Inquiry submitted successfully",id})};
