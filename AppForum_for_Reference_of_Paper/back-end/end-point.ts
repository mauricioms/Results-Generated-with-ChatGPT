import express from "express";
import { appweb } from "./app-web";
import { database } from "./database";
import { entity } from "./entity";
export module endpoint {
  export const loadEndPoint = (
    app: express.Express,
    db: database.DB,
    auth: any = null,
  ): void => {
    app.all(
      ["/api/pergunta/:id/deletar"],
      auth,
      (req: express.Request, res: express.Response): void => {
        const user: string = new appweb.User(req.user).username;
        const idPergunta: number = Number(req.params.id);
        entity.Pergunta.delete(db, res, idPergunta);
      },
    );
    app.all(
      ["/api/resposta/:id/remover"],
      auth,
      (req: express.Request, res: express.Response): void => {
        const user: string = new appweb.User(req.user).username;
        const idResposta: number = Number(req.params.id);
        entity.Resposta.delete(db, res, idResposta);
      },
    );
    app.all(
      ["/api/user/save"],
      (req: express.Request, res: express.Response): void => {
        let user: appweb.User = new appweb.User(req.user);
        const newUser: entity.User = req.body;
        entity.User.save(db, res, newUser);
      },
    );
    app.all(
      ["/api/resposta/:id/save"],
      auth,
      (req: express.Request, res: express.Response): void => {
        let user: appweb.User = new appweb.User(req.user);
        const idPergunta: number = Number(req.body.idPergunta);
        const content: string = req.body.content;
        const username: string = user.username;
        entity.Resposta.save(db, res, idPergunta, content, username);
      },
    );
    app.all(
      ["/api/pergunta/:id"],
      auth,
      (req: express.Request, res: express.Response): void => {
        const user: string = new appweb.User(req.user).username;
        const idPergunta: number = Number(req.params.id);
        entity.Pergunta.load(db, res, idPergunta);
      },
    );
    app.all(
      ["/api/perguntas/new"],
      auth,
      async (req: express.Request, res: express.Response): Promise<void> => {
        let user: appweb.User = new appweb.User(req.user);
        const subject: string = req.body.subject;
        const content: string = req.body.content;
        const username: string = user.username;
        const ok: boolean = await entity.Pergunta.create(
          db,
          res,
          subject,
          content,
          username,
        );
        if (ok) {
          loadPerguntas(req, res, user);
        }
      },
    );
    const loadPerguntas: any = (
      req: express.Request,
      res: express.Response,
      user: appweb.User,
    ): void => {
      entity.Pergunta.all(db, res);
    };
    app.all(
      ["/api/perguntas/load"],
      auth,
      (req: express.Request, res: express.Response): void => {
        let user: appweb.User = new appweb.User(req.user);
        loadPerguntas(req, res, user);
      },
    );
  };
}
