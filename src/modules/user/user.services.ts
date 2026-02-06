import { pool } from "../../config/db";

const createUser = async (
  name: string,
  email: string,
  age: number,
  phone: string,
  address: string,
) => {
  const query = `INSERT INTO users(name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const value = [name, email, age, phone, address];
  const result = await pool.query(query, value);
  return result;
};

const getAllUsers = async () => {
  const query = `SELECT * FROM users`;
  const result = await pool.query(query);
  return result;
};

const getUserById = async (id: string | number) => {
  // const query = `SELECT * FROM users WHERE id=${id}`; //not safe (vulnerable for sql injection)
  const query = `SELECT * FROM users WHERE id=$1`;
  const result = await pool.query(query, [id]);
  return result;
};

const updateUser = async (id: string | number, name: string, email: string) => {
  const query = `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`;
  const result = await pool.query(query, [name, email, id]);
  return result;
};

const deleteUser = async (id:string | number) => {
  const query = `DELETE FROM users WHERE id=$1 RETURNING *`;
  const result = await pool.query(query, [id]);
  return result;
};

export const userServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
