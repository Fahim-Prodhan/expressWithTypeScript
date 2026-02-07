import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import config from "../config";

const auth = (...roles:string[])=>{
   return async (req:Request, res:Response, next:NextFunction)=>{
       try {
         const authToken = req.headers.authorization;
        if(!authToken){
            return res.status(400).json({
                success: false,
                message:"Authentication Fail"
            })
        }
        const decoded = jwt.verify(authToken, config.secret_key as string) as JwtPayload
        console.log(decoded);
        req.user = decoded;
        console.log(roles);
        
        if(roles.length && !roles.includes(decoded.role)){
            return res.status(401).json({
                success:false,
                message:"unauthorize!"
            })
        }

        next();
       } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
       }
        
   }
}

export default auth;