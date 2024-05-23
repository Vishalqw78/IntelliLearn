import { Router } from "express";
import { genSalt, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient();

const router = Router();
const authenticateToken = (req, res, next) => {
  const bearer = req.headers.authorization;

  const [, token] = bearer.split(" ");
  
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
  
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.userId = decoded._id;
      next();
    });
  };
  
  router.get("/", authenticateToken, async (req, res) => {
    // The userId is available in req.userId due to the middleware
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  });

  
export default router;