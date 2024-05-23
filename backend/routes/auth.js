import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import sendVerificationEmail  from "./mailsender.js";
import crypto from 'crypto';
import Joi from "joi";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const token = generateAuthToken(user.id);

        if (!user.verified) {
            let token = await prisma.token.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (!token) {
                token = await prisma.token.create({
                    data: {
                        userId: user.id,
                        token: crypto.randomBytes(32).toString("hex"),
                    },
                });

                const url = `http://localhost:8080/users/${user.id}/verify/${token.token}`;
                await sendVerificationEmail(user.email, url);
            }

            return res.status(400).send({ message: "An email sent to your account. Please verify." });
        }
        
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const generateAuthToken = (userId) => {
    const token = jwt.sign({ _id: userId }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

export default router;
