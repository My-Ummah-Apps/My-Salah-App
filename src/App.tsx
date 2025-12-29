import { useState, useEffect, useRef } from "react";
import { IonReactRouter } from "@ionic/react-router";

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";

import {
  homeOutline,
  settingsOutline,
  statsChartOutline,
  timeOutline,
} from "ionicons/icons";

import { Redirect } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";

import { LATEST_APP_VERSION } from "./utils/changelog";
import {
  checkNotificationPermissions,
  dictPreferencesDefaultValues,
  updateUserPrefs,
  setStatusAndNavBarBGColor,
} from "./utils/constants";
import {
  DBResultDataObjType,
  PreferenceObjType,
  userPreferencesType,
  SalahNamesType,
  SalahRecordType,
  SalahRecordsArrayType,
  SalahStatusType,
  SalahByDateObjType,
  streakDatesObjType,
  themeType,
  LocationsDataObjTypeArr,
} from "./types/types";

import { Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import {
  format,
  parse,
  eachDayOfInterval,
  differenceInDays,
  subDays,
  parseISO,
} from "date-fns";
import { PreferenceType } from "./types/types";

import useSQLiteDB from "./utils/useSqLiteDB";
// import { LocalNotifications } from "@capacitor/local-notifications";
import Onboarding from "./components/Onboarding";
import { Route } from "react-router-dom";
import MajorUpdateOverlay from "./components/MajorUpdateOverlay";
import SalahTimesPage from "./pages/SalahTimesPage";
import {
  fetchAllLocations,
  toggleDBConnection as toggleDBConnection,
} from "./utils/dbUtils";
import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";

const App = () => {
  const justLaunched = useRef(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMajorUpdateOverlay, setShowMajorUpdateOverlay] = useState(false);
  const [showMissedSalahsSheet, setShowMissedSalahsSheet] = useState(false);
  const [missedSalahList, setMissedSalahList] = useState<SalahByDateObjType>(
    {}
  );
  const [userLocations, setUserLocations] = useState<LocationsDataObjTypeArr>();
  const [isMultiEditMode, setIsMultiEditMode] = useState<boolean>(false);
  const [showJoyRideEditIcon, setShowJoyRideEditIcon] =
    useState<boolean>(false);
  const [streakDatesObjectsArr, setStreakDatesObjectsArr] = useState<
    streakDatesObjType[]
  >([]);
  const [activeStreakCount, setActiveStreakCount] = useState(0);
  const [fetchedSalahData, setFetchedSalahData] =
    useState<SalahRecordsArrayType>([]);

  const [userPreferences, setUserPreferences] = useState<userPreferencesType>(
    dictPreferencesDefaultValues
  );
  const [salahTimes, setSalahtimes] = useState({
    fajr: "",
    sunrise: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
  });
  const [theme, setTheme] = useState<themeType>("dark");

  const handleTheme = (theme?: themeType) => {
    let themeColor = theme ? theme : userPreferences.theme;

    setTheme(themeColor);
    let statusBarThemeColor: string = "#242424";

    if (themeColor === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      themeColor = media.matches ? "dark" : "light";
    }

    if (themeColor === "dark") {
      statusBarThemeColor = "#161515";
      document.body.classList.add("dark");
    } else if (themeColor === "light") {
      statusBarThemeColor = "#EDEDED";
      document.body.classList.remove("dark");
    }

    if (Capacitor.isNativePlatform()) {
      const statusBarIconsColor =
        statusBarThemeColor === "#EDEDED" ? Style.Light : Style.Dark;
      if (Capacitor.getPlatform() === "android" && justLaunched.current) {
        setTimeout(() => {
          setStatusAndNavBarBGColor(statusBarThemeColor, statusBarIconsColor);
          justLaunched.current = false;
        }, 750);
      } else {
        setStatusAndNavBarBGColor(statusBarThemeColor, statusBarIconsColor);
      }
    }

    return statusBarThemeColor;
  };

  useEffect(() => {
    if (
      localStorage.getItem("appVersion") &&
      localStorage.getItem("appVersion") !== LATEST_APP_VERSION
    ) {
      // setShowChangelogModal(true);
      // setShowMajorUpdateOverlay(true);
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  const {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    initialiseTables,
  } = useSQLiteDB();

  useEffect(() => {
    const initializeApp = async () => {
      if (isDatabaseInitialised === true) {
        const initialiseAndLoadData = async () => {
          await fetchDataFromDB();
        };
        initialiseAndLoadData();

        // handleTheme(userPreferences.theme);

        if (Capacitor.isNativePlatform()) {
          setTimeout(async () => {
            await SplashScreen.hide({ fadeOutDuration: 250 });
          }, 500);
        }
      }
    };

    initializeApp();
  }, [isDatabaseInitialised]);

  useEffect(() => {
    handleTheme(userPreferences.theme);
  }, [userPreferences.theme]);

  useEffect(() => {
    if (!isDatabaseInitialised) return;

    const calc = async () => {
      await calculateActiveLocationSalahTimes();
    };

    calc();
  }, [
    userPreferences.prayerCalculationMethod,
    userPreferences.madhab,
    userPreferences.prayerLatitudeRule,
    userPreferences.fajrAngle,
    userPreferences.ishaAngle,
    userPreferences.fajrAdjustment,
    userPreferences.dhuhrAdjustment,
    userPreferences.asrAdjustment,
    userPreferences.maghribAdjustment,
    userPreferences.ishaAdjustment,
  ]);

  useEffect(() => {
    let copyOfMissedSalahList: SalahByDateObjType = {};
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

  const fetchDataFromDB = async (isDBImported?: boolean) => {
    try {
      if (isDBImported) {
        await initialiseTables();
        await updateUserPrefs(
          dbConnection,
          "isExistingUser",
          "1",
          setUserPreferences
        );
      }

      await toggleDBConnection(dbConnection, "open");

      // const res = await dbConnection.current?.query(
      //   `SELECT name, type FROM sqlite_master WHERE type='table'`
      // );
      // console.log("tables: ", res?.values);

      let DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userPreferencesTable`
      );

      const DBResultAllSalahData = await dbConnection.current?.query(
        `SELECT * FROM salahDataTable`
      );

      // const DBResultLocations = await dbConnection.current?.query(
      //   `SELECT * FROM userLocationsTable`
      // );
      const DBResultLocations = await fetchAllLocations(dbConnection, true);

      // console.log("DBResultPreferences: ", DBResultPreferences?.values);

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
      if (!DBResultLocations || !DBResultLocations.values) {
        throw new Error(
          "DBResultLocations or !DBResultLocations.values do not exist"
        );
      }

      // const locations = await dbConnection.current?.query(
      //   `SELECT * FROM userLocationsTable`
      // );
      // console.log("Locations from DB: ", locations);
      setUserLocations(DBResultLocations);

      const userNotificationPermission = await checkNotificationPermissions();

      const notificationValue = DBResultPreferences.values.find(
        (row) => row.preferenceName === "dailyNotification"
      );

      const isExistingUser =
        DBResultPreferences.values.find(
          (row) => row.preferenceName === "isExistingUser"
        ) || "";

      if (isExistingUser === "" || isExistingUser.preferenceValue === "0") {
        // setShowIntroModal(true);
        setShowOnboarding(true);
      }

      if (
        userNotificationPermission !== "granted" &&
        notificationValue === "1"
      ) {
        try {
          await updateUserPrefs(
            dbConnection,
            "dailyNotification",
            "0",
            setUserPreferences
          );
          await toggleDBConnection(dbConnection, "open");

          // const locationPref = "location";
          // await dbConnection.current?.run(
          //   `DELETE FROM userPreferencesTable WHERE preferenceName = ?`,
          //   [locationPref]
          // );

          DBResultPreferences = await dbConnection.current?.query(
            `SELECT * FROM userPreferencesTable`
          );
        } catch (error) {
          console.error(
            "Error modifying dailyNotification value in database:",
            error
          );
        } finally {
          await toggleDBConnection(dbConnection, "close");
        }
      }
      try {
        if (!DBResultPreferences || !DBResultPreferences.values) {
          throw new Error(
            "DBResultPreferences or DBResultPreferences.values do not exist"
          );
        }
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
      await toggleDBConnection(dbConnection, "close");
    }
  };

  const handleUserPreferencesDataFromDB = async (
    DBResultPreferences: PreferenceObjType[]
  ) => {
    let DBResultPreferencesValues = DBResultPreferences;

    try {
      if (DBResultPreferencesValues.length === 0) {
        const params = Object.keys(dictPreferencesDefaultValues)
          .map((key) => {
            const value =
              dictPreferencesDefaultValues[key as keyof userPreferencesType];
            return [key, Array.isArray(value) ? value.join(",") : value];
          })
          .flat();

        const placeholders = Array(params.length / 2)
          .fill("(?, ?)")
          .join(", ");

        const insertQuery = `
        INSERT INTO userPreferencesTable (preferenceName, preferenceValue) 
        VALUES ${placeholders};
        `;

        await dbConnection.current?.run(insertQuery, params);
        const DBResultPreferencesQuery = await dbConnection.current?.query(
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
        const DBResultPreferencesQuery = await dbConnection.current?.query(
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
    }

    const assignPreference = async (
      preference: PreferenceType
    ): Promise<void> => {
      const preferenceQuery = DBResultPreferencesValues.find(
        (row) => row.preferenceName === preference
      );

      if (preferenceQuery) {
        const prefName = preferenceQuery.preferenceName;
        const prefValue = preferenceQuery.preferenceValue;

        if (prefName === "userStartDate") {
          userStartDateForSalahTrackingFunc = prefValue;
        }

        setUserPreferences((userPreferences: userPreferencesType) => ({
          ...userPreferences,
          [prefName]: prefName === "reasons" ? prefValue.split(",") : prefValue,
        }));

        await calculateActiveLocationSalahTimes();
      } else {
        console.log("preference: ", preference);

        await updateUserPrefs(
          dbConnection,
          preference,
          dictPreferencesDefaultValues[preference],
          setUserPreferences
        );

        await calculateActiveLocationSalahTimes();
      }
    };

    const batchAssignPreferences = async () => {
      for (const key of Object.keys(dictPreferencesDefaultValues)) {
        await assignPreference(key as keyof userPreferencesType);
      }
    };

    await batchAssignPreferences();
  };

  // useEffect(() => {
  //   const calculateTimes = async () => {
  //     await calculateActiveLocationSalahTimes();
  //   };

  //   calculateTimes();
  // }, [userLocations]);

  // ? Using userStartDateForSalahTrackingFunc like this is apparently bad practice, but for now its working
  let userStartDateForSalahTrackingFunc: string;
  useEffect(() => {
    userStartDateForSalahTrackingFunc = userPreferences.userStartDate;
  }, [userPreferences.userStartDate]);

  const handleSalahTrackingDataFromDB = async (
    DBResultAllSalahData: DBResultDataObjType[]
  ) => {
    const singleSalahObjArr: SalahRecordsArrayType = [];
    const missedSalahObj: SalahByDateObjType = {};
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

      // ? Below if statement potentially needs to be moved as it's currently being called on every loop, if does need to be left in, refactor to DBResultAllSalahData?.length
      if (DBResultAllSalahData && DBResultAllSalahData.length > 0) {
        for (let i = 0; i < DBResultAllSalahData.length; i++) {
          if (DBResultAllSalahData[i].date === currentDate) {
            let salahName: SalahNamesType = DBResultAllSalahData[i].salahName;
            let salahStatus: SalahStatusType =
              DBResultAllSalahData[i].salahStatus;
            singleSalahObj.salahs[salahName] = salahStatus;

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
    generateStreaks([...singleSalahObjArr]);
  };

  // const [activeLocation, setActiveLocation] = useState();

  const calculateActiveLocationSalahTimes = async () => {
    // if (!isDatabaseInitialised) return;

    const locations = await fetchAllLocations(dbConnection);

    const activeLocation = locations?.filter((loc) => loc.isSelected === 1)[0];

    const locale = navigator.language;

    const coordinates = new Coordinates(
      activeLocation?.latitude,
      activeLocation?.longitude
    );

    console.log("activeLocation: ", activeLocation);

    const params =
      CalculationMethod[
        userPreferences.prayerCalculationMethod || "MuslimWorldLeague"
      ]();

    console.log(
      "userPreferences.prayerCalculationMethod: ",
      userPreferences.prayerCalculationMethod
    );

    console.log("params: ", params);

    params.madhab = userPreferences.madhab;
    params.highLatitudeRule = userPreferences.prayerLatitudeRule;
    params.fajrAngle = Number(userPreferences.fajrAngle);
    params.ishaAngle = Number(userPreferences.ishaAngle);
    params.methodAdjustments.fajr = Number(userPreferences.fajrAdjustment);
    params.methodAdjustments.dhuhr = Number(userPreferences.dhuhrAdjustment);
    params.methodAdjustments.asr = Number(userPreferences.asrAdjustment);
    params.methodAdjustments.maghrib = Number(
      userPreferences.maghribAdjustment
    );
    params.methodAdjustments.isha = Number(userPreferences.ishaAdjustment);

    const date = new Date();

    const extractSalahTime = (
      salah: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"
    ) => {
      const salahTime = new PrayerTimes(coordinates, date, params)[salah];

      return salahTime.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    setSalahtimes({
      fajr: extractSalahTime("fajr"),
      sunrise: extractSalahTime("sunrise"),
      dhuhr: extractSalahTime("dhuhr"),
      asr: extractSalahTime("asr"),
      maghrib: extractSalahTime("maghrib"),
      isha: extractSalahTime("isha"),
    });

    console.log("salahTimes: ", salahTimes);

    let allSalahTimes = new PrayerTimes(coordinates, date, params);

    let next = allSalahTimes.nextPrayer();
    let nextPrayerTime;

    // const sunnahTimes = new SunnahTimes(allSalahTimes);
    // console.log("sunnahTimes: ", sunnahTimes);

    if (next === "none") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      allSalahTimes = new PrayerTimes(coordinates, tomorrow, params);

      next = allSalahTimes.nextPrayer();
      console.log("next: ", next);
      nextPrayerTime = allSalahTimes.timeForPrayer(next);
      console.log("nextPrayerTime: ", nextPrayerTime);
    } else {
      nextPrayerTime = allSalahTimes.timeForPrayer(next);
      console.log("nextPrayerTime: ", nextPrayerTime);
      console.log("next: ", next);
    }

    const currentPrayer = allSalahTimes.currentPrayer();
    console.log("currentPrayer: ", currentPrayer);

    const now = new Date();
    const diffMs = nextPrayerTime.getTime() - now.getTime();

    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    console.log("Next prayer:", next);
    console.log(`In ${hours}h ${minutes}m ${seconds}s`);
  };

  const generateStreaks = (fetchedSalahData: SalahRecordsArrayType) => {
    const reversedFetchedSalahDataArr = fetchedSalahData.reverse();
    const streakDatesObjectsArray: streakDatesObjType[] = [];
    const streakDatesArr: Date[] = [];
    let excusedDays = 0;
    const todaysDate = new Date();
    let isActiveStreak = false;

    const isConsecutiveDay = (date2: Date, date1: Date) =>
      differenceInDays(date1, date2) === 1;

    const streakBreakingStatuses = ["missed", "late", ""];

    const isStreakBreakingStatus = (statusesArr: SalahStatusType[]) =>
      statusesArr.some((status) => streakBreakingStatuses.includes(status));

    for (
      let i = reversedFetchedSalahDataArr.length > 1 ? 1 : 0;
      i < reversedFetchedSalahDataArr.length;
      i++
    ) {
      const salahStatuses = Object.values(
        reversedFetchedSalahDataArr[i].salahs
      );

      if (reversedFetchedSalahDataArr.length === 1) {
        const salahStatuses = Object.values(
          reversedFetchedSalahDataArr[0].salahs
        );

        if (!isStreakBreakingStatus(salahStatuses)) {
          if (salahStatuses.includes("excused")) {
            excusedDays += 1;
          }
          streakDatesArr.push(todaysDate);

          isActiveStreak = true;
          handleEndOfStreak(
            streakDatesArr,
            isActiveStreak,
            excusedDays,
            streakDatesObjectsArray
          );
          excusedDays = 0;
        }
        return;
      }

      const previousDate = parseISO(reversedFetchedSalahDataArr[i - 1].date);
      const currentDate = parseISO(reversedFetchedSalahDataArr[i].date);
      const firstDateSalahStatuses = Object.values(
        reversedFetchedSalahDataArr[0].salahs
      );

      if (
        isConsecutiveDay(previousDate, todaysDate) &&
        !salahStatuses.includes("late") &&
        !salahStatuses.includes("missed")
      ) {
        isActiveStreak = true;
      }
      if (
        isConsecutiveDay(previousDate, currentDate) &&
        !isStreakBreakingStatus(salahStatuses)
      ) {
        if (salahStatuses.includes("excused")) {
          excusedDays += 1;
        }

        i === 1 && !isStreakBreakingStatus(firstDateSalahStatuses)
          ? streakDatesArr.push(previousDate, currentDate)
          : streakDatesArr.push(currentDate);

        if (isConsecutiveDay(previousDate, todaysDate)) {
          handleEndOfStreak(
            streakDatesArr,
            isActiveStreak,
            excusedDays,
            streakDatesObjectsArray
          );
          excusedDays = 0;
        }
      } else {
        handleEndOfStreak(
          streakDatesArr,
          isActiveStreak,
          excusedDays,
          streakDatesObjectsArray
        );
        excusedDays = 0;
      }
    }
  };

  const handleEndOfStreak = (
    streakDatesArr: Date[],
    isActiveStreak: boolean,
    excusedDays: number,
    streakDatesObjectsArray: streakDatesObjType[]
  ) => {
    // console.log("excusedDays: ", excusedDays);
    // console.log("streakDatesArr: ", streakDatesArr.length);

    // if (excusedDays === streakDatesArr.length) return;
    if (streakDatesArr.length > 0) {
      const streakDaysAmount =
        streakDatesArr.length === 1
          ? 1
          : differenceInDays(
              streakDatesArr[streakDatesArr.length - 1],
              subDays(streakDatesArr[0], 1)
            );
      if (isActiveStreak) {
        setActiveStreakCount(streakDaysAmount - excusedDays);
      } else if (!isActiveStreak) {
        setActiveStreakCount(0);
      }

      let streakDatesObj: streakDatesObjType = {
        startDate: streakDatesArr[0],
        endDate: streakDatesArr[streakDatesArr.length - 1],
        days: streakDaysAmount - excusedDays,
        isActive: isActiveStreak,
        excusedDays: excusedDays,
      };

      streakDatesObjectsArray.push(streakDatesObj);

      setStreakDatesObjectsArr(
        streakDatesObjectsArray
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
          .reverse()
      );
      excusedDays = 0;
      streakDatesArr.length = 0;
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs className="app">
          <IonRouterOutlet
          //  animated={false}
          >
            <Route
              exact
              path="/HomePage"
              render={() => (
                <HomePage
                  dbConnection={dbConnection}
                  setUserPreferences={setUserPreferences}
                  setShowJoyRideEditIcon={setShowJoyRideEditIcon}
                  showJoyRideEditIcon={showJoyRideEditIcon}
                  userPreferences={userPreferences}
                  setFetchedSalahData={setFetchedSalahData}
                  fetchedSalahData={fetchedSalahData}
                  setMissedSalahList={setMissedSalahList}
                  setShowMissedSalahsSheet={setShowMissedSalahsSheet}
                  showMissedSalahsSheet={showMissedSalahsSheet}
                  missedSalahList={missedSalahList}
                  setIsMultiEditMode={setIsMultiEditMode}
                  isMultiEditMode={isMultiEditMode}
                  activeStreakCount={activeStreakCount}
                  generateStreaks={generateStreaks}
                />
              )}
            />
            <Route
              exact
              path="/SettingsPage"
              render={() => (
                <SettingsPage
                  sqliteConnection={sqliteConnection}
                  dbConnection={dbConnection}
                  setUserPreferences={setUserPreferences}
                  theme={theme}
                  handleTheme={handleTheme}
                  fetchDataFromDB={fetchDataFromDB}
                  userPreferences={userPreferences}
                />
              )}
            />
            <Route
              exact
              path="/StatsPage"
              render={() => (
                <StatsPage
                  dbConnection={dbConnection}
                  userPreferences={userPreferences}
                  fetchedSalahData={fetchedSalahData}
                  activeStreakCount={activeStreakCount}
                  streakDatesObjectsArr={streakDatesObjectsArr}
                />
              )}
            />
            <Route
              exact
              path="/SalahTimesPage"
              render={() => (
                <SalahTimesPage
                  dbConnection={dbConnection}
                  setUserPreferences={setUserPreferences}
                  userPreferences={userPreferences}
                  setUserLocations={setUserLocations}
                  userLocations={userLocations}
                  salahTimes={salahTimes}
                  calculateActiveLocationSalahTimes={
                    calculateActiveLocationSalahTimes
                  }
                />
              )}
            />
          </IonRouterOutlet>

          <IonTabBar id="nav-bar" slot="bottom">
            <IonTabButton tab="HomePage" href="/HomePage">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="StatsPage" href="/StatsPage">
              <IonIcon icon={statsChartOutline} />
              <IonLabel>Stats</IonLabel>
            </IonTabButton>
            <IonTabButton tab="SalahTimesPage" href="/SalahTimesPage">
              <IonIcon icon={timeOutline} />
              <IonLabel>Salah Times</IonLabel>
            </IonTabButton>
            <IonTabButton tab="SettingsPage" href="/SettingsPage">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <Route exact path="/" render={() => <Redirect to="/HomePage" />} />
      </IonReactRouter>
      {showOnboarding && (
        <Onboarding
          setShowOnboarding={setShowOnboarding}
          setShowJoyRideEditIcon={setShowJoyRideEditIcon}
          dbConnection={dbConnection}
          setUserPreferences={setUserPreferences}
        />
      )}
      {showMajorUpdateOverlay && (
        <MajorUpdateOverlay
          setShowMajorUpdateOverlay={setShowMajorUpdateOverlay}
        />
      )}
    </IonApp>
  );
};

export default App;
