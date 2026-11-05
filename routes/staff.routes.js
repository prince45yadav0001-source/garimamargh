const router=require("express").Router(),{z}=require("zod");const protect=require("../middleware/auth.middleware"),role=require("../middleware/role.middleware"),{validate}=require("../middleware/validation.middleware");const staff=require("../controllers/staff.controller");
const asyncHandler=require("../middleware/async-handler");
router.use(protect,role("staff"));
router.get("/inquiries",asyncHandler(staff.inquiries));router.patch("/inquiries/:id/status",validate(z.object({status:z.enum(["new","in_progress","completed"])})),asyncHandler(staff.updateStatus));module.exports=router;
