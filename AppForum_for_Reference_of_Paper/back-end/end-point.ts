import express from 'express'
import { appweb } from './app-web'
import { database } from './database'
import { entity } from './entity'
export module endpoint {
  export const loadEndPoint = (app: express.Express, db: database.DB, auth: appweb.RequiredAuth): void => {
    app.all(['/api/pergunta/:id/deletar'], auth, (req: express.Request, res: express.Response): void => {
      const idPergunta: number = Number(req.params.id)
      entity.Pergunta.delete(db, res, idPergunta)
    })
    app.all(['/api/resposta/:id/remover'], auth, (req: express.Request, res: express.Response): void => {
      const idResposta: number = Number(req.params.id)
      entity.Resposta.delete(db, res, idResposta)
    })
    app.all(['/api/user/save'], (req: express.Request, res: express.Response): void => {
      const newUser: entity.User = req.body as entity.User
      entity.User.save(db, res, newUser)
    })
    app.all(['/api/resposta/:id/save'], auth, (req: express.Request, res: express.Response): void => {
      const _body: { idPergunta: number; content: string; usernames: string } = req.body as {
        idPergunta: number
        content: string
        usernames: string
      }

      const user: appweb.User = new appweb.User(
        req.user as { username: string; name: string; email: string; roles: string[]; urlPhoto: string }
      )

      const idPergunta: number = Number(_body.idPergunta)
      const content: string = _body.content
      const username: string = user.username

      entity.Resposta.save(db, res, idPergunta, content, username)
    })
    app.all(['/api/pergunta/:id'], auth, (req: express.Request, res: express.Response): void => {
      const idPergunta: number = Number(req.params.id)
      entity.Pergunta.load(db, res, idPergunta)
    })
    app.all(['/api/perguntas/new'], auth, (req: express.Request, res: express.Response): void => {
      const _body: { subject: string; content: string; username: string } = req.body as {
        subject: string
        content: string
        username: string
      }
      const user: appweb.User = new appweb.User(
        req.user as { username: string; name: string; email: string; roles: string[]; urlPhoto: string }
      )

      const subject: string = _body.subject
      const content: string = _body.content
      const username: string = user.username
      entity.Pergunta.create(db, res, subject, content, username)
        .then((ok: boolean): void => {
          if (ok) {
            loadPerguntas(req, res)
          }
        })
        .catch((): void => {})
    })
    function loadPerguntas(req: express.Request, res: express.Response): void {
      entity.Pergunta.all(db, res)
    }
    app.all(['/api/perguntas/load'], auth, (req: express.Request, res: express.Response): void => {
      loadPerguntas(req, res)
    })
  }
}
