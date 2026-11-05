const db=require("../config/database");
exports.listInquiries=async()=> (await db.query("SELECT id,user_id,name,email,phone,message,status,created_at FROM inquiries ORDER BY created_at DESC"))[0];
exports.updateInquiryStatus=async(id,status)=>{await db.query("UPDATE inquiries SET status=? WHERE id=?",[status,id])};
