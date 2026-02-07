import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router();

router.post('/login', authControllers.login)

export const authRoutes = router;