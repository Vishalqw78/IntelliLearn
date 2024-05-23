import { sign } from "jsonwebtoken";

function generateAuthToken(userId) {
    const token = sign({ _id: userId }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
}

export default {
    generateAuthToken,
};
