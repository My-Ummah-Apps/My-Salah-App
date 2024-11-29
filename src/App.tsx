import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
import { LATEST_APP_VERSION } from "./utils/changelog";
import {
  checkNotificationPermissions,
  getMissedSalahCount,
  prayerStatusColorsHexCodes,
  sheetHeaderHeight,
} from "./utils/constants";
import {
  DBResultDataObjType,
  PreferenceObjType,
  userPreferencesType,
  SalahNamesType,
  SalahRecordType,
  SalahRecordsArrayType,
  SalahStatusType,
  MissedSalahObjType,
} from "./types/types";

import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
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
// import StreakCount from "./components/Stats/StreakCount";
import useSQLiteDB from "./utils/useSqLiteDB";
import MissedPrayersListBottomSheet from "./components/BottomSheets/MissedPrayersListBottomSheet";
import BottomSheetChangelog from "./components/BottomSheets/BottomSheetChangeLog";
import { LocalNotifications } from "@capacitor/local-notifications";

window.addEventListener("DOMContentLoaded", async () => {
  if (Capacitor.isNativePlatform()) {
    setTimeout(() => {
      SplashScreen.hide({
        fadeOutDuration: 250,
      });
    }, 500);
  }

  if (Capacitor.isNativePlatform()) {
    const STATUS_AND_NAV_BAR_COLOR = "#161515";
    if (Capacitor.getPlatform() === "android") {
      setTimeout(() => {
        StatusBar.setBackgroundColor({ color: STATUS_AND_NAV_BAR_COLOR });
        NavigationBar.setColor({ color: STATUS_AND_NAV_BAR_COLOR });
      }, 1000);
    }
  }
});

