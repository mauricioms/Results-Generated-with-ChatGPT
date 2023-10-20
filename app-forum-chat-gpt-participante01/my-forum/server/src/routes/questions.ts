import {Request,
        Response,
        Router} from 'express';

import dbPromise from '../db';
import authenticate from '../middlewares/authenticate';
import {RequestWithUser} from '../types/RequestWithUser';

const router = Router();

router.get('/', async (_req, res) => {
  try
  {
    const db = await dbPromise;
    const questions = await db.all('SELECT id, title, content, user_id, createdAt FROM questions ORDER BY id DESC');

    res.status(200).json(questions);
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch questions'});
  }
});

router.post('/', authenticate, async (req: Request, res: Response) => {
  try
  {
    const userReq = req as RequestWithUser;

    const {title, content} = req.body;

    const user_id = userReq.user.id;

    const db = await dbPromise;
    await db.run('INSERT INTO questions (title, content, user_id) VALUES (?, ?, ?)', [title, content, user_id]);

    res.status(201).json({message: 'Question created successfully'});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to create question'});
  }
});

router.delete('/:questionId', authenticate, async (req, res) => {
  try
  {
    const {questionId} = req.params;
    const db = await dbPromise;

    await db.run('DELETE FROM questions WHERE id = ?', [questionId]);

    res.status(200).json({message: 'Question deleted successfully'});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to delete question'});
  }
});

router.get('/:questionId/answers', async (req, res) => {
  try
  {
    const {questionId} = req.params;
    const db = await dbPromise;

    const answers = await db.all(`
      SELECT answers.id, answers.text, users.id as user_id, users.email as user_email, answers.createdAt
      FROM answers
      JOIN users ON answers.user_id = users.id
      WHERE answers.question_id = ?
      ORDER BY answers.id DESC
    `,
                                 [questionId]);

    res.status(200).json(answers);
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch answers'});
  }
});

router.get('/:questionId', async (req, res) => {
  try
  {
    const {questionId} = req.params;
    const db = await dbPromise;
    const question = await db.get('SELECT * FROM questions WHERE id = ?', [questionId]);

    if (question)
    {
      res.status(200).json(question);
    }
    else
    {
      res.status(404).json({error: 'Question not found'});
    }
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch question'});
  }
});

export default router;
