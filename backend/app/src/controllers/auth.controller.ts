import "dotenv/config";
import type { Request, Response } from "express";
import { prisma } from "../db/db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import { AuthRequest } from "../types";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const isUser = await prisma.userData.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (isUser) {
    if (isUser.username === username) {
      return res.status(400).json({
        message: "username already exists",
      });
    }
    if (isUser.email === email) {
      return res.status(400).json({
        message: "email already exists",
      });
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.userData.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET_KEY is undefined");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "User creation failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isUser = await prisma.userData.findUnique({
      where: {
        email,
      },
    });

    if (!isUser) {
      return res.status(401).json({
        message: "Invalid email",
      });
    }

    const isPassword = await bcrypt.compare(password, isUser.password);

    if (!isPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET_KEY is undefined");
    }

    const token = jwt.sign({ id: isUser.id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login failed",
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    if(!userId){
      return res.status(400).json({
        message: "unauthorized"
      })
    }

    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json(user);
  } catch {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};