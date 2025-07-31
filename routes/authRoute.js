import express, { Router } from "express";
import {
  registerController,
  loginController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

//  router object
const router = express.Router();

// routing
// Register || POST
router.post("/register", registerController);

// Login || POST
router.post("/login", loginController);

// Test protected  route
router.get("/test", requireSignIn, isAdmin, (req, res) => {
  res.send("<h1> hello from protected route</h1>");
});

// protected route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
