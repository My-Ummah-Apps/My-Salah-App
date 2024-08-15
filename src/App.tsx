import { useState, useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
// import Notifications from "./utils/notifications";
import {
  CalenderSalahArray,
  CalenderSalahArrayObject,
  SalahEntry,
  SalahRecordsArray,
} from "./types/types";

// import { StatusBar, Style } from "@capacitor/status-bar";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { subDays, format, parse, eachDayOfInterval } from "date-fns";
import { PreferenceType } from "./types/types";
import { userGenderType } from "./types/types";
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

const App = () => {
  const INITIAL_LOAD_SIZE = 50;
  const [salahData, setSalahData] = useState<SalahRecordsArray>();
  const [calenderData, setCalenderData] = useState<CalenderSalahArray>([]);

  console.log("APP COMPONENT HAS RENDERED");
  const {
    isDatabaseInitialised,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();

  useEffect(() => {
    if (isDatabaseInitialised === true) {
      const initialiseAndLoadData = async () => {
        console.log("DATABASE HAS INITIALISED");
        setSalahData(await fetchSalahTrackingDataFromDB(0, INITIAL_LOAD_SIZE));
        await fetchUserPreferencesFromDB();
        setRenderTable(true);
        fetchCalendarData();
      };
      initialiseAndLoadData();
    }
  }, [isDatabaseInitialised]);

  // TODO: Below useEffect should only run once the homepage has loaded and is shown to the user, this is to stop app launch time from getting too long, also ensure this useEffect runs every time new data is INSERTED into the database ie whenever a table cell is updated, as this data will then need to reflect in the calendar component
  // useEffect(() => {
  // if (renderTable === true) {

  const fetchCalendarData = async () => {
    console.log("fetchCalendarData has run");
    try {
      await checkAndOpenOrCloseDBConnection("open");

      const DBResultCalenderData = await dbConnection.current?.query(
        `SELECT * FROM salahtrackingtable`
      );

      console.log(
        "🚀 ~ fetchCalendarData ~ fetchedsetDBResultCalenderData:",
        DBResultCalenderData
      );

      console.log("modifyDBResultCalenderData FUNCTION HAS EXECUTED");

      let calenderDataArr: CalenderSalahArray = [];

      if (DBResultCalenderData && DBResultCalenderData.values) {
        const DBResultCalenderDataValues = DBResultCalenderData.values;
        // console.log(
        //   "🚀 ~ modifyDBResultCalenderData ~ DBResultCalenderDataValues:",
        //   DBResultCalenderDataValues
        // );

        DBResultCalenderDataValues.forEach((obj) => {
          if (!calenderData.some((obj1) => obj1.hasOwnProperty(obj.date))) {
            console.log("!calenderData.some"); // !BUG: This if statement only runs on every other occasion when file is saved, sort out the type for this as hasOwnProperty is giving an error, this should help debug this further
            let currentDate = obj.date;

            let singleSalahObj: CalenderSalahArrayObject = {
              [currentDate]: [],
            };
            for (let i = 0; i < DBResultCalenderDataValues.length; i++) {
              if (DBResultCalenderDataValues[i].date === currentDate) {
                let singleObj: SalahEntry = {
                  salahName: DBResultCalenderDataValues[i].salahName,
                  salahStatus: DBResultCalenderDataValues[i].salahStatus,
                };
                singleSalahObj[obj.date].push(singleObj);
              }
            }

            calenderDataArr.push(singleSalahObj);
          }
        });
      }

      setCalenderData(calenderDataArr);
      console.log("calenderDataArr array: ", calenderDataArr);

      // return holdArr;
    } catch (error) {
      console.error("error fetching calender salahData: ", error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error("error closing database connection", error);
      }
    }
  };
  const executeFetchCalendarDataFunc = async () => {
    await fetchCalendarData();
  };

  // useEffect(() => {
  //   console.log("USEEFFECT FOR fetchCalendarData has run");
  //   if (isDatabaseInitialised) {
  //     fetchCalendarData();
  //   }
  // }, [salahData]);

  const [userGender, setUserGender] = useState<userGenderType>("male");
  const [dailyNotification, setDailyNotification] = useState<string>("");
  const [dailyNotificationTime, setDailyNotificationTime] =
    useState<string>("");
  const [reasonsArray, setReasonsArray] = useState<string[]>([]);

  const [renderTable, setRenderTable] = useState(false);
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

  const fetchUserPreferencesFromDB = async () => {
    console.log("fetchUserPreferencesFromDB FUNCTION HAS EXECUTED");
    try {
      await checkAndOpenOrCloseDBConnection("open");

      // const query = `SELECT * FROM userpreferencestable`;
      const DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userpreferencestable`
      );

      // const DBResultPreferences2 = await dbConnection.current?.query(
      //   `SELECT * FROM salahtrackingtable`
      // );

      // console.log("DBResultPreferences (userpreferencestable) IS: ");
      // console.log(DBResultPreferences);

      if (
        DBResultPreferences?.values &&
        DBResultPreferences.values.length === 0
      ) {
        const insertQuery = `
          INSERT OR IGNORE INTO userpreferencestable (preferenceName, preferenceValue) 
          VALUES 
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?)
          `;
        // prettier-ignore
        const params = [
          "userGender", "",
          "dailyNotification", "0",
          "dailyNotificationTime", "21:00",
          "haptics", "0",
          "reasonsArray", "Alarm,Education,Family,Friends,Gaming,Guests,Leisure,Movies,Shopping,Sleep,Sports,Travel,TV,Work",
          "showReasons", "0",
        ];
        await dbConnection.current?.query(insertQuery, params);
        // await dbConnection.current?.execute(insertQuery);

        setShowIntroModal(true);
      }

      const userGenderRow = DBResultPreferences?.values?.find(
        (row) => row.preferenceName === "userGender"
      );

      const dailyNotificationRow = DBResultPreferences?.values?.find(
        (row) => row.preferenceName === "dailyNotification"
      );
      console.log("dailyNotificationRow", dailyNotificationRow);
      const dailyNotificationTimeRow = DBResultPreferences?.values?.find(
        (row) => row.preferenceName === "dailyNotificationTime"
      );

      const reasons = DBResultPreferences?.values?.find(
        (row) => row.preferenceName === "reasonsArray"
      );
      setReasonsArray(reasons.preferenceValue.split(","));

      if (userGenderRow) {
        setUserGender(userGenderRow.preferenceValue);
      } else {
        console.log("userGenderRow row not found");
      }

      if (dailyNotificationRow) {
        setDailyNotification(dailyNotificationRow.preferenceValue);
      } else {
        console.log("dailyNotification row not found");
      }

      if (dailyNotificationTimeRow) {
        setDailyNotificationTime(dailyNotificationTimeRow.preferenceValue);
      } else {
        console.log("dailyNotificationTime row not found");
      }

      // const insertQuery = `INSERT INTO userpreferencestable (userGender, notifications) VALUES (?,?)`;
    } catch (error) {
      console.log("ERROR IN fetchUserPreferencesFromDB FUNCTION: " + error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.log("ERROR CLOSING DATABASE CONNECTION: " + error);
      }
    }
  };

  let holdArr = [];
  const fetchSalahTrackingDataFromDB = async (
    startIndex: number,
    endIndex: number
  ) => {
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
      const DBResultSalahData = await dbConnection.current?.query(
        query,
        slicedDatesFormattedArr
      );

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

        if (DBResultSalahData?.values && DBResultSalahData.values.length > 0) {
          for (let i = 0; i < DBResultSalahData.values.length; i++) {
            if (
              DBResultSalahData.values?.[i]?.date === dateFromDatesFormattedArr
            ) {
              let salahName: any = DBResultSalahData?.values?.[i].salahName;
              let salahStatus: string =
                DBResultSalahData?.values?.[i].salahStatus;
              singleSalahObj.salahs[salahName] = salahStatus;
            }
          }
        }

        holdArr.push(singleSalahObj);
      }

      return holdArr;
    } catch (error) {
      console.log("ERROR IN fetchSalahTrackingDataFromDB FUNCTION: " + error);
      throw new Error("ERROR IN fetchSalahTrackingDataFromDB FUNCTION: ");
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const modifyDataInUserPreferencesTable = async (
    value: string,
    preference: PreferenceType
  ) => {
    console.log("value is: " + value);
    try {
      await checkAndOpenOrCloseDBConnection("open");
      const query = `UPDATE userpreferencestable SET preferenceValue = ? WHERE preferenceName = ?`;
      await dbConnection.current?.run(query, [value, preference]);
      console.log("🚀 ~ App ~ value:", value);
    } catch (error) {
      console.log(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.log(error);
      }
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
  const [heading, setHeading] = useState("");

  const [currentWeek, setCurrentWeek] = useState(0);
  const today: Date = new Date();
  const startDate: Date = subDays(today, currentWeek);

  // useEffect(() => {
  //   const storedSalahTrackingData = localStorage.getItem(
  //     "storedSalahTrackingData"
  //   );
  // }, []);

  // const salahFulfilledDates = salahTrackingArray.reduce<string[]>(
  //   (accumulatorArray, salah) => {
  //     for (let i = 0; i < salah.completedDates.length; i++) {
  //       Object.values(salah.completedDates[i]);
  //       if (
  //         Object.values(salah.completedDates[i])[0].status !== "missed" &&
  //         Object.values(salah.completedDates[i])[0].status !== "blank"
  //       ) {
  //         accumulatorArray.push(Object.keys(salah.completedDates[i])[0]);
  //       }
  //     }
  //     return accumulatorArray;
  //   },
  //   []
  // );

  // console.log(salahFulfilledDates);

  // let datesFrequency: { [date: string]: number } = {};
  // salahFulfilledDates.forEach((date) => {
  //   datesFrequency[date] = (datesFrequency[date] || 0) + 1;
  // });

  // const datesFrequencyReduced = Object.keys(datesFrequency).filter((date) =>
  //   datesFrequency[date] === 5 ? true : false
  // );

  // let streakCount = 0;
  // function checkStreak() {
  //   // const todaysDate = new Date();

  //   for (let i = 0; i < datesFrequencyReduced.length; i++) {
  //     let formattedDate = subDays(todaysDate, i);

  //     if (datesFrequencyReduced.includes(format(formattedDate, "dd.MM.yy"))) {
  //       streakCount += 1;
  //     } else {
  //       break;
  //     }
  //   }
  //   setStreakCounter(streakCount);
  // }

  // useEffect(() => {
  //   checkStreak();
  // }, [datesFrequencyReduced]);

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
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                renderTable={renderTable}
                setReasonsArray={setReasonsArray}
                reasonsArray={reasonsArray}
                datesFormatted={datesFormatted}
                fetchSalahTrackingDataFromDB={fetchSalahTrackingDataFromDB}
                setSalahData={setSalahData}
                salahData={salahData}
                fetchCalendarData={fetchCalendarData}
                userGender={userGender}
                userStartDate={userStartDate}
                setHeading={setHeading}
                pageStyles={pageStyles}
                startDate={startDate}
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
                dbConnection={dbConnection}
                modifyDataInUserPreferencesTable={
                  modifyDataInUserPreferencesTable
                }
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                setDailyNotification={setDailyNotification}
                setDailyNotificationTime={setDailyNotificationTime}
                dailyNotificationTime={dailyNotificationTime}
                dailyNotification={dailyNotification}
              />
            }
          />
          <Route
            path="/StatsPage"
            element={
              <StatsPage
                dbConnection={dbConnection}
                userGender={userGender}
                userStartDate={userStartDate}
                salahData={salahData}
                calenderData={calenderData}
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                // title={<h1 className={h1ClassStyles}>{"Stats"}</h1>}
                pageStyles={pageStyles}
                setHeading={setHeading}
                startDate={startDate}
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
                  onClick={async () => {
                    setUserGender("male");
                    // localStorage.setItem("userGender", "male");
                    await modifyDataInUserPreferencesTable(
                      "male",
                      "userGender"
                    );
                    setShowIntroModal(false);
                  }}
                  className="p-2 m-4 text-2xl text-white bg-blue-800 rounded-2xl"
                >
                  Male
                </p>
                <p
                  onClick={async () => {
                    // localStorage.setItem("userGender", "female");
                    setUserGender("female");
                    await modifyDataInUserPreferencesTable(
                      "female",
                      "userGender"
                    );
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
