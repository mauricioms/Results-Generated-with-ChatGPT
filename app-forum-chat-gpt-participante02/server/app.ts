import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { RunResult } from 'sqlite3';
import { User } from './types';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)');
  db.run('CREATE TABLE posts (id INTEGER PRIMARY KEY, assunto TEXT, usuario TEXT, data TEXT, conteudo TEXT)');
  db.run('CREATE TABLE answers (id INTEGER PRIMARY KEY, postId INTEGER, username TEXT, creationDate TEXT, content TEXT)');
});

// Add your routes here

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// server/app.ts

// ... previous code ...

// Sign up route
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  stmt.run(email, password, (err: Error) => {
    if (err) {
      return res.status(500).send({ error: 'An error occurred while signing up.' });
    }
    res.send({ message: 'User successfully signed up.' });
    });
    });

    app.get('/test', (req, res) => {
      res.send('Server is running!');
    });
    
    // Sign in route
    app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', email, (err: Error, row: User | undefined) => {
        if (err || !row || row.password !== password) {
            res.status(401).send('Unauthorized');
          } else {
            res.status(200).send('Authenticated');
          }
    });
    });

    app.get('/api/posts', (req, res) => {
      db.all('SELECT * FROM posts', (err: Error, rows: Array<any>) => {
        if (err) {
          res.status(500).send({ error: 'An error occurred while fetching posts.' });
        } else {
          res.send(rows);
        }
      });
    });
    
    // Create post route
    app.post('/api/posts', (req, res) => {
      const { assunto, usuario, data, conteudo } = req.body;
      const stmt = db.prepare('INSERT INTO posts (assunto, usuario, data, conteudo) VALUES (?, ?, ?, ?)');
      stmt.run(assunto, usuario, data, conteudo, (err: Error) => {
        if (err) {
          res.status(500).send({ error: 'An error occurred while creating a post.' });
        } else {
          res.send({ message: 'Post successfully created.' });
        }
      });
    });

    app.get('/api/posts/:id', (req, res) => {
      const id = req.params.id;
      db.get('SELECT * FROM posts WHERE id = ?', id, (err: Error, row: any) => {
        if (err) {
          res.status(500).send({ error: 'An error occurred while fetching the post.' });
        } else if (row) {
          res.send(row);
        } else {
          res.status(404).send({ error: 'Post not found.' });
        }
      });
    });

    app.get('/api/posts/:id/answers', (req, res) => {
      const postId = req.params.id;
      db.all('SELECT * FROM answers WHERE postId = ?', postId, (err: Error, rows: Array<any>) => {
        if (err) {
          res.status(500).send({ error: 'An error occurred while fetching answers.' });
        } else {
          res.send(rows);
        }
      });
    });

    app.post('/api/posts/:id/answers', (req, res) => {
      const postId = req.params.id;
      const { username, creationDate, content } = req.body;
      const stmt = db.prepare('INSERT INTO answers (postId, username, creationDate, content) VALUES (?, ?, ?, ?)');
      stmt.run(postId, username, creationDate, content, (err: Error) => {
        if (err) {
          res.status(500).send({ error: 'An error occurred while saving an answer.' });
        } else {
          res.send({ message: 'Answer successfully saved.' });
        }
      });
    });

    app.delete('/api/answers/:id', (req, res) => {
      const id = req.params.id;
      db.run('DELETE FROM answers WHERE id = ?', id, (err: Error) => {
        if (err) {
          res.status(500).send({ error: 'An error occurred while deleting the answer.' });
        } else {
          res.send({ message: 'Answer successfully deleted.' });
        }
      });
    });

    app.delete('/api/posts/:id', (req, res) => {
      const postId = req.params.id;
      
      // First, delete all answers of the post
      db.run('DELETE FROM answers WHERE postId = ?', postId, (err: Error) => {
        if (err) {
          return res.status(500).send({ error: 'An error occurred while deleting the answers.' });
        }
    
        // Then delete the post
        db.run('DELETE FROM posts WHERE id = ?', postId, (err: Error) => {
          if (err) {
            return res.status(500).send({ error: 'An error occurred while deleting the post.' });
          } else {
            return res.send({ message: 'Post and related answers successfully deleted.' });
          }
        });
      });
    });
    
    