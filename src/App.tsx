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
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

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
    reasonsArr: [],
    showMissedSalahCount: "",
    haptics: "",
    isExistingUser: "0",
  });

  const {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();

  // const [DBResultAllSalahData, setDBResultAllSalahData] =
  //   useState<DBSQLiteValues>();

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
        modifyDataInUserPreferencesTable("1", "isExistingUser");
        setUserPreferences({ ...userPreferences, isExistingUser: "1" });
        localStorage.removeItem("existingUser");
      }
      // const test = await dbConnection.current.query(
      //   `SELECT * FROM salahDataTable`
      // );
      // setDBResultAllSalahData(
      //   await dbConnection.current.query(`SELECT * FROM salahDataTable`)
      // );
      const DBResultAllSalahData = await dbConnection.current.query(
        `SELECT * FROM salahDataTable`
      );

      let DBResultPreferences = await dbConnection.current.query(
        `SELECT * FROM userPreferencesTable`
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

      console.log("DBResultPreferences.values: ", DBResultPreferences.values);

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

    try {
      if (!dbConnection || !dbConnection.current) {
        throw new Error("!dbConnection or !dbConnection.current do not exist");
      }
      await checkAndOpenOrCloseDBConnection("open");

      if (DBResultPreferencesValues.length === 0) {
        const userStartDate = format(new Date(), "yyyy-MM-dd");
        // const remove_below = [];
        // const userStartDate = "2023-01-01";

        const insertQuery = `
            INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) 
            VALUES 
            (?, ?),
            (?, ?),
            (?, ?),
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
            "showMissedSalahCount", "1",
            "isExistingUser", "0"
          ];

        await dbConnection.current.run(insertQuery, params);
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
      } else if (DBResultPreferencesValues.length > 0) {
        const query = `INSERT OR IGNORE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES ("showMissedSalahCount", "1")`;
        await dbConnection.current.run(query);
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
    console.log(
      "DBResultPreferencesValues: ",
      DBResultPreferencesValues.values
    );

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
    const showMissedSalahCount = assignPreference("showMissedSalahCount");
    const isExistingUser = assignPreference("isExistingUser");

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
        reasonsArr: reasons.preferenceValue.split(","),
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

    if (showMissedSalahCount) {
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        showMissedSalahCount: showMissedSalahCount.preferenceValue,
      }));
    } else {
      console.error("showMissedSalahCount row not found");
    }
    if (isExistingUser) {
      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        isExistingUser: "1",
      }));
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
    preferenceValue: string,
    preferenceName: PreferenceType
  ) => {
    try {
      await checkAndOpenOrCloseDBConnection("open");
      // const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      // await dbConnection.current.run(query, [preferenceValue, preferenceName]);
      await dbConnection?.current?.run(query, [
        preferenceName,
        preferenceValue,
      ]);
      // setUserPreferences({
      //   ...userPreferences,
      //   [preferenceName]: preferenceValue,
      // });
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }
  };

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

  const swiperRef = useRef(null);

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
                          "male",
                          "userGender"
                        );
                        // setShowIntroModal(false);
                        // modifyDataInUserPreferencesTable("1", "isExistingUser");
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
                          "female",
                          "userGender"
                        );
                        // modifyDataInUserPreferencesTable("1", "isExistingUser");
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
                    <p className="">
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
                            "21:00",
                            "dailyNotificationTime"
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
