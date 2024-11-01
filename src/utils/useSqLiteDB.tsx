import { useEffect, useRef, useState } from "react";
import { DBConnectionStateType } from "../types/types";
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  const sqliteConnection = useRef<SQLiteConnection>(); // This is the connection to the dbConnection
  const dbConnection = useRef<SQLiteDBConnection>(); // This is the connection to the database itself, will deal with READ/INSERT etc
  const [isDatabaseInitialised, setisDatabaseInitialised] =
    useState<boolean>(false);

  useEffect(() => {
    const initialiseDB = async () => {
      try {
        // if (sqliteConnection && dbConnection) return;
        if (sqliteConnection.current) return; // If sqliteConnection.current is not undefined or null it means the dbConnection has already been initalised so return out of the function

        sqliteConnection.current = new SQLiteConnection(CapacitorSQLite); // Create a new SQLiteConnection instance and assign it to sqliteConnection.current.
        const connectionConsistency =
          await sqliteConnection.current.checkConnectionsConsistency();

        const isConn = (
          await sqliteConnection.current.isConnection(
            "mysalahappdatabase",
            false
          )
        ).result; // The isConnection method checks if there is an existing connection

        if (connectionConsistency.result && isConn) {
          // Retrieve the existing connection to "mysalahappdatabase"
          dbConnection.current =
            await sqliteConnection.current.retrieveConnection(
              "mysalahappdatabase",
              false
            );
        } else {
          // If the dbConnection does not exist then create a new connection (additionally, if the "mysalahappdatabase" database does not exist, create it at the same time as establishing the new connection)

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
      } catch (error) {
        console.error("Error initializing database: " + error);
      }
    };

    initialiseDB();

    // initialiseDB().then(() => {
    //   initialiseTables();
    //   setisDatabaseInitialised(true);
    // });

    // Cleanup function to close the database connection when the component unmounts
    // ? Unsure if the below cleanup function is needed
    // const cleanUp = async () => {

    //   await checkAndOpenOrCloseDBConnection("close");
    // };
    // return () => {
    //   cleanUp();
    // };
  }, []);

  async function checkAndOpenOrCloseDBConnection(
    action: DBConnectionStateType
  ) {
    try {
      if (!dbConnection.current) {
        throw new Error(
          `Database connection not initialised within checkAndOpenOrCloseDBConnection, dbConnection.current is ${dbConnection.current}`
        );
      }

      const isDatabaseOpen = await dbConnection.current.isDBOpen();

      // TODO: The below eliminates errors for now which occurs if the app is trying to open the database but its already open and close it when its already closed, further investigation is needed however to see why attempts are being made to open/close the database when its already opened/closed
      if (
        (action === "open" && isDatabaseOpen.result === true) ||
        (action === "close" && isDatabaseOpen.result === false)
      ) {
        return;
      }

      if (isDatabaseOpen.result === undefined) {
        throw new Error(
          "isDatabaseOpen.result is undefined within checkAndOpenOrCloseDBConnection"
        );
      } else if (action === "open" && isDatabaseOpen.result === false) {
        await dbConnection.current.open();
      } else if (action === "close" && isDatabaseOpen.result === true) {
        await dbConnection.current.close();
      } else {
        throw new Error(
          `Database is: ${isDatabaseOpen.result}, unable to ${action} database connection`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // This is where you can check and update table structure
  const initialiseTables = async () => {
    try {
      if (!dbConnection.current) {
        throw new Error(
          `Table not created/initialised within initialiseTables, dbConnection.current is ${dbConnection.current}`
        );
      }

      await checkAndOpenOrCloseDBConnection("open");

      // SQL query to create the 'salahDataTable' table if it doesn't already exist
      const salahDataTable = `
        CREATE TABLE IF NOT EXISTS salahDataTable(
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL, 
        salahName TEXT NOT NULL, 
        salahStatus TEXT NOT NULL, 
        reasons TEXT DEFAULT '', 
        notes TEXT DEFAULT ''
        ) STRICT;
        `;
      const userPreferencesTable = `CREATE TABLE IF NOT EXISTS userPreferencesTable(
        preferenceName TEXT PRIMARY KEY NOT NULL, 
        preferenceValue TEXT NOT NULL DEFAULT ''
        ) STRICT`;

      await dbConnection.current.execute(userPreferencesTable);
      await dbConnection.current.execute(salahDataTable); // Execute the SQL query to create the table in the database
    } catch (error) {
      console.error(error);
    } finally {
      try {
        if (!dbConnection.current) {
          throw new Error(
            `Unable to close cnnection within initialiseTables, dbConnection.current is ${dbConnection.current}`
          );
        }

        const isDatabaseOpen = await dbConnection.current.isDBOpen();
        if (isDatabaseOpen.result) {
          await checkAndOpenOrCloseDBConnection("close");
          // await dbConnection.current.execute(`VACUUM`);
        }

        // cleanup && (await cleanup()); // Perform cleanup actions if cleanup function is provided
      } catch (error) {
        console.error(error);
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
