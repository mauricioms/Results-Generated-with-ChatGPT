import {Router} from 'express';

import dbPromise from '../db';
import authenticate from '../middlewares/authenticate';
import {RequestWithUser} from '../types/RequestWithUser';

const router = Router();

router.post('/:questionId/answers', authenticate, async (req, res) => {
  try
  {
    const {questionId} = req.params;

    const userReq = req as RequestWithUser;

    const {text} = req.body;
    const user_id = userReq.user.id;

    const db = await dbPromise;

    await db.run('INSERT INTO answers (text, user_id, question_id) VALUES (?, ?, ?)', [
      text,
      user_id,
      questionId,
    ]);

    res.status(201).json({message: 'Answer created successfully'});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to create answer'});
  }
});

router.delete('/:answerId', async (req, res) => {
  try
  {
    const {answerId} = req.params;
    const db = await dbPromise;

    await db.run('DELETE FROM answers WHERE id = ?', [answerId]);

    res.status(200).json({message: 'Answer deleted successfully'});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to delete answer'});
  }
});

export default router;
