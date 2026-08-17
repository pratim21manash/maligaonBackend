// import jwt from 'jsonwebtoken'
// import Admin from '../models/Admin.js'

// export const protect = async (req, res, next) => {
//   try {
//     const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1]

//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized, no token' })
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     const admin = await Admin.findById(decoded.id).select('-password')

//     if (!admin) {
//       return res.status(401).json({ message: 'Not authorized, admin not found' })
//     }

//     req.admin = admin
//     next()
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, token failed' })
//   }
// }

import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie OR Authorization header
    const token =
      req.cookies.adminToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
