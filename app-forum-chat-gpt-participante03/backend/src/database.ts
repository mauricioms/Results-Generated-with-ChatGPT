// src/database.ts
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Question } from './entities/Question';

export const connect = async () => {
  await createConnection({
    type: 'sqlite',
    database: 'app-forum.db',
    synchronize: true,
    logging: false,
    entities: [User, Question],
  });
};
