import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
import { LATEST_APP_VERSION } from "./utils/changelog";
import {
  checkNotificationPermissions,
  getMissedSalahCount,
  scheduleDailyNotification,
  sheetBackdropColor,
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
  salahReasonsOverallNumbersType,
} from "./types/types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { format, parse, eachDayOfInterval } from "date-fns";
import { PreferenceType } from "./types/types";

import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
// import ResourcesPage from "./pages/ResourcesPage";
import StatsPage from "./pages/StatsPage";
// import QiblahDirection from "./pages/QiblahDirection";
// import StreakCount from "./components/Stats/StreakCount";
import useSQLiteDB from "./utils/useSqLiteDB";
import BottomSheetChangelog from "./components/BottomSheets/BottomSheetChangeLog";
import { LocalNotifications } from "@capacitor/local-notifications";
import MissedSalahCounter from "./components/Stats/MissedSalahCounter";

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
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [showMissedPrayersSheet, setShowMissedPrayersSheet] = useState(false);
  const [missedSalahList, setMissedSalahList] = useState<MissedSalahObjType>(
    {}
  );
  const [isMultiEditMode, setIsMultiEditMode] = useState<boolean>(false);

  const [salahReasonsOverallNumbers, setSalahReasonsOverallNumbers] =
    useState<salahReasonsOverallNumbersType>({
      "male-alone": {},
      late: {},
      missed: {},
    });

  useEffect(() => {
    if (
      localStorage.getItem("appVersion") &&
      localStorage.getItem("appVersion") !== LATEST_APP_VERSION
    ) {
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
    haptics: "0",
    reasons: [],
    showMissedSalahCount: "",
    isExistingUser: "",
    isMissedSalahToolTipShown: "",
    appLaunchCount: "",
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
  // let DBResultAllSalahData: DBSQLiteValues;

  const fetchDataFromDB = async () => {
    try {
      await checkAndOpenOrCloseDBConnection("open");

      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection or dbConnection.current do not exist");
      }
      // ! Remove this once some time has passed, as its just for migrating beta testers data
      if (localStorage.getItem("existingUser")) {
        console.log("existingUser key exists in localstorage, amending DB");

        await modifyDataInUserPreferencesTable("isExistingUser", "1");
        await modifyDataInUserPreferencesTable(
          "isMissedSalahToolTipShown",
          "1"
        );
        localStorage.removeItem("existingUser");
      }

      const DBResultAllSalahData = await dbConnection.current.query(
        `SELECT * FROM salahDataTable`
      );

      let DBResultPreferences = await dbConnection.current.query(
        `SELECT * FROM userPreferencesTable`
      );

      console.log(
        "DBResultPreferences in fetchDataFromDB: ",
        DBResultPreferences
      );

      if (!DBResultPreferences || !DBResultPreferences.values) {
        throw new Error(
          "DBResultPreferences or DBResultPreferences.values do not exist"
        );
      }
      if (!DBResultAllSalahData || !DBResultAllSalahData.values) {
        throw new Error(
          "DBResultAllSalahData or !DBResultAllSalahData.values do not exist"
        );
      }

      const userNotificationPermission = await checkNotificationPermissions();

      const notificationValue = DBResultPreferences.values.find(
        (row) => row.preferenceName === "dailyNotification"
      );

      let isExistingUser =
        DBResultPreferences.values.find(
          (row) => row.preferenceName === "isExistingUser"
        ) || "";

      if (isExistingUser === "" || isExistingUser.preferenceValue === "0") {
        setShowIntroModal(true);
      }

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
      } // * Up until here, remove once its confirmed that this issue (noted above) only occurs when app is being installed from Android Studio and not the Play Store

      if (
        userNotificationPermission !== "granted" &&
        notificationValue === "1"
      ) {
        try {
          await modifyDataInUserPreferencesTable("dailyNotification", "0");
          await checkAndOpenOrCloseDBConnection("open");
          DBResultPreferences = await dbConnection.current.query(
            `SELECT * FROM userPreferencesTable`
          );
        } catch (error) {
          console.error(
            "Error modifying dailyNotification value in database:",
            error
          );
        } finally {
          await checkAndOpenOrCloseDBConnection("close");
        }
      }
      try {
        await handleUserPreferencesDataFromDB(
          DBResultPreferences.values as PreferenceObjType[]
        );

        await handleSalahTrackingDataFromDB(DBResultAllSalahData.values);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      checkAndOpenOrCloseDBConnection("close");
    }
  };

  const handleUserPreferencesDataFromDB = async (
    DBResultPreferences: PreferenceObjType[]
  ) => {
    let DBResultPreferencesValues = DBResultPreferences;
    // ! Remove below once the ability for users to remove and add their own reasons is introduced
    const latestReasons =
      "Alarm,Education,Caregiving,Emergency,Family/Friends,Gaming,Guests,Health,Leisure,Shopping,Sleep,Sports,Travel,TV,Other,Work";

    try {
      if (!dbConnection || !dbConnection.current) {
        throw new Error("!dbConnection or !dbConnection.current do not exist");
      }
      await checkAndOpenOrCloseDBConnection("open");

      // if (!DBResultPreferencesQuery || !DBResultPreferencesQuery.values) {
      //   throw new Error(
      //     "No values returned from the DBResultPreferencesQuery."
      //   );
      // }
      // ! Should this not be (!isExistingUser) ?
      if (DBResultPreferencesValues.length === 0) {
        console.log(
          "DBResultPreferencesValues.length is 0, inserting values into DB"
        );

        const userStartDate = format(new Date(), "yyyy-MM-dd");

        // prettier-ignore
        const params = [
            "userGender", "male",
            "userStartDate", userStartDate,
            "dailyNotification", "0",
            "dailyNotificationTime", "21:00",
            "haptics", "0",
            "reasons", latestReasons,
            "showMissedSalahCount", "1",
            "isExistingUser", "0",
            "isMissedSalahToolTipShown", "0",
            "appLaunchCount", "0"
          ];

        const placeholders = Array(params.length / 2)
          .fill("?, ?")
          .join(", ");

        const insertQuery = `
        INSERT INTO userPreferencesTable (preferenceName, preferenceValue) 
        VALUES ${placeholders};
        `;

        await dbConnection.current.run(insertQuery, params);
        const DBResultPreferencesQuery = await dbConnection.current.query(
          `SELECT * FROM userPreferencesTable`
        );
        DBResultPreferencesValues =
          DBResultPreferencesQuery.values as PreferenceObjType[];

        console.log(
          "DBResultPreferencesValues AFTER NEW USER INSERTION: ",
          DBResultPreferencesValues
        );
        // ! Should this not be (isExistingUser) ?
      } else if (DBResultPreferencesValues.length > 0) {
        console.log("THIS IS AN EXISTING USER");

        const query1 = `INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES
        ("showMissedSalahCount", "1"),
        ("appLaunchCount", "0"),
        ("isMissedSalahToolTipShown", "0")`;

        await dbConnection.current.run(query1);

        const query2 = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
        await dbConnection.current.run(query2, [latestReasons, "reasons"]);

        const DBResultPreferencesQuery = await dbConnection.current.query(
          `SELECT * FROM userPreferencesTable`
        );

        if (!DBResultPreferencesQuery || !DBResultPreferencesQuery.values) {
          throw new Error(
            "No values returned from the DBResultPreferencesQuery."
          );
        }

        DBResultPreferencesValues =
          DBResultPreferencesQuery.values as PreferenceObjType[];
      }
    } catch (error) {
      console.error(error);
    } finally {
      checkAndOpenOrCloseDBConnection("close");
    }

    const dictPreferencesDefaultValues = {
      userGender: "male",
      userStartDate: format(new Date(), "yyyy-MM-dd"),
      dailyNotification: "0",
      dailyNotificationTime: "21:00",
      haptics: "0",
      reasons: latestReasons,
      showMissedSalahCount: "1",
      isExistingUser: "0",
      isMissedSalahToolTipShown: "0",
      appLaunchCount: "0",
    };

    const assignPreference = (preference: PreferenceType): void => {
      const preferenceQuery = DBResultPreferencesValues.find(
        (row) => row.preferenceName === preference
      );

      if (preferenceQuery) {
        const prefName = preferenceQuery.preferenceName;
        let prefValue = preferenceQuery.preferenceValue;

        if (prefName === "reasons") {
          prefValue = prefValue.split(",");
        }
        // ! should this be userStartDate or "userStartDate"?
        if (prefName === "userStartDate") {
          userStartDateForSalahTrackingFunc = prefValue;
        }

        setUserPreferences((userPreferences: userPreferencesType) => ({
          ...userPreferences,
          [prefName]: prefValue,
        }));
      } else {
        modifyDataInUserPreferencesTable(
          preference,
          dictPreferencesDefaultValues[preference]
        );
      }
    };

    // const arr = params.filter((_, i) => i % 2 === 0)

    Object.keys(dictPreferencesDefaultValues).forEach((key) => {
      assignPreference(key);
    });
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

      // type salahReasonsType = {
      //   "male-alone": string[];
      //   late: string[];
      //   missed: string[];
      // };
      const salahReasonsOverallNumbers: salahReasonsOverallNumbersType = {
        "male-alone": {},
        late: {},
        missed: {},
      };

      let maleAloneReasons: any[] = [];
      let lateReasons: any[] = [];
      let missedReasons: any[] = [];

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

          if (
            DBResultAllSalahData[i].salahStatus !== "group" &&
            DBResultAllSalahData[i].salahStatus !== "excused" &&
            DBResultAllSalahData[i].salahStatus !== "female-alone" &&
            DBResultAllSalahData[i].reasons !== ""
          ) {
            const reasons = DBResultAllSalahData[i].reasons.split(", ");
            // console.log("reasons: ", reasons);
            if (DBResultAllSalahData[i].salahStatus === "male-alone") {
              maleAloneReasons.push(reasons);
            } else if (DBResultAllSalahData[i].salahStatus === "late") {
              lateReasons.push(reasons);
            } else if (DBResultAllSalahData[i].salahStatus === "missed") {
              missedReasons.push(reasons);
            }
          }
        }

        maleAloneReasons = maleAloneReasons.flat();
        lateReasons = lateReasons.flat();
        missedReasons = missedReasons.flat();

        // console.log("maleAloneReasons: ", maleAloneReasons);
        // console.log("lateReasons: ", lateReasons);
        // console.log("missedReasons: ", missedReasons);

        maleAloneReasons.forEach((item: string) => {
          if (item === "") return;
          if (!salahReasonsOverallNumbers["male-alone"][item]) {
            salahReasonsOverallNumbers["male-alone"][item] = 0;
          }
          salahReasonsOverallNumbers["male-alone"][item] += 1;
        });
        lateReasons.forEach((item) => {
          if (item === "") return;
          if (!salahReasonsOverallNumbers["late"][item]) {
            salahReasonsOverallNumbers["late"][item] = 0;
          }
          salahReasonsOverallNumbers["late"][item] += 1;
        });
        missedReasons.forEach((item) => {
          if (item === "") return;
          if (!salahReasonsOverallNumbers["missed"][item]) {
            salahReasonsOverallNumbers["missed"][item] = 0;
          }
          salahReasonsOverallNumbers["missed"][item] += 1;
        });
        setSalahReasonsOverallNumbers(salahReasonsOverallNumbers);
      }

      singleSalahObjArr.push(singleSalahObj);
    }

    setFetchedSalahData([...singleSalahObjArr]);
    setMissedSalahList({ ...missedSalahObj });
  };

  const modifyDataInUserPreferencesTable = async (
    preferenceName: PreferenceType,
    preferenceValue: string
  ) => {
    try {
      await checkAndOpenOrCloseDBConnection("open");
      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection or dbConnection.current does not exist");
      }
      // const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
      // let query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      // const query =
      //   preferenceName === "reasons"
      //     ? `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`
      //     : `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;

      if (preferenceName === "reasons") {
        console.log("Reasons here, and its: ", preferenceValue);
        const test = await dbConnection.current?.query(
          `SELECT * FROM userPreferencesTable`
        );
        console.log("PREFERENCES IN DB: ", test);
        const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
        await dbConnection.current.run(query, [
          preferenceValue,
          preferenceName,
        ]);
      } else {
        // ! Continue from here, why is it that when user imports existing data, they keep being shown the intro screens even on app re-launches?
        console.log(
          "PreferenceName: ",
          preferenceName,
          "changing to: ",
          preferenceValue
        );

        const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
        await dbConnection.current.run(query, [
          preferenceName,
          preferenceValue,
        ]);
      }

      // await dbConnection.current.run(query, [preferenceValue, preferenceName]);

      setUserPreferences({
        ...userPreferences,
        [preferenceName]:
          preferenceName === "reasons"
            ? preferenceValue.split(",")
            : preferenceValue,
      });
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }
  };

  useEffect(() => {
    console.log("userPreferences IN USEEFFECT: ", userPreferences);
  }, [userPreferences]);

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

  const swiperRef = useRef<SwiperInstance | null>(null);

  const handleGenderSelect = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <BrowserRouter>
      <section className="app">
        <section className="fixed h-[9vh] z-20 w-full py-5 header-wrap">
          {getMissedSalahCount(missedSalahList) > 0 &&
          heading === "Home" &&
          userPreferences.showMissedSalahCount === "1" ? (
            <MissedSalahCounter
              setShowMissedPrayersSheet={setShowMissedPrayersSheet}
              isMultiEditMode={isMultiEditMode}
              missedSalahList={missedSalahList}
              modifyDataInUserPreferencesTable={
                modifyDataInUserPreferencesTable
              }
              userPreferences={userPreferences}
            />
          ) : null}

          <h1 className="text-center">{heading}</h1>
          {/* <div className={`w-[1.1rem] h-[1.1rem] rounded-md mr-2`}></div> */}
          {/* <StreakCount styles={{ backgroundColor: "grey" }} /> */}
        </section>
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
                modifyDataInUserPreferencesTable={
                  modifyDataInUserPreferencesTable
                }
                renderTable={renderTable}
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                setFetchedSalahData={setFetchedSalahData}
                fetchedSalahData={fetchedSalahData}
                setMissedSalahList={setMissedSalahList}
                setHeading={setHeading}
                pageStyles={pageStyles}
                setShowMissedPrayersSheet={setShowMissedPrayersSheet}
                showMissedPrayersSheet={showMissedPrayersSheet}
                missedSalahList={missedSalahList}
                setIsMultiEditMode={setIsMultiEditMode}
                isMultiEditMode={isMultiEditMode}
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
                // @ts-ignore
                salahReasonsOverallNumbers={salahReasonsOverallNumbers}
                // DBResultAllSalahData={DBResultAllSalahData}
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
            <Sheet.Content style={{ justifyContent: "center" }}>
              {" "}
              <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                style={{ margin: 0 }}
                spaceBetween={50}
                slidesPerView={1}
                allowTouchMove={false}
                // navigation={{
                //   nextEl: ".swiper-button-next",
                //   prevEl: ".swiper-button-prev",
                // }}
                modules={[Pagination, Navigation]}
                // pagination={{ clickable: true }}
              >
                // ! For some reason, when tapping brother or sister inthe
                sheet, the isExistingUser flag in the DB chnges from 0 to 1
                <SwiperSlide>
                  <section className="p-5">
                    <h1 className="text-4xl">I am a...</h1>
                    <p
                      className="py-2 my-4 text-2xl text-center text-white bg-blue-800 rounded-2xl"
                      onClick={async () => {
                        handleGenderSelect();
                        setUserPreferences(
                          (userPreferences: userPreferencesType) => ({
                            ...userPreferences,
                            userGender: "male",
                          })
                        );
                        await modifyDataInUserPreferencesTable(
                          "userGender",
                          "male"
                        );

                        localStorage.setItem("appVersion", LATEST_APP_VERSION);
                      }}
                    >
                      Brother
                    </p>
                    <p
                      className="py-2 text-2xl text-center text-white bg-purple-900 rounded-2xl"
                      onClick={async () => {
                        handleGenderSelect();
                        setUserPreferences(
                          (userPreferences: userPreferencesType) => ({
                            ...userPreferences,
                            userGender: "female",
                          })
                        );
                        await modifyDataInUserPreferencesTable(
                          "userGender",
                          "female"
                        );

                        localStorage.setItem("appVersion", LATEST_APP_VERSION);
                      }}
                    >
                      Sister
                    </p>
                  </section>
                </SwiperSlide>
                <SwiperSlide>
                  <section className="m-4 text-center">
                    <h1 className="mb-2 text-2xl font-bold">
                      Stay Consistent with Your Salah
                    </h1>
                    <p>
                      A simple daily reminder to record your prayer statuses and
                      stay on track with your goals
                    </p>
                  </section>
                  <section className="flex flex-col p-5">
                    <button
                      onClick={async () => {
                        const permission =
                          await LocalNotifications.requestPermissions();
                        if (permission.display === "granted") {
                          console.log("Permission granted");
                          setShowIntroModal(false);
                          scheduleDailyNotification(21, 0);
                          modifyDataInUserPreferencesTable(
                            "dailyNotificationTime",
                            "21:00"
                          );
                        } else {
                          setShowIntroModal(false);
                          console.log("Permissions not granted");
                        }
                      }}
                      className="py-3 m-2 text-center text-white bg-blue-600 rounded-2xl"
                    >
                      Allow Daily Notification
                    </button>
                    <button
                      onClick={() => {
                        setShowIntroModal(false);
                      }}
                      className="py-3 m-2 text-center text-white rounded-2xl"
                    >
                      Maybe Later
                    </button>
                  </section>
                </SwiperSlide>
              </Swiper>
              {/* <section className="flex justify-end m-2">
                <div className="swiper-button-prev ">Prev</div>
                <div className="swiper-button-next">Next</div>
              </section> */}
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop style={sheetBackdropColor} />
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
