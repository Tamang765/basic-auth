import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
