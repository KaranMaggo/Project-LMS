import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEductorCourses,
  getEnrolledStudentsData,
  updateRoleEducator,
} from "../Controllers/educatorController.js";
import upload from "../Configs/Multer.js";
import { protectEducator } from "../Middleware/authMiddleware.js";

const educatorRouter = express.Router();

// add Educator Role

educatorRouter.get("/update-role", updateRoleEducator);
educatorRouter.post(
  "/add-course",
  protectEducator, // Authenticate first
  upload.single("image"), // Then handle image
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEductorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
