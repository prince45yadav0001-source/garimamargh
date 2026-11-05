require("dotenv").config();
const express=require("express"),helmet=require("helmet"),cors=require("cors"),cookieParser=require("cookie-parser"),path=require("path");
const {requireJwtSecret}=require("./config/security");
requireJwtSecret();
const app=express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(cors({origin:process.env.CORS_ORIGIN||"http://localhost:5500",credentials:true}));
app.use(express.json({limit:"100kb"}));app.use(cookieParser());
app.use("/api/auth",require("./routes/auth.routes"));
app.use("/api/inquiries",require("./routes/inquiry.routes"));
app.use("/api/staff",require("./routes/staff.routes"));
app.use("/api/client",require("./routes/client.routes"));
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.use(express.static(path.join(__dirname,"../frontend")));
app.get("*",(req,res,next)=>{
  if(req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(__dirname,"../frontend/index.html"));
});
app.use((err,req,res,next)=>{
  console.error(`Request failed: ${err && err.code ? err.code : err && err.name ? err.name : "InternalError"}`);
  res.status(500).json({message:"Internal server error"});
});
const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`GMARG backend listening on http://localhost:${port}`));
