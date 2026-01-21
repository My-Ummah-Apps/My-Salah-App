import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { DBConnectionStateType, LocationsDataObjTypeArr } from "../types/types";

// let dbLock: Promise<void> = Promise.resolve();

// export function toggleDBConnection(
//   dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
//   action: DBConnectionStateType
// ) {
//   dbLock = dbLock.then(() => queuedToggleDBConnection(dbConnection, action));

//   return dbLock;
// }

// export async function queuedToggleDBConnection(
export async function toggleDBConnection(
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  action: DBConnectionStateType,
) {
  // console.log("toggleDBConnection is being run...");

  try {
    if (!dbConnection || !dbConnection.current) {
      throw new Error(
        `Database connection not initialised within toggleDBConnection, dbConnection is ${dbConnection} and dbConnection.current is ${dbConnection.current}`,
      );
    }

    const isDatabaseOpen = await dbConnection.current.isDBOpen();
    // console.log("isDatabaseOpen: ", isDatabaseOpen);

    if (
      (action === "open" && isDatabaseOpen.result === true) ||
      (action === "close" && isDatabaseOpen.result === false)
    ) {
      return;
    }

    if (isDatabaseOpen.result === undefined) {
      console.log(
        "isDatabaseOpen.result === undefined therefore throwing error",
      );

      throw new Error(
        "isDatabaseOpen.result is undefined within toggleDBConnection",
      );
    } else if (action === "open" && isDatabaseOpen.result === false) {
      await dbConnection.current.open();
      console.log("DB CONNECTION OPENED");
    } else if (action === "close" && isDatabaseOpen.result === true) {
      await dbConnection.current.close();
      console.log("DB CONNECTION CLOSED");
    } else {
      throw new Error(
        `Database is: ${isDatabaseOpen.result}, unable to ${action} database connection`,
      );
    }
  } catch (error) {
    throw new Error(`toggleDBConnection(${action}) failed: ${error}`);
  }
}

export const fetchAllLocations = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
): Promise<{
  allLocations: LocationsDataObjTypeArr;
}> => {
  console.log(
    "RUNNING FETCH ALL LOCATIONS, DB CONNECTION IS:",
    dbConnection.current,
  );

  try {
    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    const res = await dbConnection.current.query(
      "SELECT * from userLocationsTable",
    );

    if (!res || !res.values) {
      throw new Error("Failed to obtain data from userLocationsTable");
    }

    const allLocations: LocationsDataObjTypeArr = res.values;

    console.log("allLocations: ", allLocations);

    return { allLocations };
  } catch (error) {
    console.error("fetchAllLocations failed", error);
    return { allLocations: [] };
  }
};

// export const modifyUserLocation = async (dbConnection, id, name, lat, long, isSelected) => {

//      try {

//   await toggleDBConnection(dbConnection, "open");

// //update statement goes here

// const stmnt = `UPDATE userlocationsTable WHERE id = ?`

// const params = [locationName, latitude, longitude, isSelected]

// await dbConnection.current.run(stmnt, params);

// const res = await db.current.query(stmnt)
// setUserLocations(res.values)

//     } catch(error) {

//       console.error(error)
// } finally {

// toggleDBConnection(dbConnection, "close");

// }

// }