const App = () => {
  // console.log("APP.TSX HAS RENDERED...");
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [showMissedPrayersSheet, setShowMissedPrayersSheet] = useState(false);
  const [missedSalahList, setMissedSalahList] = useState<MissedSalahObjType>(
    {}
  );

  useEffect(() => {
    if (
      localStorage.getItem("appVersion") &&
      localStorage.getItem("appVersion") !== LATEST_APP_VERSION
    ) {
      setShowChangelogModal(true);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("existingUser")) {
      setShowIntroModal(true);
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

  useEffect(() => {
    let copyOfMissedSalahList: MissedSalahObjType = {};
    fetchedSalahData.forEach((obj) => {
      for (let salahName in obj.salahs) {
        if (obj.salahs[salahName as SalahNamesType] === "missed") {
          const arr = copyOfMissedSalahList[obj.date] ?? [];
          arr.push(salahName as SalahNamesType);
          copyOfMissedSalahList[obj.date] = arr;
        }
      }
    });
    setMissedSalahList({ ...copyOfMissedSalahList });
  }, [fetchedSalahData]);

  const fetchDataFromDB = async () => {
    try {
      await checkAndOpenOrCloseDBConnection("open");

      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection or dbConnection.current do not exist");
      }

      const DBResultAllSalahData = await dbConnection.current.query(
        `SELECT * FROM salahDataTable`
      );
      console.log("DBResultAllSalahData: ", DBResultAllSalahData.values);

      let DBResultPreferences = await dbConnection.current.query(
        `SELECT * FROM userPreferencesTable`
      );

      //       const test = await dbConnection.current
      //         .query(`SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='salahDataTable';
      // `);

      if (DBResultPreferences && DBResultPreferences.values) {
        // TODO: The below needs an additional check, as if the user does not select a gender and then relaunches the app, the gender prompt dissapears as values have been set and the length is no longer zero
        // if (DBResultPreferences.values.length === 0) {
        //   setShowIntroModal(true);
        // }
        const userNotificationPermission = await checkNotificationPermissions();
        // const pendingRes = await LocalNotifications.getPending();
        // const notificationRes = await LocalNotifications.checkPermissions();

        const notificationValue =
          DBResultPreferences.values.length > 0
            ? DBResultPreferences.values.find(
                (row) => row.preferenceName === "dailyNotification"
              ).preferenceValue
            : null;

        // * The below has been implemented as a last resort since on Android (atleast when installing via Android Studio) notifications stop working on reinstallation/update of the app, need to test whether this is still a problem when installing via the playstore, this issue doesn't exist on iOS
        if (
          Capacitor.getPlatform() === "android" &&
          userNotificationPermission === "granted" &&
          notificationValue === "1" &&
          localStorage.getItem("appVersion") !== LATEST_APP_VERSION
        ) {
          const dailyNotificationTime = DBResultPreferences.values.find(
            (row) => row.preferenceName === "dailyNotificationTime"
          );
          const [hour, minute] = dailyNotificationTime.preferenceValue
            .split(":")
            .map(Number);

          await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
          await LocalNotifications.schedule({
            notifications: [
              {
                id: 1,
                title: "Daily Reminder",
                body: `Did you log your prayers today?`,
                schedule: {
                  on: {
                    hour: hour,
                    minute: minute,
                  },
                  allowWhileIdle: true,
                  repeats: true,
                },
                channelId: "daily-reminder",
                // foreground: true, // iOS only
              },
            ],
          });
        }

        if (
          userNotificationPermission !== "granted" &&
          notificationValue === "1"
        ) {
          try {
            await modifyDataInUserPreferencesTable("0", "dailyNotification");
            await checkAndOpenOrCloseDBConnection("open");
            DBResultPreferences = await dbConnection.current.query(
              `SELECT * FROM userPreferencesTable`
            );
          } catch (error) {
            console.error(
              "Error modifying dailyNotification value in database:",
              error
            );
          }
        }
        try {
          if (DBResultPreferences.values) {
            await handleUserPreferencesDataFromDB(DBResultPreferences.values);
          } else {
            throw new Error("DBResultPreferences.values not found");
          }
        } catch (error) {
          console.error(error);
        }
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
          "reasons", "Alarm,Education,Emergency,Family/Friends,Gaming,Guests,Health,Leisure,Shopping,Sleep,Sports,Travel,TV,Other,Work",
          "showReasons", "0",
        ];

      try {
        await checkAndOpenOrCloseDBConnection("open");
        if (dbConnection && dbConnection.current) {
          await dbConnection.current.run(insertQuery, params);
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
    }

    if (!DBResultPreferencesValues) {
      throw new Error("DBResultPreferencesValues does not exist");
    }

    // ! Remove below once the ability for users to remove and add their own reasons is introduced
    const updatedReasons =
      "Alarm,Education,Emergency,Family/Friends,Gaming,Guests,Health,Leisure,Shopping,Sleep,Sports,Travel,TV,Other,Work";

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
      // ! Remove below if statement once the ability for users to remove and add their own reasons is introduced
      if (reasons.preferenceValue !== updatedReasons) {
        await modifyDataInUserPreferencesTable(updatedReasons, "reasons");
      }
      // setReasonsArray(reasons.preferenceValue.split(","));
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        reasonsArray: reasons.preferenceValue.split(","),
      }));
    } else {
      console.error("reasons row not found");
    }

    if (dailyNotificationRow) {
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        dailyNotification: dailyNotificationRow.preferenceValue,
      }));
    } else {
      console.error("dailyNotification row not found");
    }

    if (dailyNotificationTimeRow) {
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
    // const missedSalahObjArr: MissedSalahObjType[] = [];
    const missedSalahObj: MissedSalahObjType = {};
    const todaysDate = new Date();
    const userStartDateFormattedToDateObject: Date = parse(
      userStartDateForSalahTrackingFunc,
      // "2024-08-01",
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

      // ? Below if statement potentially needs to be moved as it's currently being called on every loop, if does need to be left in, refactor to DBResultAllSalahData?.length
      if (DBResultAllSalahData && DBResultAllSalahData.length > 0) {
        for (let i = 0; i < DBResultAllSalahData.length; i++) {
          if (DBResultAllSalahData[i].date === currentDate) {
            let salahName: SalahNamesType = DBResultAllSalahData[i].salahName;
            let salahStatus: SalahStatusType =
              DBResultAllSalahData[i].salahStatus;
            singleSalahObj.salahs[salahName] = salahStatus;
            // TODO: Add a conditional here, where 'if (salahStatus === "missed")'  only runs if the user has not turned the qadha salah setting off
            if (salahStatus === "missed") {
              if (DBResultAllSalahData[i].date in missedSalahObj) {
                missedSalahObj[DBResultAllSalahData[i].date].push(salahName);
              } else {
                missedSalahObj[DBResultAllSalahData[i].date] = [salahName];
              }
            }
          }
        }
      }

      singleSalahObjArr.push(singleSalahObj);
    }
    setFetchedSalahData([...singleSalahObjArr]);
    setMissedSalahList({ ...missedSalahObj });
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

  const [showIntroModal, setShowIntroModal] = useState(false);
  // const appRef = useRef();
  // console.log(appRef);
  // if (Capacitor.isNativePlatform()) {
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

  // const pageStyles: string = `pt-[9vh] pb-[2vh] bg-[color:var(--primary-color)] h-[90vh] overflow-x-hidden overflow-y-auto w-[93vw] mx-auto`;
  const pageStyles: string = `pt-[9vh] pb-[5rem] bg-[color:var(--primary-color)] overflow-x-hidden overflow-y-auto w-[93vw] mx-auto`;

  return (
    <BrowserRouter>
      <section className="app">
        <div className="fixed h-[9vh] z-20 flex justify-between w-full py-5 text-center header-wrap">
          {getMissedSalahCount(missedSalahList) > 0 && (
            <section>
              <MissedPrayersListBottomSheet
                dbConnection={dbConnection}
                checkAndOpenOrCloseDBConnection={
                  checkAndOpenOrCloseDBConnection
                }
                setShowMissedPrayersSheet={setShowMissedPrayersSheet}
                showMissedPrayersSheet={showMissedPrayersSheet}
                setMissedSalahList={setMissedSalahList}
                missedSalahList={missedSalahList}
              />

              <div
                className="flex items-center p-1 ml-2 bg-gray-800 rounded-lg"
                onClick={() => {
                  setShowMissedPrayersSheet(true);
                }}
              >
                <p
                  style={{
                    backgroundColor: prayerStatusColorsHexCodes["missed"],
                  }}
                  // ${prayerTableIndividualSquareStyles}
                  className={`w-[1.1rem] h-[1.1rem] rounded-md mr-2`}
                ></p>
                <p className="text-xs">
                  {getMissedSalahCount(missedSalahList)}
                </p>
              </div>
            </section>
          )}
          <h1 className="text-center w-[100%]">{heading}</h1>
          {/* <p>hi</p> */}
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
                setMissedSalahList={setMissedSalahList}
                // singleSalahObjArr={singleSalahObjArr}
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
                fetchDataFromDB={fetchDataFromDB}
                pageStyles={pageStyles}
                modifyDataInUserPreferencesTable={
                  modifyDataInUserPreferencesTable
                }
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                setShowChangelogModal={setShowChangelogModal}
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
            <Sheet.Header style={sheetHeaderHeight} />
            <Sheet.Content>
              {" "}
              <section className="p-5 text-center">
                <h1 className="text-4xl">I am a...</h1>
                <p
                  onClick={async () => {
                    // setUserGender("male");
                    setUserPreferences(
                      (userPreferences: userPreferencesType) => ({
                        ...userPreferences,
                        userGender: "male",
                      })
                    );
                    await modifyDataInUserPreferencesTable(
                      "male",
                      "userGender"
                    );
                    setShowIntroModal(false);
                    localStorage.setItem("existingUser", "existingUser");
                    localStorage.setItem("appVersion", LATEST_APP_VERSION);
                  }}
                  className="p-2 m-4 text-2xl text-white bg-blue-800 rounded-2xl"
                >
                  Brother
                </p>
                <p
                  onClick={async () => {
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
                    localStorage.setItem("existingUser", "existingUser");
                    localStorage.setItem("appVersion", LATEST_APP_VERSION);
                  }}
                  className="p-2 m-4 text-2xl text-white bg-pink-400 rounded-2xl"
                >
                  Sister
                </p>
              </section>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
        <NavBar />
        <BottomSheetChangelog
          setShowChangelogModal={setShowChangelogModal}
          showChangelogModal={showChangelogModal}
        />
      </section>
    </BrowserRouter>
  );
};

export default App;
