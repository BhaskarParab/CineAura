import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// 1. We define exactly what our Request should look like right here
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const jwtVerifyMiddleware = (
  req: Request, // Keep this as Request for compatibility
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error("JWT Secret is undefined");
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
      id: string;
    };

    // 2. We use a Type Cast (as) right here. 
    // This tells TypeScript: "Trust me, I know what I'm doing."
    (req as AuthenticatedRequest).user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};