import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
// import Notifications from "./utils/notifications";
import { salahTrackingEntryType } from "./types/types";
import { subDays, format } from "date-fns";

// import { StatusBar, Style } from "@capacitor/status-bar";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
// import { initialiseDatabase } from "./utils/SQLiteService";
import useSQLiteDB from "./utils/useSqLiteDB";
// import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";

// import { Keyboard } from "@capacitor/keyboard";

// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

// const days = ["M", "T", "W", "T", "F", "S", "S"];

import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
// import ResourcesPage from "./pages/ResourcesPage";
import StatsPage from "./pages/StatsPage";
// import QiblahDirection from "./pages/QiblahDirection";
// import { platform } from "os";
import {
  // CapacitorSQLite,
  // SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
// import StreakCount from "./components/Stats/StreakCount";

window.addEventListener("DOMContentLoaded", async () => {
  // try {
  //   if (Capacitor.getPlatform() === "web") {
  //     const sqlite = new SQLiteConnection(CapacitorSQLite);
  //     // Create the 'jeep-sqlite' Stencil component
  //     customElements.define("jeep-sqlite", JeepSqlite);
  //     const jeepSqliteEl = document.createElement("jeep-sqlite");
  //     document.body.appendChild(jeepSqliteEl);
  //     await customElements.whenDefined("jeep-sqlite");
  //     console.log(`after customElements.whenDefined`);

  //     // Initialize the Web store
  //     await sqlite.initWebStore();
  //     console.log(`after initWebStore`);
  //   }
  // } catch (error) {
  //   console.log("ERROR IMPLEMENTING DB ON WEB: " + error);
  // }
  // Web specific functionality for database - this is for easier debugging in the browser

  if (Capacitor.isNativePlatform()) {
    // STATUS BAR FUNCTIONALITY

    // const setStatusBarStyleDark = async () => {
    //   await StatusBar.setStyle({ style: Style.Dark });
    // };

    // const setStatusBarStyleLight = async () => {
    //   await StatusBar.setStyle({ style: Style.Light });
    // };

    // let statusBarThemeColor;
    // if (localStorage.getItem("theme") == null) {
    //   localStorage.setItem("theme", JSON.stringify("light"));
    //   setStatusBarStyleLight();
    //   statusBarThemeColor = "#EDEDED";
    // } else if (JSON.parse(localStorage.getItem("theme")) == "dark") {
    //   setStatusBarStyleDark();
    //   statusBarThemeColor = "#242424";
    //   document.body.classList.add("dark");
    // } else if (JSON.parse(localStorage.getItem("theme")) == "light") {
    //   setStatusBarStyleLight();
    //   statusBarThemeColor = "#EDEDED";
    //   document.body.classList.remove("dark");
    // }

    setTimeout(() => {
      SplashScreen.hide({
        fadeOutDuration: 250,
      });
    }, 500);

    if (Capacitor.getPlatform() === "ios") {
      return;
    } else if (Capacitor.getPlatform() === "android") {
      setTimeout(() => {
        // StatusBar.setStyle({ style: Style.Light });
        // if (statusBarThemeColor == "#EDEDED") {
        //   StatusBar.setStyle({ style: Style.Light });
        // } else if (statusBarThemeColor == "#242424") {
        //   StatusBar.setStyle({ style: Style.Dark });
        // }
        // StatusBar.setBackgroundColor({ color: statusBarThemeColor });
      }, 1000);
    }
  }
});

if (Capacitor.isNativePlatform()) {
}

const App = () => {
  // hook for sqlite db
  const { performSQLAction, databaseInitialised } = useSQLiteDB();

  useEffect(() => {
    loadData();
  }, [databaseInitialised]);

  const loadData = async () => {
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        // @ts-ignore
        const respSelect = await db?.query(`SELECT * FROM db_salah-tracking`);
        // put a usestate here to set the items
      });
    } catch (error) {
      alert((error as Error).message);
      // Put a usestate here such as setItems([]);
    }
  };

  // CHANGELOG FUNCTIONALITY
  const betaAppVersion = "1.0.8";

  useEffect(() => {
    const storedBetaAppVersion = localStorage.getItem("storedBetaAppVersion");
    if (betaAppVersion !== storedBetaAppVersion) {
      localStorage.setItem("storedBetaAppVersion", betaAppVersion);
    }
  }, []);

  const [showIntroModal, setShowIntroModal] = useState(false);
  // const appRef = useRef();
  // console.log(appRef);
  // if (Capacitor.isNativePlatform()) {

  //   window.addEventListener("keyboardWillShow", (e) => {
  //     // const app: any = document.querySelector(".app");
  //     console.log("SHOWING");
  //     console.log("APP IS: ");
  //     console.log(appRef);
  //     console.log((e as any).keyboardHeight);
  //     appRef.current.style.marginBottom = (e as any).keyboardHeight + "px";
  //   });
  //   window.addEventListener("keyboardWillHide", (e) => {
  //     // const app: any = document.querySelector(".app");
  //     console.log("HIDING");
  //     console.log("APP IS: ");
  //     console.log(appRef);
  //     appRef.current.style.marginBottom = "0px";
  //   });
  // }
  // let launchCount: number | null = localStorage.getItem("launch-count");
  // useEffect(() => {
  //   if (launchCount > 14) {
  //     launchCount = 0;
  //   } else if (launchCount == null) {
  //     launchCount = 1;
  //   } else if (launchCount != null) {
  //     let launchCountNumber = Number(launchCount);
  //     launchCount = launchCountNumber + 1;
  //   }
  //   localStorage.setItem("launch-count", JSON.stringify(launchCount));

  //   if (launchCount == 3 || launchCount == 8 || launchCount == 14) {
  //     showReviewPrompt(true);
  //   }
  // });

  // let userGender: string | null = localStorage.getItem("userGender");
  let userGender: any = localStorage.getItem("userGender");

  useEffect(() => {
    if (!userGender) {
      setShowIntroModal(true);
    }
  }, []);

  // const todaysDate = new Date("2024-01-01");
  const todaysDate = new Date();
  let userStartDate: string | null = localStorage.getItem("userStartDate");
  // let userStartDate: string | null = "01.01.24";
  if (!userStartDate) {
    userStartDate = format(todaysDate, "dd.MM.yy");
    localStorage.setItem("userStartDate", format(todaysDate, "dd.MM.yy"));
  }
  // useEffect(() => {
  //   console.log("trrue");
  //   if (!userStartDate) {
  //     userStartDate = format(todaysDate, "dd.MM.yy");
  //     localStorage.setItem("userStartDate", format(todaysDate, "dd.MM.yy"));
  //   }
  // }, []);

  const [streakCounter, setStreakCounter] = useState(0);
  streakCounter;
  const [salahTrackingArray, setSalahTrackingArray] = useState<
    salahTrackingEntryType[]
  >([]);
  const [heading, setHeading] = useState("");

  const [currentWeek, setCurrentWeek] = useState(0);
  const today: Date = new Date();
  const startDate: Date = subDays(today, currentWeek);

  useEffect(() => {
    const storedSalahTrackingData = localStorage.getItem(
      "storedSalahTrackingData"
    );

    storedSalahTrackingData
      ? setSalahTrackingArray(JSON.parse(storedSalahTrackingData))
      : setSalahTrackingArray([
          {
            salahName: "Fajr",
            completedDates: [],
          },
          {
            salahName: "Dhuhr",
            completedDates: [],
          },
          {
            salahName: "Asar",
            completedDates: [],
          },
          {
            salahName: "Maghrib",
            completedDates: [],
          },
          {
            salahName: "Isha",
            completedDates: [],
          },
        ]);
  }, []);

  const salahFulfilledDates = salahTrackingArray.reduce<string[]>(
    (accumulatorArray, salah) => {
      for (let i = 0; i < salah.completedDates.length; i++) {
        Object.values(salah.completedDates[i]);
        if (
          Object.values(salah.completedDates[i])[0].status !== "missed" &&
          Object.values(salah.completedDates[i])[0].status !== "blank"
        ) {
          accumulatorArray.push(Object.keys(salah.completedDates[i])[0]);
        }
      }
      return accumulatorArray;
    },
    []
  );

  // console.log(salahFulfilledDates);

  let datesFrequency: { [date: string]: number } = {};
  salahFulfilledDates.forEach((date) => {
    datesFrequency[date] = (datesFrequency[date] || 0) + 1;
  });

  const datesFrequencyReduced = Object.keys(datesFrequency).filter((date) =>
    datesFrequency[date] === 5 ? true : false
  );

  let streakCount = 0;
  function checkStreak() {
    // const todaysDate = new Date();

    for (let i = 0; i < datesFrequencyReduced.length; i++) {
      let formattedDate = subDays(todaysDate, i);

      if (datesFrequencyReduced.includes(format(formattedDate, "dd.MM.yy"))) {
        streakCount += 1;
      } else {
        break;
      }
    }
    setStreakCounter(streakCount);
  }

  useEffect(() => {
    checkStreak();
  }, [datesFrequencyReduced]);

  const pageStyles: string = `py-[9vh] bg-[color:var(--primary-color)] h-[90vh] overflow-x-hidden overflow-y-auto w-[93vw] mx-auto`;

  return (
    <BrowserRouter>
      <section className="app">
        {/* <dialog
          className="w-4/5 mx-auto text-white bg-gray-800 my-[50%] p-5"
          open
        >
          <>
            <h1 className="text-2xl">Changelog</h1>
            <br></br>
            <p>
              Version 1.0.9:<br></br>
              -FEATURE: Selecting a calender date now shows daily performance
              for that date + notes and reasons (if they were entered)\n\n Beta
              Version 1.0.8 Changelog:\n\n - Added notifications option within
              the settings page, please test it out and let me know if you
              encounter any issues / have any feedback.\n\n As usual, any other
              issues / bugs etc drop me a message.\n\n Jazakallahu Khair
            </p>
          </>
        </dialog> */}
        ;
        <div className="fixed h-[9vh] z-20 flex justify-between w-full p-5 text-center header-wrap">
          {" "}
          {/* <div></div> */}
          <h1 className="text-center w-[100%]">{heading}</h1>
          {/* <p></p> */}
          {/* <StreakCount styles={{ backgroundColor: "grey" }} /> */}
        </div>
        {/* <h1 className="fixed w-full bg-black text-center mt-[6vh]">
          {heading}
        </h1> */}
        <Routes>
          {/* <Route
            path="/ResourcesPage"
            element={
              <ResourcesPage
                // title={<h1 className={h1ClassStyles}>{"Resources"}</h1>}
                setHeading={setHeading}
                pageStyles={pageStyles}
              />
            }
          /> */}
          <Route
            index
            element={
              <HomePage
                // title={<h1 className={h1ClassStyles}>{"Home"}</h1>}
                // title={heading}
                userGender={userGender}
                userStartDate={userStartDate}
                setHeading={setHeading}
                pageStyles={pageStyles}
                startDate={startDate}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                // setCurrentWeek={setCurrentWeek}
                // currentWeek={currentWeek}
              />
            }
          />
          <Route
            path="/SettingsPage"
            element={
              <SettingsPage
                setHeading={setHeading}
                // title={<h1 className={h1ClassStyles}>{"Settings"}</h1>}
                pageStyles={pageStyles}
              />
            }
          />
          <Route
            path="/StatsPage"
            element={
              <StatsPage
                userGender={userGender}
                userStartDate={userStartDate}
                // title={<h1 className={h1ClassStyles}>{"Stats"}</h1>}
                pageStyles={pageStyles}
                setHeading={setHeading}
                setCurrentWeek={setCurrentWeek}
                startDate={startDate}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                currentWeek={currentWeek}
              />
            }
          />
          {/* <Route
            path="/QiblahDirection"
            element={
              <QiblahDirection
                setHeading={setHeading}
                // title={<h1 className={h1ClassStyles}>{"Qibla Direction"}</h1>}
                pageStyles={pageStyles}
              />
            }
          /> */}
        </Routes>
        <Sheet
          isOpen={showIntroModal}
          onClose={() => setShowIntroModal(false)}
          detent="full-height"
          disableDrag={true}
        >
          <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
            <Sheet.Header />
            <Sheet.Content>
              {" "}
              <section className="p-5 text-center">
                <h1 className="text-4xl">Select your gender</h1>
                <p
                  onClick={() => {
                    localStorage.setItem("userGender", "male");
                    setShowIntroModal(false);
                  }}
                  className="p-2 m-4 text-2xl text-white bg-blue-800 rounded-2xl"
                >
                  Male
                </p>
                <p
                  onClick={() => {
                    localStorage.setItem("userGender", "female");
                    setShowIntroModal(false);
                  }}
                  className="p-2 m-4 text-2xl text-white bg-pink-400 rounded-2xl"
                >
                  Female
                </p>
              </section>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
        <NavBar />
      </section>
    </BrowserRouter>
  );
};

export default App;
