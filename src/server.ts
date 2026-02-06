import express, { Request, Response } from "express";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todosRoutes } from "./modules/todos/todos.routes";

const app = express();
const port = 5000;

initDB();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello !");
});

app.use('/users', userRoutes);
app.use('/todos',todosRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
