import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { TryCatch } from "../middlewares/error.js";

export const isAuthentication = TryCatch( async(req,res,next) => {
  
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    }
    
    const token = authHeader.split(' ')[1];
   
    if (!token) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    }
    
    const decodedData = await jwt.verify(token,process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id);
    
  
    next();
  });
  