const db=require("../config/database");
exports.findByEmail=async email=>(await db.query("SELECT * FROM users WHERE email=? LIMIT 1",[email]))[0][0];
exports.findById=async id=>(await db.query("SELECT id,name,email,role,created_at FROM users WHERE id=? LIMIT 1",[id]))[0][0];
exports.findStaffByPhone=async phone=>(await db.query(
  "SELECT u.id,u.name,u.email,u.role FROM users u JOIN staff_profiles s ON s.user_id=u.id WHERE u.role='staff' AND s.phone=? LIMIT 1",
  [phone]
))[0][0];
exports.updatePasswordByEmail=async(email,passwordHash)=>(await db.query(
  "UPDATE users SET password_hash=? WHERE email=? AND role='staff'",
  [passwordHash,email]
));
