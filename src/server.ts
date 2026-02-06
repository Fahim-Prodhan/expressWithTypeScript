import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.DB_URL}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS todoes(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
            `);
};

initDB();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello !");
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, address, phone } = req.body;

  try {
    const query = `INSERT INTO users(name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const value = [name, email, age, address, phone];

    const result = await pool.query(query, value);

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
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM users`;
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: "Data Fetch successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const query = `SELECT * FROM users WHERE id=${id}`; //not safe (vulnerable for sql injection)
    const query = `SELECT * FROM users WHERE id=$1`;

    const result = await pool.query(query,[id]);

    if (result.rows.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data Fetch successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/users/:id", async(req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {name,email} = req.body;
    const query = `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`;
    const result = await pool.query(query,[name,email,id]);

    if(result.rows.length <=0){
     return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data UPDATED successfully!",
      data: result.rows[0],
    });

  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
