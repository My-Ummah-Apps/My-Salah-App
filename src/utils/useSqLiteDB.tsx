import { useEffect, useRef, useState } from "react";
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  console.log("useSQLiteDB HAS RUN");
  const dbConnection = useRef<SQLiteDBConnection>(); // Database connection, will deal with READ/INSERT etc
  const sqliteConnection = useRef<SQLiteConnection>(); // This is the connection to the dbConnection itself
  const [isDatabaseInitialised, setisDatabaseInitialised] =
    useState<boolean>(false);

  //   console.log(dbConnection.current);

  useEffect(() => {
    const initialiseDB = async () => {
      try {
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
        ).result; // The isConnection method checks if there is an existing connection, this is a asynchronous operation so it awaits the result which will either be true or false

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
              "salahtrackingtable",
              false,
              "no-encryption",
              1,
              false
            );
        }

        await initialiseTables();
        setisDatabaseInitialised(true);
        console.log("Database initialization complete");
      } catch (error) {
        console.error("Error initializing database:", error);
        throw new Error("Database initialization failed");
      }
    };

    // Async function that sets up the sqliteConnection & dbConnection , .then is called after the initialiseDB() promise is resolved so the code inside .then will execute once initialiseDB has completed it's execution
    // initialiseDB().then(() => {
    //   initialiseTables(); // Set up tables in the database (if they don't already exist)
    //   setisDatabaseInitialised(true); // Update state to indicate that the database initialization process is complete
    //   console.log(
    //     "initialiseTables() HAS RUN, SETTING ISDATABASEINITIALISED TO TRUE"
    //   );
    // });
    initialiseDB();

    // Cleanup function to close the database connection when the component unmounts
    return () => {
      const cleanupDB = async () => {
        if (dbConnection.current) {
          const isOpen = await dbConnection.current.isDBOpen();
          if (isOpen?.result) {
            await dbConnection.current.close();
          }
        }
      };
      cleanupDB();
      console.log("CLEANUP WITHIN initialiseDB()");
    };
  }, []);

  //   This async function will handle CRUD operations on the database, it will take an action function passed which will determine what type of CRUD functionality it will execute
  const performSQLAction = async (
    action: (dbConnection: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    console.log("PERFORMSQLACTION FUNCTION HAS RUN!");
    try {
      console.log("ATTEMPTING TO OPEN CONNECTION...");
      await dbConnection.current?.open(); // Attempt to open the database connection if it exists for database (in this case, CRUD) operations
      await action(dbConnection.current); // Execute the passed in action function (add, edit etc) with dbConnection.current as its argument
    } catch (error) {
      //   alert((error as Error).message);
      console.log(
        "ERROR IN CATCH: CONNECTION NOT ESTABLISHED, ERROR AS FOLLOWS:"
      );
      console.log(error);
      //   console.log((error as Error).message);
    } finally {
      try {
        (await dbConnection.current?.isDBOpen())?.result &&
          (await dbConnection.current?.close()); // Check if the database is still open and close it if necessary
        cleanup && (await cleanup()); // Perform cleanup actions if cleanup function is provided
        console.log("CLEANUP WITHIN PERFORMSQLACTION");
      } catch (error) {
        console.log("ERROR");
        console.log(error);
      }
    }
  };
  // here is where you can check and update table structure
  const initialiseTables = async () => {
    console.log("INITIALISING TABLES...");
    await performSQLAction(
      async (dbConnection: SQLiteDBConnection | undefined) => {
        // SQL query to create the 'salahtracking' table if it doesn't already exist
        const queryCreateSalahTrackingTable = `
        CREATE TABLE IF NOT EXISTS salahtrackingtable(id INTEGER PRIMARY KEY NOT NULL, date TEXT NOT NULL, salahName TEXT NOT NULL, salahStatus TEXT NOT NULL, reasons TEXT, notes TEXT);
        `;
        const respCT = await dbConnection?.execute(
          queryCreateSalahTrackingTable
        ); // Execute the SQL query to create the table in the database

        // console.log(`res: ${JSON.stringify(respCT)}`);
        //   console.log("queryCreateSalahTrackingTable: ");
        console.log("res: ");
        console.log(respCT);

        // Insert dummy data
        //     const queryInsertDummyData = `
        //     INSERT INTO salahtrackingtable (date, salahName, salahStatus, reasons, notes)
        //     VALUES ('24.06.24', 'Fajr', 'male-alone', 'No reasons', 'No notes');
        //   `;
        // const respInsert = await dbConnection?.execute(queryInsertDummyData);
        // console.log("Dummy Data Insert Response: ", respInsert); // Log the response of dummy data insertion
      }
    );
  };

  return { performSQLAction, isDatabaseInitialised }; // This exposes both performSQLAction and databaseInitialised so when importing this hook in another component both of these can be accessed by said component
};

export default useSQLiteDB;
