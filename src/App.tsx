import { useState, useEffect } from "react";
import { IonReactRouter } from "@ionic/react-router";
//@ts-ignore
// import { disableBodyScroll } from "body-scroll-lock";
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
} from "ionicons/icons";

import { Redirect } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";

import { LATEST_APP_VERSION } from "./utils/changelog";
import {
  checkNotificationPermissions,
  dictPreferencesDefaultValues,
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
import { LocalNotifications } from "@capacitor/local-notifications";
import Onboarding from "./components/Onboarding";
import { Route } from "react-router-dom";

// const location = useLocation();

const App = () => {
  // useEffect(() => {
  //   disableBodyScroll(document.body);
  // }, []);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMissedSalahsSheet, setShowMissedSalahsSheet] = useState(false);
  const [missedSalahList, setMissedSalahList] = useState<SalahByDateObjType>(
    {}
  );
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
  const [theme, setTheme] = useState<themeType>("dark");

  const handleTheme = (theme?: themeType) => {
    let themeColor = theme ? theme : userPreferences.theme;

    setTheme(themeColor);
    let statusBarThemeColor: string = "#242424";

    if (themeColor === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      themeColor = media ? "dark" : "light";
    }

    if (themeColor === "dark") {
      statusBarThemeColor = "#242424";

      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBGColor(statusBarThemeColor, Style.Dark);
      }
      document.body.classList.add("dark");
    } else if (themeColor === "light") {
      statusBarThemeColor = "#EDEDED";

      if (Capacitor.isNativePlatform()) {
        setStatusAndNavBarBGColor(statusBarThemeColor, Style.Light);
      }
      console.log("REMOVING DARK CLASS");

      document.body.classList.remove("dark");
    }

    return statusBarThemeColor;
  };

  useEffect(() => {
    handleTheme(theme);
    // setTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (
      localStorage.getItem("appVersion") &&
      localStorage.getItem("appVersion") !== LATEST_APP_VERSION
    ) {
      if (Capacitor.getPlatform() === "ios") {
        // setShowChangelogModal(true);
      }
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  const {
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
    checkAndOpenOrCloseDBConnection,
  } = useSQLiteDB();

  useEffect(() => {
    const initializeApp = async () => {
      const STATUS_AND_NAV_BAR_COLOR = "#161515";
      if (Capacitor.getPlatform() === "android") {
        setTimeout(() => {
          setStatusAndNavBarBGColor(STATUS_AND_NAV_BAR_COLOR, Style.Dark);
          // StatusBar.setBackgroundColor({ color: STATUS_AND_NAV_BAR_COLOR });
          // NavigationBar.setColor({ color: STATUS_AND_NAV_BAR_COLOR });
        }, 750);
      }

      if (isDatabaseInitialised === true) {
        const initialiseAndLoadData = async () => {
          await fetchDataFromDB();
        };
        initialiseAndLoadData();

        setTimeout(async () => {
          await SplashScreen.hide({ fadeOutDuration: 250 });
        }, 500);
      }
    };

    initializeApp();
  }, [isDatabaseInitialised]);

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
        await modifyDataInUserPreferencesTable("isExistingUser", "1");
      }

      await checkAndOpenOrCloseDBConnection("open");

      let DBResultPreferences = await dbConnection.current?.query(
        `SELECT * FROM userPreferencesTable`
      );
      console.log("DBResultPreferences: ", DBResultPreferences?.values);

      const DBResultAllSalahData = await dbConnection.current?.query(
        `SELECT * FROM salahDataTable`
      );

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

      const userNotificationPermission = await checkNotificationPermissions();

      const notificationValue = DBResultPreferences.values.find(
        (row) => row.preferenceName === "dailyNotification"
      );

      // const themeValue = DBResultPreferences.values.find(
      //   (row) => row.preferenceName === "theme"
      // );

      // handleTheme(themeValue.preferenceValue);

      const isExistingUser =
        DBResultPreferences.values.find(
          (row) => row.preferenceName === "isExistingUser"
        ) || "";

      if (isExistingUser === "" || isExistingUser.preferenceValue === "0") {
        // setShowIntroModal(true);
        setShowOnboarding(true);
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
              body: `Did you log your Salah today?`,
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

          DBResultPreferences = await dbConnection.current?.query(
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
      checkAndOpenOrCloseDBConnection("close");
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

      //       const themeValue = DBResultPreferencesValues.find(
      //   (row) => row.preferenceName === "theme"
      // );

      // handleTheme(themeValue.preferenceValue);
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
      } else {
        await modifyDataInUserPreferencesTable(
          preference,
          dictPreferencesDefaultValues[preference]
        );
      }
    };

    const batchAssignPreferences = async () => {
      for (const key of Object.keys(dictPreferencesDefaultValues)) {
        await assignPreference(key as keyof userPreferencesType);
      }
    };

    await batchAssignPreferences();
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

  const modifyDataInUserPreferencesTable = async (
    preferenceName: PreferenceType,
    preferenceValue: string | string[]
  ) => {
    try {
      await checkAndOpenOrCloseDBConnection("open");

      if (preferenceName === "reasons") {
        const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
        await dbConnection.current?.run(query, [
          preferenceValue.toString(),
          preferenceName,
        ]);
      } else {
        const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
        await dbConnection.current?.run(query, [
          preferenceName,
          preferenceValue,
        ]);
      }

      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        [preferenceName]: preferenceValue,
      }));
    } catch (error) {
      console.log(`ERROR ENTERING ${preferenceName} into DB`);
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
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
                  checkAndOpenOrCloseDBConnection={
                    checkAndOpenOrCloseDBConnection
                  }
                  modifyDataInUserPreferencesTable={
                    modifyDataInUserPreferencesTable
                  }
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
                  checkAndOpenOrCloseDBConnection={
                    checkAndOpenOrCloseDBConnection
                  }
                  setTheme={setTheme}
                  theme={theme}
                  fetchDataFromDB={fetchDataFromDB}
                  modifyDataInUserPreferencesTable={
                    modifyDataInUserPreferencesTable
                  }
                  setUserPreferences={setUserPreferences}
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
                  checkAndOpenOrCloseDBConnection={
                    checkAndOpenOrCloseDBConnection
                  }
                  userPreferences={userPreferences}
                  fetchedSalahData={fetchedSalahData}
                  activeStreakCount={activeStreakCount}
                  streakDatesObjectsArr={streakDatesObjectsArr}
                />
              )}
            />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="HomePage" href="/HomePage">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="StatsPage" href="/StatsPage">
              <IonIcon icon={statsChartOutline} />
              <IonLabel>Stats</IonLabel>
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
          modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
        />
      )}
    </IonApp>
  );
};

export default App;
