import { useEffect, useRef, useState } from "react";
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  console.log("useSQLiteDB HAS RUN");
  const sqliteConnection = useRef<SQLiteConnection>(); // This is the connection to the dbConnection
  const dbConnection = useRef<SQLiteDBConnection>(); // This is the connection to the database itself, will deal with READ/INSERT etc
  const [isDatabaseInitialised, setisDatabaseInitialised] =
    useState<boolean>(false);

  //   console.log(dbConnection.current);

  useEffect(() => {
    const initialiseDB = async () => {
      try {
        // if (sqliteConnection && dbConnection) return;
        if (sqliteConnection.current) return; // If sqliteConnection.current is not undefined or null it means the dbConnection has already been initalised so no need to re-initialise by running the code below, hence it will return out of the function at this point
        console.log("INITIALISING DATABASE");

        sqliteConnection.current = new SQLiteConnection(CapacitorSQLite); // Create a new SQLiteConnection instance and assign it to sqliteConnection.current.
        const connectionConsistency =
          await sqliteConnection.current.checkConnectionsConsistency(); // Check the consistency of the connections and store the result in connectionConsistency.

        const isConn = (
          await sqliteConnection.current.isConnection(
            "salahtrackingtable",
            false
          )
        ).result; // The isConnection method checks if there is an existing connection, will return a boolean and possibly undefined also

        // Is the connection consistent and does the dbConnection connection already exist?
        if (connectionConsistency.result && isConn) {
          // Retrieve the existing connection to "salahtrackingtable".
          dbConnection.current =
            await sqliteConnection.current.retrieveConnection(
              "salahtrackingtable",
              false
            );

          console.log("connectionConsistency.result && isConn both true");
        } else {
          // If the dbConnection does not exist then create a new connection (additionally, if the "salahtrackingtable" database does not exist, create it at the same time as establishing the new connection)
          console.log(
            "connectionConsistency.result && isConn not true therefore CREATING / CONNECTING TO DATABASE"
          );
          dbConnection.current =
            await sqliteConnection.current.createConnection(
              "mysalahappdatabase",
              false,
              "no-encryption",
              1,
              false
            );
        }

        await initialiseTables();
        setisDatabaseInitialised(true);
        console.log("Database initialisation complete");
      } catch (error) {
        console.error("Error initializing database: " + error);
        // throw new Error("Database initialization failed");
      }
    };

    initialiseDB();

    // initialiseDB().then(() => {
    //   initialiseTables();
    //   setisDatabaseInitialised(true);
    // });

    // Cleanup function to close the database connection when the component unmounts
    return () => {
      const cleanupDB = async () => {
        console.log("cleanup within initialiseDB has run");
        await checkAndOpenOrCloseDBConnection("close");
      };
      cleanupDB();
      console.log("CLEANUP WITHIN initialiseDB()");
    };
  }, []);

  async function checkAndOpenOrCloseDBConnection(action: string) {
    console.log("checkAndOpenOrCloseDBConnection has run");
    // console.log("dbConnection.current: " + dbConnection.current);
    try {
      if (!dbConnection.current) {
        throw new Error(
          "Database connection not initialised within checkAndOpenOrCloseDBConnection, dbConnection.current is falsy"
        );
      }
      const isDatabaseOpen = await dbConnection.current.isDBOpen();

      if (action === "open" && isDatabaseOpen.result === false) {
        await dbConnection.current?.open();
        console.log(
          "Database connection within checkAndOpenOrCloseDBConnection function opened successfully"
        );
      } else if (action === "close" && isDatabaseOpen.result === true) {
        await dbConnection.current?.close();
        console.log(
          "Database connection closed within checkAndOpenOrCloseDBConnection function"
        );
      } else if (isDatabaseOpen.result === undefined) {
        throw new Error(
          "isDatabaseOpen.result is undefined within checkAndOpenOrCloseDBConnection"
        );
      } else {
        throw new Error("Unable to open or close database connection");
      }
    } catch (error) {
      console.log(error);
      // throw new Error(
      //   "Database connection not initialised within checkAndOpenOrCloseDBConnection"
      // );
    }
  }

  // here is where you can check and update table structure
  const initialiseTables = async () => {
    console.log("INITIALISING TABLES...");
    try {
      console.log("ATTEMPTING TO OPEN CONNECTION...");

      // await dbConnection.current?.open(); // Attempt to open the database connection if it exists for database (in this case, CRUD) operations
      await checkAndOpenOrCloseDBConnection("open");

      // SQL query to create the 'salahtracking' table if it doesn't already exist
      const salahtrackingtable = `
        CREATE TABLE IF NOT EXISTS salahtrackingtable(
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL, 
        salahName TEXT NOT NULL, 
        salahStatus TEXT NOT NULL, 
        reasons TEXT DEFAULT '', 
        notes TEXT DEFAULT ''
        );
        `;
      const userpreferencestable = `CREATE TABLE IF NOT EXISTS userpreferencestable(
        preferenceName TEXT PRIMARY KEY NOT NULL, 
        preferenceValue TEXT NOT NULL DEFAULT ''
       
        )`;
      // const userpreferencestable = `CREATE TABLE IF NOT EXISTS userpreferencestable(
      //   preferenceName TEXT PRIMARY KEY NOT NULL,
      //   userGender TEXT NOT NULL DEFAULT '',
      //   notifications INTEGER NOT NULL DEFAULT 0,
      //   haptics INTEGER NOT NULL DEFAULT 0,
      //   reasonsArray TEXT NOT NULL DEFAULT '',
      //   showReasons INTEGER NOT NULL DEFAULT 0
      //   )`;
      await dbConnection.current?.execute(userpreferencestable);
      await dbConnection.current?.execute(salahtrackingtable); // Execute the SQL query to create the table in the database
    } catch (error) {
      console.log(
        "ERROR IN CATCH: CONNECTION NOT ESTABLISHED, ERROR AS FOLLOWS: " + error
      );
    } finally {
      try {
        (await dbConnection.current?.isDBOpen())?.result &&
          (await dbConnection.current?.close()); // Check if the database is still open and close it if necessary
        // cleanup && (await cleanup()); // Perform cleanup actions if cleanup function is provided
        console.log("CLEANUP WITHIN PERFORMSQLACTION");
      } catch (error) {
        console.log("ERROR WITHIN FINALLY CATCH IN initialiseTables: " + error);
      }
    }
  };

  return {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  }; // This exposes, checkAndOpenOrCloseDBConnection, databaseInitialised etc so when importing this hook in another component all of these can be accessed by said component
};

export default useSQLiteDB;
