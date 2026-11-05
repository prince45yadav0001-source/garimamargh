const db=require("../config/database");
exports.profile=async id=>(await db.query("SELECT u.id,u.name,u.email,c.phone,c.company_name FROM users u LEFT JOIN client_profiles c ON c.user_id=u.id WHERE u.id=? LIMIT 1",[id]))[0][0];
exports.inquiries=async id=>(await db.query("SELECT id,name,email,message,status,created_at FROM inquiries WHERE user_id=? ORDER BY created_at DESC",[id]))[0];
