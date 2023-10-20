import {appweb} from "./app-web";
import {database} from "./database";
import {endpoint} from "./end-point";

module system
{

  export const main = () => {
    const {APPWEB_PORT = 8080} = process.env;

    const db: database.DB = new database.sqlite3.SQLite('./base.db');

    db.connect();

    const server: appweb.Server = appweb.config(db, APPWEB_PORT);
    endpoint.loadEndPoint(server.app, db, server.auth);

    server.listening(APPWEB_PORT);
  };
}

system.main();
