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

router.post( "/createPost" ,authenticateToken, async (req, res) => {
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
      const post = await prisma.post.create({
        data: {
          title: req.body.title,
          content : req.body.content,
          authorId: req.user._id,
          image: req.body.image,
          views : req.body.views || 0,
          Category: req.body.Category,
          date: req.body.date,
        },
      });
  
      res.json({ data: post });
    } catch (e) {
      res.status(500).json({ error: "An error occurred while creating the post." });
    }
  }
);

router.put("/updatepost/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id; // Get the post ID from the request params
  try {
    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId }, // Specify the post to update using the ID
      data: {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        Category: req.body.Category,
      },
    });

    res.json({ data: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "An error occurred while updating the post." });
  }
});


router.delete("/deletePost/:id", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id; // Access the post ID from req.params
    
    // Check if the post exists before deleting
    const postExists = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    
    if (!postExists) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if the authenticated user is the author of the post
    if (postExists.authorId !== req.user._id) {
      return res.status(403).json({ error: "You are not authorized to delete this post." });
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
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

router.get("/getallPost", async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
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

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ error: "No posts found." });
    }

    // Map over each post to populate authorName
    const postsWithAuthorName = allPosts.map(post => ({
      ...post,
      authorName: post.author.Name // Add authorName to each post
    }));

    res.json(postsWithAuthorName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while extracting the posts." });
  }
});


router.get('/PostDetails/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    // Step 1: Retrieve details of the post with the specified ID
    const details = await prisma.post.findUnique({
      where: {
        id: postId,
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
    const similarPosts = await prisma.post.findMany({

    });
    const filteredPosts = similarPosts.filter(post =>
      categories.some(category => post.Category.includes(category))
    )
    const sortedPosts = filteredPosts.sort((a, b) => b.views - a.views);
    const returnedPost = sortedPosts.slice(0,3);
    const postWithAuthor = {
      ...details,
      author: authorDetails,
      similarPost : returnedPost, // Add author details to the post object
    };

    res.json( postWithAuthor );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while extracting the post." });
  }
});


router.put('/addview/:id', async (req, res) => {
  try {
    const postId = req.params.id; // Access the post ID from req.params
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    
    // Increment the view count by 1
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        views: post.views + 1, // Increment the view count
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the view count." });
  }
});
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.key; // Extract the search query from the request

    let allPosts;
    if (searchQuery) {
      // If a search query is provided, filter posts by matching the title
      allPosts = await prisma.post.findMany({
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
      allPosts = await prisma.post.findMany({
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

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ error: "No posts found." });
    }

    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while extracting the posts." });
  }
});




export default router;