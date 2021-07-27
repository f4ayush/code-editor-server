import express from "express";
const router = express.Router();

import { signin, signup, save, getCode } from "../controllers/user.js";

router.post("/user/signin", signin);
router.post("/user/signup", signup);
router.post("/save", save);
router.post("/getCode", getCode);

export default router;