import React from "react";
// import ReactDOM from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import "./index.css";
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { createRoot } from "react-dom/client";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const platform = Capacitor.getPlatform();

    // WEB SPECIFIC FUNCTIONALITY
    if (platform === "web") {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      // Create the 'jeep-sqlite' Stencil component
      customElements.define("jeep-sqlite", JeepSqlite);
      const jeepSqliteEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined("jeep-sqlite");

      // Initialize the Web store
      await sqlite.initWebStore();
    }

    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
      // <React.StrictMode>
      <App />
      // {/* </React.StrictMode> */}
    );
  } catch (e) {
    console.error(e);
  }
});

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
