const jwt=require("jsonwebtoken");
const {requireJwtSecret}=require("../config/security");
module.exports=(req,res,next)=>{const token=req.cookies?.gmarg_token;if(!token)return res.status(401).json({message:"Authentication required"});try{req.user=jwt.verify(token,requireJwtSecret());next()}catch(e){return res.status(401).json({message:"Invalid or expired session"})}};
