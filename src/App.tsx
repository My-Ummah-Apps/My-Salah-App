import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
// import Notifications from "./utils/notifications";
import { salahTrackingEntryType } from "./types/types";

// import { StatusBar, Style } from "@capacitor/status-bar";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { subDays, format, parse, eachDayOfInterval } from "date-fns";
// import { initialiseDatabase } from "./utils/SQLiteService";

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
// import StreakCount from "./components/Stats/StreakCount";
import useSQLiteDB from "./utils/useSqLiteDB";

window.addEventListener("DOMContentLoaded", async () => {
  // try {

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
  const {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();
  useEffect(() => {
    console.log("isDatabaseInitialised useEffect has run");
    const initialiseAndLoadData = async () => {
      if (isDatabaseInitialised === true) {
        console.log("DATABASE HAS INITIALISED");
        setData(await fetchSalahTrackingDataFromDB(1, INITIAL_LOAD_SIZE));
        await fetchUserPreferencesFromDB();
        // let sIndex = 1;
        // let eIndex = INITIAL_LOAD_SIZE;
        setSIndex(1);
        setEIndex(50);

        console.log("setData within useEffect has run and its data is: ");
        console.log(data);
        console.log(data.length);
        setRenderTable(true);
      }
    };
    initialiseAndLoadData();
  }, [isDatabaseInitialised]);
  const INITIAL_LOAD_SIZE = 50;
  const [data, setData] = useState<any>([]);
  // console.log("SETDATA WITHIN TABLE IS:");
  // console.log(data);
  let [sIndex, setSIndex] = useState<number>();
  let [eIndex, setEIndex] = useState<number>();

  // isDatabaseInitialised is only initialised once, so can probably be safely removed

  const [isLoading, setIsLoading] = useState(false);

  const [renderTable, setRenderTable] = useState(false);
  // console.log(data);
  let userStartDate: string | null = "01.01.23";
  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  const endDate = new Date(); // Current date
  const datesBetweenUserStartDateAndToday = eachDayOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });
  const datesFormatted = datesBetweenUserStartDateAndToday.map((date) =>
    format(date, "dd.MM.yy")
  );
  datesFormatted.reverse();
  let userGender: string;

  const fetchUserPreferencesFromDB = async () => {
    console.log("fetchUserPreferencesFromDB FUNCTION HAS EXECUTED");
    try {
      await checkAndOpenOrCloseDBConnection("open");

      // const query = `SELECT * FROM userpreferencestable`;
      const res = await dbConnection.current?.query(
        `SELECT * FROM userpreferencestable`
      );

      console.log("RES (userpreferencestable) IS: ");
      console.log(res);

      if (res?.values && res.values.length === 0) {
        setShowIntroModal(true);
        // await dbConnection.current?.query(insertQuery, ["", ""]);
      }

      // useEffect(() => {
      //   if (!userGender) {
      //
      //   }
      // }, []);

      // const insertQuery = `INSERT INTO userpreferencestable (userGender, notifications) VALUES (?,?)`;
    } catch (error) {
      console.log("ERROR IN fetchUserPreferencesFromDB FUNCTION: ");
      console.log(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.log("ERROR CLOSING DATABASE CONNECTION:");
        console.log(error);
      }
    }
  };

  let holdArr: any;
  holdArr = [];
  const fetchSalahTrackingDataFromDB = async (
    startIndex: number,
    endIndex: number
  ) => {
    // holdArr = [];
    console.log("fetchSalahTrackingDataFromDB FUNCTION HAS EXECUTED");
    try {
      console.log("START AND END INDEX: " + startIndex, endIndex);
      await checkAndOpenOrCloseDBConnection("open");

      const slicedDatesFormattedArr = datesFormatted.slice(
        startIndex,
        endIndex
      );
      const placeholders = slicedDatesFormattedArr.map(() => "?").join(", ");

      const query = `SELECT * FROM salahtrackingtable WHERE date IN (${placeholders})`;
      const res = await dbConnection.current?.query(
        query,
        slicedDatesFormattedArr
      );

      console.log("RES IS: ");
      console.log(res);
      console.log(slicedDatesFormattedArr);

      // console.log("staticDateAndDatabaseDataCombined HAS RUN");
      for (let i = 0; i < slicedDatesFormattedArr.length; i++) {
        const dateFromDatesFormattedArr = datesFormatted[startIndex + i];

        type Salahs = {
          [key: string]: string;
        };

        let singleSalahObj = {
          date: dateFromDatesFormattedArr,
          salahs: {
            Fajr: "",
            Dhuhr: "",
            Asar: "",
            Maghrib: "",
            Isha: "",
          } as Salahs,
        };

        if (res?.values && res.values.length > 0) {
          for (let i = 0; i < res.values.length; i++) {
            if (res.values?.[i]?.date === dateFromDatesFormattedArr) {
              // console.log("DATE MATCH DETECTED");
              let salahName: any = res?.values?.[i].salahName;
              let salahStatus: string = res?.values?.[i].salahStatus;
              singleSalahObj.salahs[salahName] = salahStatus;
            }
          }
        }

        holdArr.push(singleSalahObj);
      }

      // console.log("holdArr data is:");
      // console.log(holdArr);
      // console.log("holdArr length is:");
      // console.log(holdArr.length);

      return holdArr;
    } catch (error) {
      console.log("ERROR IN fetchSalahTrackingDataFromDB FUNCTION: ");
      console.log(error);
      throw new Error("ERROR IN fetchSalahTrackingDataFromDB FUNCTION: ");
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (finalError) {
        console.log("ERROR CLOSING DATABASE CONNECTION:");
        console.log(finalError);
      }
    }
  };

  // hook for sqlite db
  // const { performSQLAction, databaseInitialised } = useSQLiteDB();

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

  // const todaysDate = new Date("2024-01-01");
  const todaysDate = new Date();
  // let userStartDate: string | null = localStorage.getItem("userStartDate");

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
                dbConnection={dbConnection}
                renderTable={renderTable}
                datesFormatted={datesFormatted}
                fetchSalahTrackingDataFromDB={fetchSalahTrackingDataFromDB}
                setData={setData}
                data={data}
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
                    // localStorage.setItem("userGender", "male");
                    setShowIntroModal(false);
                  }}
                  className="p-2 m-4 text-2xl text-white bg-blue-800 rounded-2xl"
                >
                  Male
                </p>
                <p
                  onClick={() => {
                    // localStorage.setItem("userGender", "female");
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
