import { useEffect, useRef, useState } from "react";
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>(); // Database connection, will deal with READ/INSERT etc
  const sqlite = useRef<SQLiteConnection>(); // This is the connection to the db itself
  const [databaseInitialised, setDatabaseInitialised] =
    useState<boolean>(false);

  //   console.log(db.current);

  useEffect(() => {
    const initialiseDB = async () => {
      if (sqlite.current) return; // If sqlite.current is not undefined or null it means the db connection has already been initalised so no need to re-initialise by running the code below, hence it will return out of the function
      console.log("INITIALISING DATABASE");

      sqlite.current = new SQLiteConnection(CapacitorSQLite); // Create a new SQLiteConnection instance and assign it to sqlite.current.
      const ret = await sqlite.current.checkConnectionsConsistency(); // Check the consistency of the connections and store the result in ret.

      const isConn = (
        await sqlite.current.isConnection("db_salah-tracking", false)
      ).result; // The isConnection method checks if there is an existing connection named "db_salah-tracking", this is a asynchronous operation so it awaits the result, the result is either true or false

      // Is the connection consistent and does the db connection already exist?
      if (ret.result && isConn) {
        // Retrieve the existing connection to "db_salah-tracking".
        db.current = await sqlite.current.retrieveConnection(
          "db_salah-tracking",
          false
        );
      } else {
        // If the db connection does not exist then create a new connection (additionally, if the "db_salah-tracking" database does not exist, create it at the same time as establishing the new connection)
        console.log("CREATING / CONNECTING TO DATABASE");
        db.current = await sqlite.current.createConnection(
          "db_salah-tracking",
          false,
          "no-encryption",
          1,
          false
        );
      }
    };

    // Async function that sets up the SQLite db connection, .then is called after the initialiseDB() promise is resolved so the code inside .then will execute once initialiseDB has completed it's execution
    initialiseDB().then(() => {
      initialiseTables(); // Set up tables in the database (if they don't already exist)
      setDatabaseInitialised(true); // Update state to indicate that the database initialization process is complete
    });
  }, []);

  //   This async function will handle CRUD operations on the database, it will take an action function passed which will determine what type of CRUD functionality it will execute
  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      await db.current?.open(); // Attempt to open the database connection if it exists for database (in this case, CRUD) operations
      await action(db.current); // Execute the passed in action function (add, edit etc) with db.current as its argument
    } catch (error) {
      alert((error as Error).message);
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close()); // Check if the database is still open and close it if necessary
        cleanup && (await cleanup()); // Perform cleanup actions if cleanup function is provided
      } catch {}
    }
  };
  // here is where you can check and update table structure
  const initialiseTables = async () => {
    performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      // SQL query to create the 'salahtracking' table if it doesn't already exist
      const queryCreateSalahTrackingTable = `
      CREATE TABLE IF NOT EXISTS \`salah-tracking\` (
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        salah_name TEXT NOT NULL,
        status TEXT NOT NULL,
        reasons TEXT,
        notes TEXT
      );
        `;
      const respCT = await db?.execute(queryCreateSalahTrackingTable); // Execute the SQL query to create the table in the database
      console.log("initialiseTables has RUN");
      console.log(`res: ${JSON.stringify(respCT)}`);
    });
  };

  return { performSQLAction, databaseInitialised }; // This exposes both performSQLAction and databaseInitialised so when importing this hook in another component both of these can be accessed by said component
};

export default useSQLiteDB;
