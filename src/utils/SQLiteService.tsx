import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

let db = null;

export const initialiseDatabase = async () => {
  console.log("initialiseDatabase has run");
  try {
    db = await CapacitorSQLite.createConnection({
      database: "msa-db",
      version: 1,
      encrypted: false,
      mode: "full",
    });
    console.log("db: " + db);
    // await db.open();
  } catch (error) {
    console.log("DB ERROR: " + error);
  }
};
