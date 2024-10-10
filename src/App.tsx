import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
import { changeLogs, LATEST_APP_VERSION } from "./utils/changelog";
import { TWEEN_CONFIG } from "./utils/constants";
// import Notifications from "./utils/notifications";
import {
  DBResultDataObjType,
  PreferenceObjType,
  userPreferencesType,
  SalahNamesType,
  SalahRecordType,
  SalahRecordsArrayType,
  SalahStatusType,
} from "./types/types";

// import { StatusBar, Style } from "@capacitor/status-bar";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { format, parse, eachDayOfInterval } from "date-fns";
import { PreferenceType } from "./types/types";
import { userGenderType } from "./types/types";

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
  console.log("APP.TSX HAS RENDERED...");
  const [showChangelogModal, setShowChangelogModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("appVersion") !== LATEST_APP_VERSION) {
      setShowChangelogModal(true);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  const [fetchedSalahData, setFetchedSalahData] =
    useState<SalahRecordsArrayType>([]);

  const [renderTable, setRenderTable] = useState(false);

  const [userPreferences, setUserPreferences] = useState<userPreferencesType>({
    userGender: "male",
    userStartDate: "",
    dailyNotification: "",
    dailyNotificationTime: "",
    reasonsArray: [],
  });

  // console.log("APP COMPONENT HAS RENDERED");
  const {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();

  useEffect(() => {
    if (isDatabaseInitialised === true) {
      const initialiseAndLoadData = async () => {
        setRenderTable(true);
        await fetchDataFromDB();
      };
      initialiseAndLoadData();
    }
  }, [isDatabaseInitialised]);

  const fetchDataFromDB = async () => {
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
        await handleUserPreferencesDataFromDB(DBResultPreferences.values);
      } else {
        throw new Error(
          "DBResultPreferences or DBResultPreferences.values do not exist"
        );
      }

      if (DBResultAllSalahData && DBResultAllSalahData.values) {
        await handleSalahTrackingDataFromDB(DBResultAllSalahData.values);
      } else {
        throw new Error(
          "DBResultAllSalahData or DBResultAllSalahData.values do not exist"
        );
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
  };

  const handleUserPreferencesDataFromDB = async (
    // DBResultPreferences: PreferenceObjType[]
    DBResultPreferences: PreferenceObjType[]
  ) => {
    let DBResultPreferencesValues = DBResultPreferences;

    if (DBResultPreferencesValues.length === 0) {
      const userStartDate = format(new Date(), "yyyy-MM-dd");

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
          const DBResultPreferencesQuery = await dbConnection.current.query(
            `SELECT * FROM userPreferencesTable`
          );

          DBResultPreferencesValues =
            DBResultPreferencesQuery.values as PreferenceObjType[];
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
        setUserPreferences((userPreferences: userPreferencesType) => ({
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
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        userStartDate: userStartDate.preferenceValue,
      }));

      userStartDateForSalahTrackingFunc = userStartDate.preferenceValue;
      // await handleSalahTrackingDataFromDB(DBResultAllSalahData);
    } else {
      console.error("userStartDate row not found");
    }

    if (reasons) {
      // setReasonsArray(reasons.preferenceValue.split(","));
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        reasonsArray: reasons.preferenceValue.split(","),
      }));
    } else {
      console.error("reasons row not found");
    }

    if (dailyNotificationRow) {
      // setDailyNotification(dailyNotificationRow.preferenceValue);
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        dailyNotification: dailyNotificationRow.preferenceValue,
      }));
    } else {
      console.error("dailyNotification row not found");
    }

    if (dailyNotificationTimeRow) {
      // setDailyNotificationTime(dailyNotificationTimeRow.preferenceValue);
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        dailyNotificationTime: dailyNotificationTimeRow.preferenceValue,
      }));
    } else {
      console.error("dailyNotificationTime row not found");
    }
  };

  // ? Using userStartDateForSalahTrackingFunc like this is apparently bad practice, but for now its working
  let userStartDateForSalahTrackingFunc: string;
  useEffect(() => {
    userStartDateForSalahTrackingFunc = userPreferences.userStartDate;
  }, [userPreferences.userStartDate]);

  const handleSalahTrackingDataFromDB = async (
    DBResultAllSalahData: DBResultDataObjType[]
  ) => {
    const singleSalahObjArr: SalahRecordsArrayType = [];
    const todaysDate = new Date();

    const userStartDateFormattedToDateObject: Date = parse(
      userStartDateForSalahTrackingFunc,
      "yyyy-MM-dd",
      new Date()
    );

    const datesFromStartToToday: string[] = eachDayOfInterval({
      start: userStartDateFormattedToDateObject,
      end: todaysDate,
    })
      .map((date) => format(date, "yyyy-MM-dd"))
      .reverse();

    for (let i = 0; i < datesFromStartToToday.length; i++) {
      let singleSalahObj: SalahRecordType = {
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

      // ? Below if statement potentially needs to be moved as it's currently being called on every loop
      if (DBResultAllSalahData && DBResultAllSalahData.length > 0) {
        for (let i = 0; i < DBResultAllSalahData.length; i++) {
          if (DBResultAllSalahData[i].date === currentDate) {
            let salahName: SalahNamesType = DBResultAllSalahData[i].salahName;
            let salahStatus: SalahStatusType =
              DBResultAllSalahData[i].salahStatus;
            singleSalahObj.salahs[salahName] = salahStatus;
          }
        }
      }

      singleSalahObjArr.push(singleSalahObj);
    }
    setFetchedSalahData([...singleSalahObjArr]);
  };

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
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                setFetchedSalahData={setFetchedSalahData}
                fetchedSalahData={fetchedSalahData}
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
                sqliteConnection={sqliteConnection}
                dbConnection={dbConnection}
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                pageStyles={pageStyles}
                modifyDataInUserPreferencesTable={
                  modifyDataInUserPreferencesTable
                }
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
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
                fetchedSalahData={fetchedSalahData}
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
                    setUserPreferences(
                      (userPreferences: userPreferencesType) => ({
                        ...userPreferences,
                        userGender: "male",
                      })
                    );
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
                    setUserPreferences(
                      (userPreferences: userPreferencesType) => ({
                        ...userPreferences,
                        userGender: "female",
                      })
                    );
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
        <Sheet
          isOpen={showChangelogModal}
          onClose={() => setShowChangelogModal(false)}
          detent="full-height"
          // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
          tweenConfig={TWEEN_CONFIG}
        >
          <Sheet.Container>
            {/* <Sheet.Header /> */}
            <Sheet.Content className="overflow-scroll sheet-changelog">
              <h1 className="mx-8 mt-8 mb-4 text-2xl ">Whats new?</h1>
              {changeLogs.map((item, i) => (
                <section key={item.changes[i].heading} className="mx-6 mt-4">
                  <p>
                    {item.versionNum === LATEST_APP_VERSION
                      ? `v${item.versionNum} - Latest Version`
                      : `v${item.versionNum}`}
                  </p>
                  {item.changes.map((item) => (
                    <section
                      key={item.heading}
                      // style={{ border: `1px solid ${activeBackgroundColor}` }}
                      className="mt-4 mb-4 p-4 border border-[var(--border-form)] rounded-xl
"
                    >
                      <h2 className="mb-2 text-lg font-medium ">
                        {item.heading}
                      </h2>
                      <p>{item.text}</p>
                    </section>
                  ))}
                </section>
              ))}
              <button
                onClick={() => setShowChangelogModal(false)}
                className="text-base fixed bottom-[7%] left-1/2 transform -translate-x-1/2 translate-y-1/2 border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-6
"
              >
                Close
              </button>
              {/* <SheetCloseBtn closeModalState={setShowChangelogModal} /> */}
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop
            // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            onTap={() => setShowChangelogModal(false)}
          />
        </Sheet>
      </section>
    </BrowserRouter>
  );
};

export default App;
