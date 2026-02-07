import express from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/",userControllers.createUser);

router.get("/", auth("admin",'user'), userControllers.getAllUsers);

router.get("/:id", userControllers.getUserById );

router.put("/:id", userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser );

export const userRoutes = router;