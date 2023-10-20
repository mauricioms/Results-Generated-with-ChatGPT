export module entity
{

  export class User
  {
    constructor(public name: string) {}
  }

  export class Pergunta
  {
    constructor(
        public id: number,
        public subject: string,
        public content: string,
        public dtregisted: string,
        username: string)
    {
      this.user = new User(username);
    }

    user: User;
    respostas: Resposta[] = []
  }

  export class Resposta
  {
    constructor(
        public id: number,
        public idPergunta: number,
        public content: string,
        public dtregisted: string,
        username: string)
    {
      this.user = new User(username);
    }

    user: User;
  }
}
