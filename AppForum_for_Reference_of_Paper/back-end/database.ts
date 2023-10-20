import sqlite3 from 'sqlite3';

export module database
{
  export interface DB {
    connect(): void;
    disconnect(): void;
    pullSQL(sql: string, callback: any, callerror?: any): void;
    pushSQL(sql: string, values: any[], callback: any, callerror?: any): void;
  }

  export namespace sqlite3
  {

  export class SQLite implements DB
  {

    private pool: any;

    constructor(private filepathDB: string = '')
    {
    }

    public connect(): void
    {
    }

    public disconnect(): void
    {
    }

    public pullSQL(sql: string, callback: any, callerror: any): void
    {

      if (this.filepathDB != null)
      {
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database(this.filepathDB);

        db.serialize(async () => {
          db.all(sql, (error: any, rows: any) => {
            if (callback)
            {
              callback(rows);
            }
          });
        });

        db.close();
      }
    }

    public pushSQL(sql: string, values: any[] = [], callback: any, callerror: any): void
    {

      if (this.filepathDB != null)
      {
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database(this.filepathDB);

        db.serialize(() => {
          const stmt = db.prepare(sql);

          stmt.run(values, (err: any) => {
            if (callerror)
            {
              callerror(err);
            }
          });

          stmt.finalize();

          callback(true);
        });

        db.close();
      }
    }
  }
  }
}
