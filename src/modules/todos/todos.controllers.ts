import { Request, Response } from "express";
import { todoServices } from "./todos.services";

const createTodos = async (req: Request, res: Response) => {
  try {
    const { user_id, title } = req.body;

    const result = await todoServices.createTodo(
      user_id as string | number,
      title,
    );

    res.status(201).json({
      success: true,
      message: "Data inserted!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getAllTodos();

    res.status(200).json({
      success: true,
      message: "todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};

const getTodosById = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodosById(
      req.params.id as string | number,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

const updateTodos = async (req: Request, res: Response) => {
  const { title, completed } = req.body;
  const { id } = req.params;
  try {
    const result = await todoServices.updateTodos(
      title,
      completed,
      id as string,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

const deleteTodos = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await todoServices.deleteTodos(id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

export const todosControllers = {
  createTodos,
  getAllTodos,
  getTodosById,
  updateTodos,
  deleteTodos,
};
