import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken'

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
    req.user = decoded; // Set decoded user object to req.user

    next();
  });
};
// Update social media profiles for a user
router.put('/profile/:id',authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const socialData = req.body;

  try {
    // Step 1: Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Check if the user has a social profile
    const socialProfile = await prisma.social.findUnique({
      where: {
        userId: userId,
      },
    });
     console.log(socialProfile);

    // Step 3: Update or create social profile based on existence
    let socialProfileU;
    if (socialProfile) {
      const socialid = socialProfile.id;
      // Update the existing social profile
       socialProfileU = await prisma.social.update({
        where: {
          id: socialid,
        },
        data: socialData,
      });
    } else {
      // Create a new social profile
       socialProfileU = await prisma.social.create({
        data: {
          userId: userId,
          ...socialData,
        },
      });
    }

    res.status(200).json(socialProfileU);
  } catch (error) {
    console.error('Error updating social profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;