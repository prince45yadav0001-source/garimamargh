const db=require("../config/database");
exports.create=async({user_id=null,name,email,phone="",message})=>{const [r]=await db.query("INSERT INTO inquiries(user_id,name,email,phone,message,status) VALUES(?,?,?,?,?,'new')",[user_id,name,email,phone,message]);return r.insertId};
