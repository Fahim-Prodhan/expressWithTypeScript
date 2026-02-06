import { pool } from "../../config/db";

const createTodo = async (user_id: string | number, title: string) => {
  const query = `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`;
  const result = await pool.query(query, [user_id, title]);
  return result;
};

const getAllTodos = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

const getTodosById = async (id: string | number) => {
  const result =  await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return result;
};

const updateTodos = async(title:string, completed:boolean, id:string)=>{
     const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, id]
    );
    return result
}

const deleteTodos = async (id:string)=>{
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [id]
    );
    return result
}

export const todoServices = {
  createTodo,
  getAllTodos,
  getTodosById,
  updateTodos,
  deleteTodos
};
