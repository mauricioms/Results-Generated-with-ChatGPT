import bcrypt from 'bcrypt';
import {Router} from 'express';
import jwt from 'jsonwebtoken';

import dbPromise from '../db';

const router = Router();

router.post('/register', async (req, res) => {
  try
  {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await dbPromise;
    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({message: 'User registered successfully'});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to register user'});
  }
});

router.post('/login', async (req, res) => {
  try
  {
    const db = await dbPromise;
    const {email, password} = req.body;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (user && (await bcrypt.compare(password, user.password)))
    {
      const secretKey = process.env.JWT_SECRET || 't2bO36uAY6A19yoRyvnOd6yH';
      const token = jwt.sign({id: user.id}, secretKey, {
        expiresIn: '1h', // Set the expiration time for the token, for example, 1 hour
      });

      res.status(200).json({message: 'Logged in successfully', user, token});
    }
    else
    {
      res.status(401).json({error: 'Invalid email or password'});
    }
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Failed to log in'});
  }
});

export default router;
