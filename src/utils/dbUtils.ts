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

export const fetchAllLocations = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>
) => {
  try {
    await toggleDBConnection(dbConnection, "open");
    const res = await dbConnection.current?.query(
      "SELECT * from userLocationsTable"
    );
    if (!res) {
      throw new Error("Failed to obtain data from userLocationsTable");
    }

    return res.values;
  } catch (error) {
    console.error(error);
  } finally {
    toggleDBConnection(dbConnection, "close");
  }
};

export const addUserLocation = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  locationName: string,
  latitude: number,
  longitude: number,
  isSelected: number
) => {
  console.log("addUserLocation function called");

  try {
    await toggleDBConnection(dbConnection, "open");

    const stmnt = `INSERT INTO userLocationsTable (locationName, latitude, longitude, isSelected) 
        VALUES (?, ?, ?, ?);
        `;

    const params = [locationName, latitude, longitude, isSelected];
    await dbConnection.current?.run(stmnt, params);
  } catch (error) {
    console.error(error);
  } finally {
    await toggleDBConnection(dbConnection, "close");
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

// export const deleteUserLocation = async (dbConnection, id) => {
//   try {
//     await toggleDBConnection(dbConnection, "open");

//     const stmnt = `DELETE FROM userlocationsTable WHERE id =?`;

//     const params = [id];

//     await dbConnection.current.execute(stmnt, params);

//     const res = await db.current.query(stmnt);
//     setUserLocations(res.values);
//     // if this was the active location, make the first location in the new list active
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await toggleDBConnection(dbConnection, "close");
//   }
// };
