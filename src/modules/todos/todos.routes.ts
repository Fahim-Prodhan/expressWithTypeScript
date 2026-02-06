import express, { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { todosControllers } from "./todos.controllers";

const router = express.Router();

// toDoes

router.post("/", todosControllers.createTodos);

router.get("/", todosControllers.getAllTodos);

// Get single todo
router.get("/:id", todosControllers.getTodosById );

// Update todo
router.put("/:id", todosControllers.updateTodos);

// Delete todo
router.delete("/:id",todosControllers.deleteTodos);

export const todosRoutes = router;