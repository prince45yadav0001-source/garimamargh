const router=require("express").Router();
const rateLimit=require("express-rate-limit");
const {z}=require("zod");
const auth=require("../controllers/auth.controller");
const {validate}=require("../middleware/validation.middleware");
const protect=require("../middleware/auth.middleware");
const asyncHandler=require("../middleware/async-handler");

const limiter=rateLimit({windowMs:15*60*1000,max:10,standardHeaders:true,legacyHeaders:false});
const loginSchema=z.object({email:z.string().email(),password:z.string().min(6),role:z.enum(["staff","client"])});

router.post("/login",limiter,validate(loginSchema),asyncHandler(auth.login));
router.post("/logout",asyncHandler(auth.logout));
router.get("/me",protect,asyncHandler(auth.me));
router.post("/client/register",limiter,validate(z.object({
  name:z.string().trim().min(2).max(120),
  email:z.string().trim().email().max(190),
  phone:z.string().trim().min(7).max(30),
  password:z.string().min(8).max(128),
  confirmPassword:z.string().min(8).max(128)
})),asyncHandler(auth.registerClient));
router.post("/staff/forgot-password",limiter,validate(z.object({phone:z.string().trim().min(7).max(20)})),asyncHandler(auth.requestStaffPasswordReset));
router.post("/staff/verify-otp",limiter,validate(z.object({phone:z.string().trim().min(7).max(20),otp:z.string().trim().regex(/^\d{6}$/)})),asyncHandler(auth.verifyStaffOtp));
router.post("/staff/reset-password",limiter,validate(z.object({phone:z.string().trim().min(7).max(20),otp:z.string().trim().regex(/^\d{6}$/),password:z.string().min(8).max(128)})),asyncHandler(auth.resetStaffPassword));

module.exports=router;
