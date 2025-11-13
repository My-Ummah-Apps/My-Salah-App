import { useEffect, useRef, useState } from "react";

import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";
import { checkAndOpenOrCloseDBConnection } from "./dbUtils";

const useSQLiteDB = () => {
  const sqliteConnection = useRef<SQLiteConnection>(); // This is the connection to the dbConnection
  const dbConnection = useRef<SQLiteDBConnection>(); // This is the connection to the database itself, will deal with READ/INSERT etc
  const [isDatabaseInitialised, setisDatabaseInitialised] =
    useState<boolean>(false);

  useEffect(() => {
    const initialiseDB = async () => {
      const upgradeStatements = [
        {
          toVersion: 2,
          statements: [
            `CREATE TABLE IF NOT EXISTS user_locations_table(
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          is_selected INTEGER DEFAULT 0
        )`,

            `CREATE UNIQUE INDEX IF NOT EXISTS idx_single_selected_location ON user_locations_table (is_selected) WHERE is_selected = 1`,
          ],
        },
      ];

      try {
        if (sqliteConnection.current) return; // If sqliteConnection.current is not undefined or null it means the dbConnection has already been initalised so return out of the function

        sqliteConnection.current = new SQLiteConnection(CapacitorSQLite); // Create a new SQLiteConnection instance and assign it to sqliteConnection.current.

        await sqliteConnection.current.addUpgradeStatement(
          "mysalahappdatabase",
          upgradeStatements
        );

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
              2,
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

  // Check and update table structure here
  const initialiseTables = async () => {
    try {
      if (!dbConnection.current) {
        throw new Error(
          `Table not created/initialised within initialiseTables, dbConnection.current is ${dbConnection.current}`
        );
      }

      await checkAndOpenOrCloseDBConnection(dbConnection, "open");

      const createTablesSql: string[] = [
        `CREATE TABLE IF NOT EXISTS salahDataTable(
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL, 
        salahName TEXT NOT NULL, 
        salahStatus TEXT NOT NULL, 
        reasons TEXT DEFAULT '', 
        notes TEXT DEFAULT ''
        ) STRICT;
        `,

        `CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_date_salahName ON salahDataTable (date, salahName)`,

        `CREATE TABLE IF NOT EXISTS userPreferencesTable(
        preferenceName TEXT PRIMARY KEY NOT NULL,
        preferenceValue TEXT NOT NULL DEFAULT ''
        ) STRICT`,

        `CREATE TABLE IF NOT EXISTS user_locations_table(
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          is_selected INTEGER DEFAULT 0
        )`,

        `CREATE UNIQUE INDEX IF NOT EXISTS idx_single_selected_location ON user_locations_table (is_selected) WHERE is_selected = 1`,
      ];

      for (const sql of createTablesSql) {
        await dbConnection.current.execute(sql);
      }
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
          await checkAndOpenOrCloseDBConnection(dbConnection, "close");
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
    initialiseTables,
  };
};

export default useSQLiteDB;
