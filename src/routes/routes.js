const express=require("express");
const router=express.Router();

const userController=require("../Controllers/userController")
const evntController=require("../Controllers/eventController");
const {authorization}=require("../middleware/auth");

// user auth api
router.post("/registerUser",userController.register_User);
router.post("/login",userController.login_User);
router.get("/logout",authorization,userController.logout_User);
router.patch("/resetPassword/:userId",authorization,userController.resetPassword);

// Event
router.post("/createEvent",evntController.createEvent);
router.post("/inviteEvent/:id",evntController.invite);
router.get("/listEvent",evntController.events);
router.patch("/changeEvent/:id",evntController.updateEvent);
router.get("/eventsDetails/:id",evntController.details);

module.exports=router;