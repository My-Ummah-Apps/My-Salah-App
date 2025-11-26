import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { DBConnectionStateType } from "../types/types";

export async function toggleDBConnection(
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  action: DBConnectionStateType
) {
  try {
    if (!dbConnection || !dbConnection.current) {
      throw new Error(
        `Database connection not initialised within toggleDBConnection, dbConnection is ${dbConnection} and dbConnection.current is ${dbConnection.current}`
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
        "isDatabaseOpen.result is undefined within toggleDBConnection"
      );
    } else if (action === "open" && isDatabaseOpen.result === false) {
      await dbConnection.current.open();
      console.log("DB CONNECTION OPENED");
    } else if (action === "close" && isDatabaseOpen.result === true) {
      await dbConnection.current.close();
      console.log("DB CONNECTION CLOSED");
    } else {
      throw new Error(
        `Database is: ${isDatabaseOpen.result}, unable to ${action} database connection`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export const addUserLocation = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  locationName: string,
  latitude: number,
  longitude: number
) => {
  console.log("addUserLocation function called");

  try {
    await toggleDBConnection(dbConnection, "open");

    const stmnt = `INSERT INTO userLocationsTable (locationName, latitude, longitude, isSelected) 
        VALUES (?, ?, ?, ?);
        `;

    const params = [locationName, latitude, longitude, 0];
    await dbConnection.current?.run(stmnt, params);
  } catch (error) {
    console.error(error);
  } finally {
    toggleDBConnection(dbConnection, "close");
  }
};
