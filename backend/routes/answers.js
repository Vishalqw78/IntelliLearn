import prisma from './db.js';
import { Router } from 'express';

// Create a new router instance
const router = Router();

// Get answers for a specific question
router.get('/answers', async (req, res) => {
  const { questionId } = req.query;
  try {
    const answers = await prisma.answers.findMany({
      where: { questionId },
      include: {
        author: true,
        children: true,  // Ensure children are fetched
      },
    });
    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Error fetching answers' });
  }
});

// Post a new answer
router.post('/answers', async (req, res) => {
  const { text, parentId, questionId, authorId } = req.body;
  try {
    const newAnswer = await prisma.answers.create({
      data: {
        text,
        parentId,
        questionId,
        authorId,
      },
      include: {
        author: true,
      },
    });
    console.log(newAnswer)
    res.json(newAnswer);
  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({ error: 'Error creating answer' });
  }
});

// Recursive function to delete an answer and its children
const deleteAnswerAndChildren = async (id) => {
  // Fetch all child answers of the current answer
  const childAnswers = await prisma.answers.findMany({
    where: {
      parentId: id, // Assuming 'parentId' is the field that links to the parent answer
    },
  });

  // Recursively delete each child answer
  for (const childAnswer of childAnswers) {
    await deleteAnswerAndChildren(childAnswer.id);
  }

  // Delete the current answer
  await prisma.answers.delete({
    where: { id },
  });
};

// Delete an answer and its nested children
router.delete('/answers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Call the recursive deletion function
    await deleteAnswerAndChildren(id);

    // Send a 204 No Content response
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ error: 'Error deleting answer' });
  }
});

// Export the router to use in other parts of your application
export default router;
