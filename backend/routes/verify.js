import { Router } from "express";
import { genSalt, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import  sendVerificationEmail  from "./mailsender.js";
import crypto from 'crypto';
const prisma = new PrismaClient();

const router = Router();

router.get("/:id/verify/:token/", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!user) {
            return res.status(400).send({ message: "Invalid link" });
        }

        const token = await prisma.token.findFirst({
            where: { token: req.params.token
            },
        });        

        if (!token) {
            return res.status(400).send({ message: "Invalid link" });
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                verified: true,
            },
        });

        await prisma.token.deleteMany({
            where: {
                token: req.params.token,
            }
        });

        res.redirect('http://localhost:5173/verification');
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default router;
