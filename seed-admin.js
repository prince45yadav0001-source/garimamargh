require("dotenv").config();

const bcrypt=require("bcryptjs");
const pool=require("../config/database");

(async()=>{
  const staffEmail=process.env.ADMIN_EMAIL||"admin@gmarg.com";
  const [staffRows]=await pool.query("SELECT id FROM users WHERE email=? LIMIT 1",[staffEmail]);
  if(staffRows.length===0){
    if(!process.env.ADMIN_PASSWORD)throw new Error("ADMIN_PASSWORD is required when creating the administrator");
    const staffHash=await bcrypt.hash(process.env.ADMIN_PASSWORD,12);
    await pool.query(
      "INSERT INTO users (name,email,password_hash,role) VALUES (?, ?, ?, ?)",
      ["GMARG Administrator",staffEmail,staffHash,"staff"]
    );
  }

  const clientEmail=process.env.CLIENT_EMAIL||"client@gmarg.com";
  const [clientRows]=await pool.query("SELECT id FROM users WHERE email=? LIMIT 1",[clientEmail]);
  if(clientRows.length===0){
    if(!process.env.CLIENT_PASSWORD)throw new Error("CLIENT_PASSWORD is required when creating the client account");
    const clientHash=await bcrypt.hash(process.env.CLIENT_PASSWORD,12);
    await pool.query(
      "INSERT INTO users (name,email,password_hash,role) VALUES (?, ?, ?, ?)",
      ["Test Client",clientEmail,clientHash,"client"]
    );
  }

  await pool.query("INSERT IGNORE INTO client_profiles (user_id,phone,company_name) SELECT id,NULL,NULL FROM users WHERE email=?",[clientEmail]);

  console.log(`Administrator account ready: ${staffRows.length===0?"created":"preserved existing password"}`);
  console.log(`Client account ready: ${clientRows.length===0?"created":"preserved existing password"}`);
  await pool.end();
})().catch(async error=>{
  console.error(error);
  await pool.end();
  process.exit(1);
});
