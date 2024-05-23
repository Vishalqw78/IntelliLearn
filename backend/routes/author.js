// Import required modules
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

// Create a new router instance
const router = Router();

// Define a route to get user details by ID
router.get('/author/:id', async (req, res) => {
    // Extract user ID from request parameters
    
    
    try {
        const userId = req.params.id;
        // Query the database to find the user by ID
        const details = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                Name: true,
                email: true,
                avatar:true,
                social:true,
              },
        });

        // If user is not found, return a 404 error
        if (!details) {
            return res.status(404).json({ error: "User not found" });
        }
        const userposts = await prisma.post.findMany({
            where:{
                authorId : userId,
            },
        })

        if (!userposts) {
            return res.status(404).json({ error: "No Post Found" });
        }

        const userdetails = { ...details, userposts}
        // If user is found, send their details as a JSON response
        res.json(userdetails);
    } catch (error) {
        // If any error occurs during the process, return a 500 error
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user details." });
    }
});

// Export the router to use in other parts of your application
export default router;
