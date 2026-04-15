import "dotenv/config";
import type { Request, Response } from "express";
import { prisma } from "../db/db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const conditions: any[] = [];

  if (username) conditions.push({ username });
  if (email) conditions.push({ email });

  const isUser = conditions.length
    ? await prisma.userData.findFirst({
        where: { OR: conditions },
      })
    : null;

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
        provider: "local"
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
      sameSite: "none",
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

    if (!isUser || !isUser.password) {
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
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      provider: isUser.provider
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

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        provider: true
      },
    });

    res.status(200).json({ user });
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
    sameSite: "none",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Token is required",
    });
  }

  try {
    const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

    if (!googleClientId) {
      throw new Error("GOOGLE_CLIENT_ID is undefined");
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        message: "Invalid Google token",
      });
    }

    const { email, name, picture, sub } = payload;

    // sub = unique Google ID
    let user = await prisma.userData.findUnique({
      where: { email },
    });

    // If user doesn't exist → create
    if (!user) {
      user = await prisma.userData.create({
        data: {
          email,
          username: name as string,
          googleId: sub,
          avatar: picture ?? null,
          password: null, // no password for Google users
          provider: "google"
        },
      });
    }

    // If user exists but no googleId → link account
    if (user && !user.googleId) {
      user = await prisma.userData.update({
        where: { id: user.id },
        data: {
          googleId: sub,
          avatar: picture ?? null,
          provider: "google"
        },
      });
    }

    // Generate JWT (same as your system)
    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET_KEY is undefined");
    }

    const jwtToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "7d" });

    // Set cookie (same config as your login)
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true, // true in production
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
};
