const router=require("express").Router(),{z}=require("zod");const inquiry=require("../controllers/inquiry.controller");const {validate}=require("../middleware/validation.middleware");
const asyncHandler=require("../middleware/async-handler");
const schema=z.object({name:z.string().trim().min(2).max(120),email:z.string().email(),phone:z.string().max(30).optional().default(""),message:z.string().trim().min(5).max(5000)});
router.post("/public",validate(schema),asyncHandler(inquiry.createPublic));module.exports=router;
