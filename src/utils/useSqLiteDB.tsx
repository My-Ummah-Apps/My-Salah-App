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
  }, []);

  async function checkAndOpenOrCloseDBConnection(
    action: DBConnectionStateType
  ) {
    try {
      if (!dbConnection || !dbConnection.current) {
        throw new Error(
          `Database connection not initialised within checkAndOpenOrCloseDBConnection, dbConnection is ${dbConnection} and dbConnection.current is ${dbConnection.current}`
        );
      }

      const isDatabaseOpen = await dbConnection.current.isDBOpen();

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
        // console.log("DB CONNECTION OPENED");
      } else if (action === "close" && isDatabaseOpen.result === true) {
        await dbConnection.current.close();
        // console.log("DB CONNECTION CLOSED");
      } else {
        throw new Error(
          `Database is: ${isDatabaseOpen.result}, unable to ${action} database connection`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Check and update table structure here
  const initialiseTables = async () => {
    try {
      if (!dbConnection.current) {
        throw new Error(
          `Table not created/initialised within initialiseTables, dbConnection.current is ${dbConnection.current}`
        );
      }

      await checkAndOpenOrCloseDBConnection("open");

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

      const uniqueIndexQuery = `CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_date_salahName ON salahDataTable (date, salahName)`;

      const userPreferencesTable = `CREATE TABLE IF NOT EXISTS userPreferencesTable(
        preferenceName TEXT PRIMARY KEY NOT NULL, 
        preferenceValue TEXT NOT NULL DEFAULT ''
        ) STRICT`;

      await dbConnection.current.execute(userPreferencesTable);
      await dbConnection.current.execute(salahDataTable);
      await dbConnection.current.execute(uniqueIndexQuery);
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
        }
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
  };
};

export default useSQLiteDB;
