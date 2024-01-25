import express from "express";
import { database } from "./database";
export module entity {
  export class User {
    constructor(public name: string, public email?: string, public username?: string, public password?: string) {}
    static save(db: database.DB, res: express.Response, newUser: User): void {
      db.pullSQL("SELECT count(*) as total FROM tb_user WHERE username = '" + newUser.username + "'; ", (result: any) => {
          if (result[0].total == 0) {
            db.pushSQL("INSERT OR IGNORE INTO tb_user (username, password, name_user, email) VALUES (?, ?, ?, ?); ", [newUser.username, newUser.password, newUser.name, newUser.email],  (ok: boolean) => {
                res.status(200).send({ ok: ok, message: "Registered user." });
            });
          } else {
            res.status(400).send({ ok: false, message: "Name of the existing user." });
          }
      });
    }
  }
  export class Pergunta {
    constructor(public id: number, public subject: string, public content: string, public dtregisted: string, username: string) {
      this.user = new User(username);
    }
    user: User;
    respostas: Resposta[] = [];
    static all(db: database.DB, res: express.Response): void {
      db.pullSQL("SELECT id, subject, content, dtregisted, (SELECT name_user FROM tb_user u WHERE u.id = user_id) as username FROM tb_pergunta; ", (result: any) => {
          if (result) {
            const rs: entity.Pergunta[] = [];
            for (let r of result) {
              rs.push(new entity.Pergunta(r.id, r.subject, r.content, r.dtregisted, r.username));
            }
            res.status(200).send(rs);
          } else {
            res.status(204).send(result);
          }
      });
    }
    static async create(db: database.DB, res: express.Response, subject: string, content: string, username: string): Promise<boolean> {
      return new Promise<boolean>((resolve: any): void => {
        db.pushSQL("INSERT OR IGNORE INTO tb_pergunta (subject, content, user_id) VALUES (?, ?, (SELECT id FROM tb_user WHERE username = ?)); ", [subject, content, username],
          (ok: boolean) => {
            resolve(true);
        });
      });
    }
    static delete(db: database.DB, res: express.Response, id: number): void {
      db.pullSQL(`DELETE FROM tb_pergunta WHERE id = ${id}; `, (result: any) => {
          if (result) {
            res.status(200).send(result);
          } else {
            res.status(204).send(result);
          }
      });
    }
    static load(db: database.DB, res: express.Response, idPergunta: number): void {
      db.pullSQL(`SELECT id, subject, content, dtregisted, (SELECT name_user FROM tb_user u WHERE u.id = user_id) as username FROM tb_pergunta WHERE id = ${idPergunta};`, (perguntas: any) => {
          if (perguntas) {
            const data = perguntas[0];
            db.pullSQL(`SELECT id, pergunta_id, content, dtregisted, (SELECT name_user FROM tb_user u WHERE u.id = user_id) as username FROM tb_resposta WHERE pergunta_id = ${idPergunta};`,
              (result: any) => {
                if (result) {
                  const rs: entity.Resposta[] = [];
                  for (let r of result) {
                    rs.push(new entity.Resposta(r.id, r.pergunta_id, r.content, r.dtregisted, r.username));
                  }
                  const pergunta: entity.Pergunta = new entity.Pergunta( data.id, data.subject, data.content, data.dtregisted, data.username );
                  pergunta.respostas = rs;
                  res.status(200).send(pergunta);
                } else {
                  res.status(204).send(result);
                }
            });
          }
      });
    }
  }
  export class Resposta {
    constructor( public id: number, public idPergunta: number, public content: string, public dtregisted: string, username: string) {
      this.user = new User(username);
    }
    user: User;
    static save(db: database.DB, res: express.Response, idPergunta: number, content: string, username: string): void {
      db.pushSQL("INSERT OR IGNORE INTO tb_resposta (pergunta_id, content, user_id) VALUES (?, ?, (SELECT id FROM tb_user WHERE username = ?)); ", [idPergunta, content, username], (ok: boolean) => { res.status(200).send({ ok: ok });  });
    }
    static delete(db: database.DB, res: express.Response, id: number): void {
      db.pullSQL(`DELETE FROM tb_resposta WHERE id = ${id}; `, (result: any) => {
          if (result) {
            res.status(200).send(result);
          } else {
            res.status(204).send(result);
          }
      });
    }
  }
}
