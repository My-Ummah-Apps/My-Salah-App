import { useState, useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
// import Notifications from "./utils/notifications";
import {
  CalenderSalahArray,
  CalenderSalahArrayObject,
  SalahEntry,
  SalahNames,
  SalahRecord,
  SalahRecordsArray,
  SalahStatus,
  userPreferences,
} from "./types/types";

// import { StatusBar, Style } from "@capacitor/status-bar";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { format, parse, eachDayOfInterval } from "date-fns";
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
import { table } from "console";

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
  console.log("APP.TSX HAS RENDERED...");

  const [tableData, setTableData] = useState<SalahRecordsArray>([]);
  const [calenderData, setCalenderData] = useState<CalenderSalahArray>([]);
  const [datesFromStartToToday, setDatesFromStartToToday] = useState<string[]>(
    []
  );
  const [renderTable, setRenderTable] = useState(false);

  // const [userGender, setUserGender] = useState<userGenderType>("male");
  // const [dailyNotification, setDailyNotification] = useState<string>("");
  // const [dailyNotificationTime, setDailyNotificationTime] =
  //   useState<string>("");
  // const [reasonsArray, setReasonsArray] = useState<string[]>([]);
  // const [userStartDate, setUserStartDate] = useState<string>("");

  const [userPreferences, setUserPreferences] = useState<userPreferences>({
    userGender: "male",
    userStartDate: "",
    dailyNotification: "",
    dailyNotificationTime: "",
    reasonsArray: [],
  });

  // console.log("APP COMPONENT HAS RENDERED");
  const {
    isDatabaseInitialised,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();

  useEffect(() => {
    if (isDatabaseInitialised === true) {
      const initialiseAndLoadData = async () => {
        console.log("DATABASE HAS INITIALISED");
        await executeTransfer(); // ! REMOVE ONCE TRANSFER IS COMPLETE
        await fetchDataFromDB();
        // setTimeout(() => {
        //   setRenderTable(true);
        // }, 2000);
      };
      initialiseAndLoadData();
    }
  }, [isDatabaseInitialised]);

  // ! _________________________________________REMOVE BELOW ONCE TRANSFER IS COMPLETE___________________________________________

  // const oldSalahData =
  //   '[{"salahName":"Fajr","completedDates":[{"28.08.24":{"status":"group","reasons":[],"notes":""}},{"21.08.24":{"status":"male-alone","reasons":["Shopping","Movies"],"notes":"asdasdasd"}},{"24.08.24":{"status":"missed","reasons":["Movies","TV"],"notes":"asdasd"}}]},{"salahName":"Dhuhr","completedDates":[{"28.08.24":{"status":"male-alone","reasons":["Movies","Leisure"],"notes":""}},{"22.08.24":{"status":"group","reasons":[],"notes":"asdasdas"}}]},{"salahName":"Asar","completedDates":[{"28.08.24":{"status":"late","reasons":[],"notes":""}},{"25.08.24":{"status":"male-alone","reasons":["Education","Leisure"],"notes":"asdasd"}}]},{"salahName":"Maghrib","completedDates":[{"20.08.24":{"status":"late","reasons":["Work","Movies"],"notes":"asdasdasd"}},{"27.08.24":{"status":"group","reasons":[],"notes":"asdad"}}]},{"salahName":"Isha","completedDates":[{"28.08.24":{"status":"late","reasons":["Movies","Family"],"notes":""}},{"23.08.24":{"status":"late","reasons":["Movies","Leisure"],"notes":"asdasd"}}]}]';

  // localStorage.setItem("storedSalahTrackingData", oldSalahData);

  const executeTransfer = async () => {
    if (localStorage.getItem("storedSalahTrackingData")) {
      const storedSalahTrackingData = localStorage.getItem(
        "storedSalahTrackingData"
      );
      if (storedSalahTrackingData) {
        const parsedOldData = JSON.parse(storedSalahTrackingData);
        try {
          console.log("🚀 ~ executeTransfer ~ parsedOldData:", parsedOldData);

          await checkAndOpenOrCloseDBConnection("open");
          for (const salah of parsedOldData) {
            const { salahName, completedDates } = salah;

            for (const dateObj of completedDates) {
              const [date, details] = Object.entries(dateObj)[0]; // Extract date and details
              const { status, reasons, notes } = details;

              // Convert reasons array to a comma-separated string
              const reasonsString = reasons.join(",");

              // Insert the data into the SQLite table
              const insertQuery = `
                  INSERT INTO salahDataTable (date, salahName, salahStatus, reasons, notes)
                  VALUES (?, ?, ?, ?, ?);
                `;

              if (!dbConnection.current) {
                throw new Error("dbConnection.current does not exist");
              }

              await dbConnection.current.query(insertQuery, [
                date,
                salahName,
                status,
                reasonsString,
                notes,
              ]);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          try {
            checkAndOpenOrCloseDBConnection("close");
          } catch (error) {
            console.error(error);
          }
        }
        localStorage.setItem("salahBackUpData", storedSalahTrackingData);
        localStorage.removeItem("storedSalahTrackingData");
      }
    }
  };

  //! ____________________________________________________________________________________________________________________________

  const fetchDataFromDB = async () => {
    console.log("fetchDataFromDB has run");
    try {
      await checkAndOpenOrCloseDBConnection("open");

      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection or dbConnection.current do not exist");
      }

      const DBResultAllSalahData = await dbConnection.current.query(
        `SELECT * FROM salahDataTable`
      );

      const DBResultPreferences = await dbConnection.current.query(
        `SELECT * FROM userPreferencesTable`
      );

      if (DBResultPreferences && DBResultPreferences.values) {
        await fetchUserPreferencesFromDB(
          DBResultPreferences,
          DBResultAllSalahData
        );
      } else {
        throw new Error(
          "DBResultPreferences or DBResultPreferences.values do not exist"
        );
      }

      if (DBResultAllSalahData && DBResultAllSalahData.values) {
        // setTableData(await handleSalahTrackingDataFromDB(DBResultAllSalahData));
        console.log("DBResultAllSalahData ", DBResultAllSalahData.values);
        // await handleSalahTrackingDataFromDB(DBResultAllSalahData.values);
        await handleCalendarData(DBResultAllSalahData.values);
      } else {
        throw new Error(
          "DBResultAllSalahData or DBResultAllSalahData.values do not exist"
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      try {
        console.log("DATABASE FETCH COMPLETE, CLOSING CONNECTION");
        checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchUserPreferencesFromDB = async (
    DBResultPreferences,
    DBResultAllSalahData
  ) => {
    const todaysDate: Date = new Date();
    console.log("DBResultAllSalahData ", DBResultAllSalahData);

    console.log(
      "🚀 ~ fetchUserPreferencesFromDB ~ DBResultPreferences:",
      DBResultPreferences
    );

    let DBResultPreferencesValues = DBResultPreferences.values;

    if (DBResultPreferencesValues.length === 0) {
      // const userStartDate = format(todaysDate, "yyyy-MM-dd");
      const userStartDate = format(todaysDate, "dd.MM.yy");

      const insertQuery = `
          INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) 
          VALUES 
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?);
          `;
      // prettier-ignore
      const params = [
          "userGender", "male",
          "userStartDate", userStartDate,
          "dailyNotification", "0",
          "dailyNotificationTime", "21:00",
          "haptics", "0",
          "reasons", "Alarm,Education,Family,Friends,Gaming,Guests,Leisure,Movies,Shopping,Sleep,Sports,Travel,TV,Work",
          "showReasons", "0",
        ];

      try {
        await checkAndOpenOrCloseDBConnection("open");
        if (dbConnection && dbConnection.current) {
          await dbConnection.current.query(insertQuery, params);
          DBResultPreferences = await dbConnection.current.query(
            `SELECT * FROM userPreferencesTable`
          );
        } else {
          console.error("dbConnection or dbConnection.current does not exist");
        }
      } catch (error) {
        console.error(error);
      } finally {
        try {
          checkAndOpenOrCloseDBConnection("close");
        } catch (error) {
          console.error(error);
        }
      }
      // TODO: Set type for DBResultPreferencesValues
      DBResultPreferencesValues = DBResultPreferences.values;
      setShowIntroModal(true);
    }

    if (!DBResultPreferencesValues) {
      throw new Error("DBResultPreferencesValues does not exist");
    }

    const assignPreference = (
      preference: string
    ): {
      preferenceName: string;
      preferenceValue: string;
    } | null => {
      // TODO: Set types for preferenceQuery
      let preferenceQuery = DBResultPreferencesValues.find(
        (row) => row.preferenceName === preference
      );

      if (preferenceQuery) {
        return preferenceQuery;
      } else {
        console.error("preferenceQuery row does not exist");
        return null;
      }
    };

    const userGenderRow = assignPreference("userGender");
    const userStartDate = assignPreference("userStartDate");
    const dailyNotificationRow = assignPreference("dailyNotification");
    const dailyNotificationTimeRow = assignPreference("dailyNotificationTime");
    const reasons = assignPreference("reasons");

    if (userGenderRow) {
      const gender = userGenderRow.preferenceValue as userGenderType;
      if (gender === "male" || gender === "female") {
        setUserPreferences((userPreferences) => ({
          ...userPreferences,
          userGender: gender,
        }));
      } else {
        console.error(`Invalid gender value: ${gender}`);
      }
    } else {
      console.error("userGenderRow row not found");
    }

    if (userStartDate) {
      const userStartDateFormatted: Date = parse(
        userStartDate.preferenceValue,
        "dd.MM.yy",
        new Date()
      );

      const datesArray: string[] = eachDayOfInterval({
        start: userStartDateFormatted,
        end: todaysDate,
      })
        .map((date) => format(date, "dd.MM.yy"))
        .reverse();

      console.log("datesArray: ", datesArray);
      console.log("UPDATING DATESFROMSTART STATE");
      // setDatesFromStartToToday(datesArray);
      const dates = ["04.09.24", "03.09.24", "02.09.24", "01.09.24"];
      setDatesFromStartToToday([...dates]);
      console.log(
        "🚀 ~ fetchUserPreferencesFromDB ~ datesFromStartToToday:",
        datesFromStartToToday
      );

      await handleSalahTrackingDataFromDB(DBResultAllSalahData, dates);

      // ! need to change the userStartDate in the params array above (line 320) as its manually set at the moment, this needs to be dynamic + it is going to be passed in as yyyy-mm-dd format so this will also require for adjustments to be made throughout the app

      // setUserStartDate(userStartDate.preferenceValue);
      setUserPreferences((userPreferences) => ({
        ...userPreferences,
        userStartDate: userStartDate.preferenceValue,
      }));
      console.log("userStartDate ", userStartDate.preferenceValue);
    } else {
      console.error("userStartDate row not found");
    }

    if (reasons) {
      // setReasonsArray(reasons.preferenceValue.split(","));
      setUserPreferences((userPreferences) => ({
        ...userPreferences,
        reasonsArray: reasons.preferenceValue.split(","),
      }));
    } else {
      console.error("reasons row not found");
    }

    if (dailyNotificationRow) {
      // setDailyNotification(dailyNotificationRow.preferenceValue);
      setUserPreferences((userPreferences) => ({
        ...userPreferences,
        dailyNotification: dailyNotificationRow.preferenceValue,
      }));
    } else {
      console.error("dailyNotification row not found");
    }

    if (dailyNotificationTimeRow) {
      // setDailyNotificationTime(dailyNotificationTimeRow.preferenceValue);
      setUserPreferences((userPreferences) => ({
        ...userPreferences,
        dailyNotificationTime: dailyNotificationTimeRow.preferenceValue,
      }));
    } else {
      console.error("dailyNotificationTime row not found");
    }
  };

  const handleCalendarData = async (DBResultCalenderData: any) => {
    console.log(
      "handleCalendarData has run, DBResultCalenderData is: ",
      DBResultCalenderData
    );

    let calenderDataArr: CalenderSalahArray = [];

    DBResultCalenderData.forEach((obj) => {
      if (
        !calenderDataArr.some((calenderObj) =>
          calenderObj.hasOwnProperty(obj.date)
        )
      ) {
        let currentDate = obj.date;
        const filteredDBResultCalenderDataValues = DBResultCalenderData.filter(
          (obj) => obj.date === currentDate
        );

        let singleSalahObj: CalenderSalahArrayObject = {
          [currentDate]: [],
        };

        filteredDBResultCalenderDataValues.forEach((obj) => {
          let singleObj: SalahEntry = {
            salahName: obj.salahName,
            salahStatus: obj.salahStatus,
          };
          singleSalahObj[obj.date].push(singleObj);
        });

        calenderDataArr.push(singleSalahObj);
      }
    });

    setCalenderData(calenderDataArr);
  };

  const handleSalahTrackingDataFromDB = async (
    DBResultSalahData,
    datesFromStartToToday
  ): Promise<SalahRecordsArray> => {
    const singleSalahObjArr: SalahRecordsArray = [];
    // ! BUG: Although DBResultSalahData is being updated with each salah status being entered and it persists between renders, tableData does not persist the data so on page refresh the table cells are lost, if user navigates away from the table page and then comes back to the table page the table cells do still show the correct data, its only on page refresh the tableData loses all data
    console.log("🚀 ~ App ~ DBResultSalahData:", DBResultSalahData);
    console.log(
      "handleSalahTrackingDataFromDB FUNCTION HAS EXECUTED, datesFromStartToToday as follows:",
      datesFromStartToToday
    );

    console.log("datesFromStartToToday: ", datesFromStartToToday);
    for (let i = 0; i < datesFromStartToToday.length; i++) {
      let singleSalahObj: SalahRecord = {
        date: datesFromStartToToday[i],
        salahs: {
          Fajr: "",
          Dhuhr: "",
          Asar: "",
          Maghrib: "",
          Isha: "",
        },
      };

      const currentDate = datesFromStartToToday[i];

      if (DBResultSalahData && DBResultSalahData.length > 0) {
        for (let i = 0; i < DBResultSalahData.length; i++) {
          if (DBResultSalahData[i].date === currentDate) {
            let salahName: SalahNames = DBResultSalahData[i].salahName;
            let salahStatus: SalahStatus = DBResultSalahData[i].salahStatus;
            singleSalahObj.salahs[salahName] = salahStatus;
          }
        }
      }
      // console.log("DBResultSalahData: ", DBResultSalahData);

      singleSalahObjArr.push(singleSalahObj);
    }
    setTableData([...singleSalahObjArr]);
    console.log("🚀 singleSalahObjArr:", singleSalahObjArr);
    console.log("tableData: ", tableData);

    // setTableData(singleSalahObjArr);
    // setTableData([
    //   {
    //     date: "04.09.24",
    //     salahs: {
    //       Fajr: "excused",
    //       Dhuhr: "",
    //       Asar: "",
    //       Maghrib: "",
    //       Isha: "",
    //     },
    //   },
    //   {
    //     date: "05.09.24",
    //     salahs: {
    //       Fajr: "",
    //       Dhuhr: "late",
    //       Asar: "",
    //       Maghrib: "",
    //       Isha: "",
    //     },
    //   },
    // ]);
    // return singleSalahObjArr;
  };

  useEffect(() => {
    console.log("tableData in useEffect is:", tableData);

    // if (tableData.length > 0) {
    //   console.log(
    //     "🚀 ~ useEffect ~ datesFromStartToToday:",
    //     datesFromStartToToday
    //   );
    //   console.log("TABLEDATA: ", tableData);
    //   setRenderTable(true);
    // }
  }, [tableData]);

  const modifyDataInUserPreferencesTable = async (
    value: string,
    preference: PreferenceType
  ) => {
    try {
      await checkAndOpenOrCloseDBConnection("open");
      const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection or dbConnection.current do not exist");
      }
      await dbConnection.current.run(query, [value, preference]);
    } catch (error) {
      console.error(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
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

  // const todaysDate = new Date("2024-01-01");

  // const [streakCounter, setStreakCounter] = useState(0);

  const [heading, setHeading] = useState("");

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
                dbConnection={dbConnection}
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                renderTable={renderTable}
                handleCalendarData={handleCalendarData}
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                // setReasonsArray={setReasonsArray}
                // reasonsArray={reasonsArray}
                datesFromStartToToday={datesFromStartToToday}
                setTableData={setTableData}
                tableData={tableData}
                // userGender={userGender}
                // userStartDate={userStartDate}
                setHeading={setHeading}
                pageStyles={pageStyles}
              />
            }
          />
          <Route
            path="/SettingsPage"
            element={
              <SettingsPage
                setHeading={setHeading}
                pageStyles={pageStyles}
                modifyDataInUserPreferencesTable={
                  modifyDataInUserPreferencesTable
                }
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                // setDailyNotification={setDailyNotification}
                // setDailyNotificationTime={setDailyNotificationTime}
                // dailyNotificationTime={dailyNotificationTime}
                // dailyNotification={dailyNotification}
              />
            }
          />
          <Route
            path="/StatsPage"
            element={
              <StatsPage
                dbConnection={dbConnection}
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                userPreferences={userPreferences}
                // userGender={userGender}
                // userStartDate={userStartDate}
                calenderData={calenderData}
                pageStyles={pageStyles}
                setHeading={setHeading}
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
                    // setUserGender("male");
                    setUserPreferences((userPreferences) => ({
                      ...userPreferences,
                      userGender: "male",
                    }));
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
                    // setUserGender("female");
                    setUserPreferences((userPreferences) => ({
                      ...userPreferences,
                      userGender: "female",
                    }));
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
