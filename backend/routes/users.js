import { Router } from "express";
import { genSalt, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import  sendVerificationEmail  from "./mailsender.js";
import crypto from 'crypto';
const prisma = new PrismaClient();

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { Name, email, password ,avatar} = req.body;
        const existingUser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (existingUser) {
            return res.status(409).send({ message: "User with given email already exists!" });
        }
        // Hash the password
        const salt = await genSalt(Number(process.env.SALT));
        const hashPassword = await hash(password, salt);

        // Create a new user using Prisma
        const createdUser = await prisma.user.create({
            data: {
                Name,
                email,
                password: hashPassword,
                avatar
            },
        });
        const userid = createdUser.id;
        const socialProfileU = await prisma.social.create({
            data: {
              userId: userid,
            },
        }
        )
        const now = new Date();

// Calculate the date and time after 1 hour
const afterOneHour = new Date(now.getTime() + 60 * 60 * 1000);
const expireDate = afterOneHour.toISOString();
        const token = await prisma.token.create({
            data: {
                token: crypto.randomBytes(32).toString("hex"),
                user: {
                    connect: { id: createdUser.id },
                },
                expiresAt:expireDate
            },
        });
        const url = `http://localhost:8080/api/verification/${createdUser.id}/verify/${token.token}`
        await sendVerificationEmail(createdUser.email,url);
        res.status(201).send({ message: "Email verification sent successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default router;
