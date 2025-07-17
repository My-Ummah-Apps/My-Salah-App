import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IonApp } from "@ionic/react";
import HomePage from "./pages/HomePage";
import Sheet from "react-modal-sheet";
import { LATEST_APP_VERSION } from "./utils/changelog";
import {
  checkNotificationPermissions,
  dictPreferencesDefaultValues,
  scheduleDailyNotification,
  sheetBackdropColor,
  sheetHeaderHeight,
  bottomSheetContainerStyles,
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
} from "./types/types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

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
import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
// import ResourcesPage from "./pages/ResourcesPage";
import StatsPage from "./pages/StatsPage";
// import QiblahDirection from "./pages/QiblahDirection";
import useSQLiteDB from "./utils/useSqLiteDB";
import BottomSheetChangelog from "./components/BottomSheets/BottomSheetChangeLog";
import { LocalNotifications } from "@capacitor/local-notifications";

const App = () => {
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);
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

  useEffect(() => {
    if (
      localStorage.getItem("appVersion") &&
      localStorage.getItem("appVersion") !== LATEST_APP_VERSION
    ) {
      if (Capacitor.getPlatform() === "ios") {
        setShowChangelogModal(true);
      }
      localStorage.setItem("appVersion", LATEST_APP_VERSION);
    }
  }, []);

  const [fetchedSalahData, setFetchedSalahData] =
    useState<SalahRecordsArrayType>([]);

  const [userPreferences, setUserPreferences] = useState<userPreferencesType>(
    dictPreferencesDefaultValues
  );

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

      const isExistingUser =
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

  const pageStyles: string = ``;
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handleGenderSelect = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <IonApp>
      <BrowserRouter>
        <section className="app">
          {/* <h1 className="text-4xl text-right">{streakCounter}</h1> */}
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
                  setShowJoyRideEditIcon={setShowJoyRideEditIcon}
                  showJoyRideEditIcon={showJoyRideEditIcon}
                  userPreferences={userPreferences}
                  setFetchedSalahData={setFetchedSalahData}
                  fetchedSalahData={fetchedSalahData}
                  setMissedSalahList={setMissedSalahList}
                  pageStyles={pageStyles}
                  setShowMissedSalahsSheet={setShowMissedSalahsSheet}
                  showMissedSalahsSheet={showMissedSalahsSheet}
                  missedSalahList={missedSalahList}
                  setIsMultiEditMode={setIsMultiEditMode}
                  isMultiEditMode={isMultiEditMode}
                  activeStreakCount={activeStreakCount}
                  generateStreaks={generateStreaks}
                />
              }
            />
            <Route
              path="/SettingsPage"
              element={
                <SettingsPage
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
                  activeStreakCount={activeStreakCount}
                  streakDatesObjectsArr={streakDatesObjectsArr}
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
            onClose={() => {
              setShowIntroModal(false);
              setShowJoyRideEditIcon(true);
            }}
            detent="full-height"
            disableDrag={true}
          >
            <Sheet.Container style={bottomSheetContainerStyles}>
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
                          await modifyDataInUserPreferencesTable(
                            "userGender",
                            "male"
                          );

                          localStorage.setItem(
                            "appVersion",
                            LATEST_APP_VERSION
                          );
                        }}
                      >
                        Brother
                      </p>
                      <p
                        className="py-2 text-2xl text-center text-white bg-purple-900 rounded-2xl"
                        onClick={async () => {
                          handleGenderSelect();
                          await modifyDataInUserPreferencesTable(
                            "userGender",
                            "female"
                          );

                          localStorage.setItem(
                            "appVersion",
                            LATEST_APP_VERSION
                          );
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
                        Stay consistent with your Salah. Turn on daily reminders
                        to help you log your prayers and reach your goals.
                      </p>
                    </section>
                    <section className="flex flex-col p-5">
                      <button
                        onClick={async () => {
                          const permission =
                            await LocalNotifications.requestPermissions();
                          if (permission.display === "granted") {
                            setShowIntroModal(false);
                            setShowJoyRideEditIcon(true);
                            scheduleDailyNotification(21, 0);
                            await modifyDataInUserPreferencesTable(
                              "dailyNotification",
                              "1"
                            );
                            await modifyDataInUserPreferencesTable(
                              "dailyNotificationTime",
                              "21:00"
                            );
                          } else {
                            setShowIntroModal(false);
                            setShowJoyRideEditIcon(true);
                          }
                        }}
                        className="py-3 m-2 text-center text-white bg-blue-600 rounded-2xl"
                      >
                        Allow Daily Notification
                      </button>
                      <button
                        onClick={() => {
                          setShowIntroModal(false);
                          setShowJoyRideEditIcon(true);
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
    </IonApp>
  );
};

export default App;
