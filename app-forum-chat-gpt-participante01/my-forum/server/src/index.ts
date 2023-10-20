import cors from 'cors';
import express from 'express';

import authenticate from './middlewares/authenticate';
import answersRouter from './routes/answers';
import authRouter from './routes/auth';
import questionsRouter from './routes/questions';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/questions', authenticate, questionsRouter);
app.use('/api/question', authenticate, answersRouter);
app.use('/api/answers', authenticate, answersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
