const Staff=require("../models/staff.model");
exports.inquiries=async(req,res)=>res.json(await Staff.listInquiries());
exports.updateStatus=async(req,res)=>{await Staff.updateInquiryStatus(req.params.id,req.body.status);res.json({message:"Inquiry status updated"})};
