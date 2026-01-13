import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  DBConnectionStateType,
  LocationsDataObjType,
  LocationsDataObjTypeArr,
} from "../types/types";

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

export const fetchAllLocations = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>
): Promise<{
  allLocations: LocationsDataObjTypeArr;
  activeLocation: LocationsDataObjType | null;
}> => {
  console.log(
    "RUNNING FETCH ALL LOCATIONS, DB CONNECTION IS:",
    dbConnection.current
  );

  try {
    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    const res = await dbConnection.current.query(
      "SELECT * from userLocationsTable"
    );
    if (!res || !res.values) {
      throw new Error("Failed to obtain data from userLocationsTable");
    }

    const allLocations: LocationsDataObjTypeArr = res.values;
    const activeLocation: LocationsDataObjType = allLocations.filter(
      (loc) => loc.isSelected === 1
    )[0];

    return { allLocations, activeLocation };
  } catch (error) {
    console.error("fetchAllLocations failed", error);
    return { allLocations: [], activeLocation: null };
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
