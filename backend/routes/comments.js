import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Create a new router instance
const router = Router();

// Get comments for a specific post
router.get('/comments', async (req, res) => {
  const { postId } = req.query;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: true,
        children: true,  // Ensure children are fetched
      },
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Post a new comment
router.post('/comments', async (req, res) => {
  const { text, parentId, postId, authorId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        parentId,
        postId,
        authorId,
      },
      include: {
        author: true,
      },
    });
    console.log(newComment)
    res.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// Recursive function to delete a comment and its children
const deleteCommentAndChildren = async (id) => {
  // Fetch all child comments of the current comment
  const childComments = await prisma.comment.findMany({
    where: {
      parentId: id, // Assuming 'parentId' is the field that links to the parent comment
    },
  });

  // Recursively delete each child comment
  for (const childComment of childComments) {
    await deleteCommentAndChildren(childComment.id);
  }

  // Delete the current comment
  await prisma.comment.delete({
    where: { id },
  });
};

// Delete a comment and its nested children
router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Call the recursive deletion function
    await deleteCommentAndChildren(id);

    // Send a 204 No Content response
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

// Export the router to use in other parts of your application
export default router;
