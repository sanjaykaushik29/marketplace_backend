import { auth } from "../api/services/auth.services";

const express = require('express');
const userRouter = express.Router();
const userController = require("../api/controller/UserController/userController")
let uploadS3 = require('../../src/middleware/multer/profileUpload')

userRouter.get("/check-user/:walletAddress", userController.checkUser)
userRouter.post("/login", userController.login)

userRouter.post("/signup/", uploadS3.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
]), userController.signup)

userRouter.patch("/edit-profile/:userId", auth, uploadS3.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
]), userController.editProfile)

userRouter.get(
  "/get-profileData/:walletAddress",
  userController.getUserProfileData
);

userRouter.get("/popular-creators", userController.getPopularCreators)




module.exports = userRouter;
