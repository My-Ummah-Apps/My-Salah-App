import { useEffect, useRef, useState } from "react";
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>();
  const sqlite = useRef<SQLiteConnection>();
  const [initialised, setInitialised] = useState<boolean>(false);

  console.log(db.current);

  useEffect(() => {
    const initialiseDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      const ret = await sqlite.current.checkConnectionsConsistency();
      const isConn = (
        await sqlite.current.isConnection("db_salah-tracking", false)
      ).result;

      if (ret.result && isConn) {
        db.current = await sqlite.current.retrieveConnection(
          "db_salah-tracking",
          false
        );
      } else {
        db.current = await sqlite.current.createConnection(
          "db_salah-tracking",
          false,
          "no-encryption",
          1,
          false
        );
      }
    };
  }, []);

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      await db.current?.open();
      await action(db.current);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
        cleanup && (await cleanup());
      } catch {}
    }
  };
  /**
   * here is where you cna check and update table
   * structure
   */
  const initialiseTables = async () => {
    performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      const queryCreateTable = `
        CREATE TABLE IF NOT EXISTS salahtracking(id INTEGER PRIMARY KEY NOT NULL,        date TEXT NOT NULL,                                                           salah-name TEXT NOT NULL,                                                           status TEXT NOT NULL,                                                            reasons TEXT,                                                                      notes TEXT);
        `;
      const respCT = await db?.execute(queryCreateTable);
      console.log(`res: ${JSON.stringify(respCT)}`);
    });
  };

  return { performSQLAction, initialised };
};

export default useSQLiteDB;
