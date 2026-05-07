import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Module augmentation: adds `user` property to Express Request globally
// This is the officially recommended way to extend Express types
declare module "express" {
  interface Request {
    user?: any;
  }
}

// AuthRequest is now just Request with the augmented `user` property
export type AuthRequest = Request;

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      error: "Access token required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({
      error: "Invalid token",
    });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(" or ")}.`,
      });
      return;
    }

    next();
  };
};
