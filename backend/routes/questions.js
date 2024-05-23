import { Router } from "express";
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
    req.user = decoded; // Set decoded user object to req.user

    next();
  });
};

router.post( "/createQuestion" ,authenticateToken, async (req, res) => {
    try {
      // Check if the user exists before creating the post
      console.log(req.user._id)
      const userExists = await prisma.user.findUnique({
        where: {
          id: req.user._id,
        },
      });
  
      if (!userExists) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Create the post
      const Question = await prisma.question.create({
        data: {
          title: req.body.title,
          content : req.body.content,
          authorId: req.user._id,
          views : req.body.views || 0,
          Category: req.body.Category,
          date: req.body.date,
        },
      });
  
      res.json({ data: Question });
    } catch (e) {
      res.status(500).json({ error: "An error occurred while creating the post." });
    }
  }
);

router.put("/updateQuestion/:id", authenticateToken, async (req, res) => {
  const QuestionId = req.params.id; // Get the post ID from the request params
  try {
    // Update the post
    const updatedQuestion = await prisma.question.update({
      where: { id: QuestionId }, // Specify the post to update using the ID
      data: {
        title: req.body.title,
        content: req.body.content,
        Category: req.body.Category,
      },
    });

    res.json({ data: updatedQuestion });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "An error occurred while updating the post." });
  }
});


router.delete("/deleteQuestion/:id", authenticateToken, async (req, res) => {
  try {
    const QuestionId = req.params.id; // Access the post ID from req.params
    
    // Check if the post exists before deleting
    const Questionexist = await prisma.question.findUnique({
      where: {
        id: QuestionId,
      },
    });
    
    if (!Questionexist) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if the authenticated user is the author of the post
    if (Questionexist.authorId !== req.user._id) {
      return res.status(403).json({ error: "You are not authorized to delete this post." });
    }

    // Delete the post
    await prisma.question.delete({
      where: {
        id: QuestionId,
      },
    });

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the post." });
  }
});

/*
function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
}
*/

router.get("/getallQuestions", async (req, res) => {
  try {
    const allQuestions = await prisma.question.findMany({
      include: {
        author: {
          select: {
            Name: true,
            avatar:true,// Include only the Name of the author
          }
        }
      },
      orderBy: {
        date: 'asc' // Order posts by creation date, descending
      }
    });

    if (!allQuestions || allQuestions.length === 0) {
      return res.status(404).json({ error: "No posts found." });
    }

    // Map over each post to populate authorName
    const QuestionWithAuthorName = allQuestions.map(post => ({
      ...post,
      authorName: post.author.Name // Add authorName to each post
    }));

    res.json(QuestionWithAuthorName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while extracting the posts." });
  }
});


router.get('/QuestionDetails/:id', async (req, res) => {
  try {
    const QuestionId = req.params.id;
    // Step 1: Retrieve details of the post with the specified ID
    const details = await prisma.question.findUnique({
      where: {
        id: QuestionId,
      },
    });

    if (!details) {
      return res.status(404).json({ error: "Post not found." });
    }
    const authorDetails = await prisma.user.findUnique({
      where: {
        id: details.authorId,
      },
      select: {
        id: true,
        Name: true,
        email: true,
        avatar:true,
      },
    });

    // Combine post details with author details
    

    // Step 2: Extract categories associated with the retrieved post
    const categories = details.Category; // Access the Category field directly

    // Step 3: Fetch posts with similar categories
    const similarQuestion = await prisma.question.findMany({

    });
    const filteredQ = similarQuestion.filter(post =>
      categories.some(category => post.Category.includes(category))
    )
    const sortedQ = filteredQ.sort((a, b) => b.views - a.views);
    const returnedQ = sortedQ.slice(0,3);
    const QWithAuthor = {
      ...details,
      author: authorDetails,
      similarQ : returnedQ, // Add author details to the post object
    };

    res.json( QWithAuthor );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while extracting the post." });
  }
});


router.put('/addviewQ/:id', async (req, res) => {
  try {
    const QuestionId = req.params.id; // Access the post ID from req.params
    const Questiona = await prisma.question.findUnique({
      where: {
        id: QuestionId,
      },
    });
    if (!Questiona) {
      return res.status(404).json({ error: "Post not found." });
    }
    
    // Increment the view count by 1
    const updatedQ = await prisma.question.update({
      where: {
        id: QuestionId,
      },
      data: {
        views: Questiona.views + 1, // Increment the view count
      },
    });
    console.log(updatedQ)
    res.json(updatedQ);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the view count." });
  }
});
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.key; // Extract the search query from the request

    let allQ;
    if (searchQuery) {
      // If a search query is provided, filter posts by matching the title
      allQ = await prisma.question.findMany({
        where: {
          title: {
            contains: searchQuery, // Match the title partially
            mode: 'insensitive' // Case-insensitive matching
          }
        },
        include: {
          author: {
            select: {
              Name: true,
              avatar:true,
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
    } else {
      // If no search query is provided, fetch all posts
      allQ = await prisma.question.findMany({
        include: {
          author: {
            select: {
              Name: true,
              avatar:true,
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
    }

    if (!allQ || allQ.length === 0) {
      return res.status(404).json({ error: "No posts found." });
    }

    res.json(allQ);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while extracting the posts." });
  }
});




export default router;