import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import config from "../../config";

const login = async(email:string , password:string)=>{
    const query = `SELECT * FROM users WHERE email=$1`;
    const result = await pool.query(query,[email]);
    if(result.rows.length === 0){
        return null;
    }
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return false
    }
    const jwtToken = jwt.sign({name:user.name,email:user.email, role:user.role}, config.secret_key as string,{
        expiresIn: '7d'
    })
 
    return {
        jwtToken,
        user
    }

}

export const authServices = {
    login
}