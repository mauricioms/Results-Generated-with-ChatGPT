import {NextFunction,
        Request,
        Response} from 'express';
import jwt from 'jsonwebtoken';

import {RequestWithUser} from '../types/RequestWithUser';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token)
  {
    return res.status(401).json({error: 'Access denied, no token provided.'});
  }

  try
  {
    const secretKey = process.env.JWT_SECRET || 't2bO36uAY6A19yoRyvnOd6yH';
    const decoded = jwt.verify(token, secretKey) as {id: number};

    const userReq = (req as RequestWithUser);

    userReq.user = {id: decoded.id};
    next();
  }
  catch (err)
  {
    res.status(400).json({error: 'Invalid token.'});
  }
};

export default authenticate;
