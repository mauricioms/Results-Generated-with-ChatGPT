import express from "express";
import passport from "passport";

import {appweb} from "./app-web";
import {database} from "./database";
import {entity} from "./entity";

export module endpoint
{
  export const loadEndPoint = (app: express.Express,
                               db: database.DB,
                               auth: any = null): void => {
    app.all(["/api/pergunta/:id/deletar"], auth, (req: express.Request, res: express.Response): void => {
      const user: string = new appweb.User(req.user).username;
      const idPergunta: number = Number(req.params.id);

      db.pullSQL("DELETE FROM tb_pergunta WHERE id = " + idPergunta + "; ", (result: any) => {
        if (result)
        {
          res.status(200).send(result);
        }
        else
        {
          res.status(204).send(result);
        }
      });
    });

    app.all(["/api/resposta/:id/remover"], auth, (req: express.Request, res: express.Response): void => {
      const user: string = new appweb.User(req.user).username;
      const idResposta: number = Number(req.params.id);

      db.pullSQL("DELETE FROM tb_resposta WHERE id = " + idResposta + "; ", (result: any) => {
        if (result)
        {
          res.status(200).send(result);
        }
        else
        {
          res.status(204).send(result);
        }
      });
    });

    app.all(["/api/user/save"], (req: express.Request, res: express.Response): void => {
      let user: appweb.User = new appweb.User(req.user);
      const newUser: {name: string, email: string, username: string, password: string} = req.body;

      db.pullSQL("SELECT count(*) as total FROM tb_user WHERE username = '" + newUser.username + "'; ", (result: any) => {
        if (result[0].total == 0)
        {
          db.pushSQL("INSERT OR IGNORE INTO tb_user (username, password, name_user, email) VALUES (?, ?, ?, ?); ",
                     [newUser.username, newUser.password, newUser.name, newUser.email],
                     (ok: boolean) => {
                       res.status(200).send({ok: ok, message: 'Registered user.'});
                     });
        }
        else
        {
          res.status(400).send({ok: false, message: 'Name of the existing user.'});
        }
      });
    });

    app.all(["/api/resposta/:id/save"], auth, (req: express.Request, res: express.Response): void => {
      let user: appweb.User = new appweb.User(req.user);

      const idPergunta: number = Number(req.body.idPergunta);
      const content: string = req.body.content;
      const username: string = user.username;

      db.pushSQL("INSERT OR IGNORE INTO tb_resposta (pergunta_id, content, user_id) VALUES (?, ?, (SELECT id FROM tb_user WHERE username = ?)); ",
                 [idPergunta, content, username], (ok: boolean) => {
                   res.status(200).send({ok: ok});
                 });
    });

    app.all(["/api/pergunta/:id"], auth, (req: express.Request, res: express.Response): void => {
      const user: string = new appweb.User(req.user).username;
      const idPergunta: number = Number(req.params.id);

      db.pullSQL("SELECT id, subject, content, dtregisted, (SELECT name_user FROM tb_user u WHERE u.id = user_id) as username FROM tb_pergunta WHERE id = " + idPergunta + "; ", (perguntas: any) => {
        if (perguntas)
        {
          const data = perguntas[0];

          db.pullSQL("SELECT id, pergunta_id, content, dtregisted, (SELECT name_user FROM tb_user u WHERE u.id = user_id) as username FROM tb_resposta WHERE pergunta_id = " + idPergunta + "; ", (result: any) => {
            if (result)
            {
              const rs: entity.Resposta[] = [];

              for (let r of result)
              {
                rs.push(new entity.Resposta(r.id, r.pergunta_id, r.content, r.dtregisted, r.username));
              }
              const pergunta: entity.Pergunta = new entity.Pergunta(data.id, data.subject, data.content, data.dtregisted, data.username);
              pergunta.respostas = rs;

              res.status(200).send(pergunta);
            }
            else
            {
              res.status(204).send(result);
            }
          });
        }
      });
    });

    app.all(["/api/perguntas/new"], auth, (req: express.Request, res: express.Response): void => {
      let user: appweb.User = new appweb.User(req.user);

      const subject: string = req.body.subject;
      const content: string = req.body.content;
      const username: string = user.username;

      db.pushSQL("INSERT OR IGNORE INTO tb_pergunta (subject, content, user_id) VALUES (?, ?, (SELECT id FROM tb_user WHERE username = ?)); ",
                 [subject, content, username], (ok: boolean) => {
                   loadPerguntas(req, res, user);
                 });
    });

    const loadPerguntas: any = (req: express.Request, res: express.Response, user: appweb.User): void => {
      db.pullSQL("SELECT id, subject, content, dtregisted, (SELECT name_user FROM tb_user u WHERE u.id = user_id) as username FROM tb_pergunta; ", (result: any) => {
        if (result)
        {
          const rs: entity.Pergunta[] = [];

          for (let r of result)
          {
            rs.push(new entity.Pergunta(r.id, r.subject, r.content, r.dtregisted, r.username));
          }

          res.status(200).send(rs);
        }
        else
        {
          res.status(204).send(result);
        }
      });
    };

    app.all(["/api/perguntas/load"], auth, (req: express.Request, res: express.Response): void => {
      let user: appweb.User = new appweb.User(req.user);
      loadPerguntas(req, res, user);
    });
  }
}
