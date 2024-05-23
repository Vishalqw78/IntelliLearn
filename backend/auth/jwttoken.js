import { generateAuthToken } from "./auth";

// Assuming you have a Prisma client instance named 'prisma'
async function createUser(Name, email, password,Avatar) {
    const user = await prisma.user.create({
        data: {
            Name,
            email,
            password,
            Avatar
        },
    });

    const token = generateAuthToken(user.id);

    // Here, you might associate the token with the user or send it in the response
    // For example:
    // await prisma.authToken.create({
    //     data: {
    //         userId: user.id,
    //         token,
    //         // Set expiresAt if needed
    //     },
    // });

    return user;
}
