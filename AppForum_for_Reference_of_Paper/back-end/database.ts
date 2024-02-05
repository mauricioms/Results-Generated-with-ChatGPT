import sqlite3 from 'sqlite3'

export module database {
  export interface DB {
    connect(): void
    disconnect(): void
    pullSQL(sql: string, callback: (_r: unknown[]) => void, callerror?: (err: Error) => void): void
    pushSQL(sql: string, values: unknown[], callback: unknown, callerror?: (err: Error) => void): void
  }

  export namespace SQLite {
    export class SQLite implements DB {
      constructor(private filepathDB: string = '') {}

      public connect(): void {}

      public disconnect(): void {}

      public pullSQL(sql: string, callback: (_r: unknown[]) => void, callerror: (err: Error) => void): void {
        if (this.filepathDB != null) {
          const db: sqlite3.Database = new sqlite3.Database(this.filepathDB)

          db.serialize((): void => {
            db.all(sql, (err: Error, rows: unknown[]) => {
              if (err) {
                callerror(err)
              } else if (callback) {
                callback(rows)
              }
            })
          })

          db.close()
        }
      }

      public pushSQL(
        sql: string,
        values: unknown[] = [],
        callback: (_r: boolean) => void,
        callerror: (err: Error) => void
      ): void {
        if (this.filepathDB != null) {
          const db: sqlite3.Database = new sqlite3.Database(this.filepathDB)

          db.serialize(() => {
            const stmt: sqlite3.Statement = db.prepare(sql)

            stmt.run(values, (err: Error) => {
              if (callerror) {
                callerror(err)
              }
            })

            stmt.finalize()

            callback(true)
          })

          db.close()
        }
      }
    }
  }
}
