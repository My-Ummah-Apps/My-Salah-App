import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  calculationMethod,
  LocationsDataObjTypeArr,
  PreferenceType,
  SalahByDateObjType,
  SalahNamesTypeAdhanLibrary,
  SalahNotificationSettings,
  salahTimesObjType,
  userPreferencesType,
} from "../types/types";
import { toggleDBConnection } from "./dbUtils";
import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  PrayerTimes,
} from "adhan";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, addMinutes, format, isValid, parse } from "date-fns";
import { Toast } from "@capacitor/toast";
import { Dialog } from "@capacitor/dialog";
import { Capacitor } from "@capacitor/core";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { StatusBar, Style } from "@capacitor/status-bar";
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from "capacitor-native-settings";

const device = Capacitor.getPlatform();

export const showToast = async (text: string, duration: "short" | "long") => {
  await Toast.show({
    text: text,
    position: "center",
    duration: duration,
  });
};

export const salahTableIndividualSquareStyles = `w-[1.5rem] h-[1.5rem] rounded-md`;

export const getMissedSalahCount = (missedSalahList: SalahByDateObjType) => {
  return Object.values(missedSalahList).flat().length;
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  // console.log("Date is: ", parsedDate, "and its: ", isValid(parsedDate));
  return isValid(parsedDate);
};

export const showAlert = async (title: string, msg: string) => {
  await Dialog.alert({
    title: title,
    message: msg,
  });
};

export const showConfirmMsg = async (
  title: string,
  msg: string,
): Promise<boolean> => {
  const { value } = await Dialog.confirm({
    title: title,
    message: msg,
  });

  return value;
};

export const setStatusAndNavBarBGColor = async (
  backgroundColor: string,
  textColor: Style,
) => {
  if (device === "android") {
    await EdgeToEdge.setBackgroundColor({ color: backgroundColor });
  }
  await StatusBar.setStyle({ style: textColor });
};

export const promptToOpenDeviceSettings = async (
  title: string,
  message: string,
  androidOption: AndroidSettings,
) => {
  const { value } = await Dialog.confirm({
    title: title,
    message: message,
    okButtonTitle: "Open settings",
    cancelButtonTitle: "Cancel",
  });

  if (value) {
    if (device === "ios") {
      NativeSettings.openIOS({
        option: IOSSettings.App,
      });
    } else if (device === "android") {
      NativeSettings.openAndroid({
        option: androidOption,
      });
    }
  }
};

export const updateUserPrefs = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  preferenceName: PreferenceType,
  preferenceValue: string | string[],
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>,
) => {
  try {
    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    await toggleDBConnection(dbConnection, "open");

    if (preferenceName === "reasons") {
      const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
      await dbConnection.current.run(query, [
        preferenceValue.toString(),
        preferenceName,
      ]);
    } else {
      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      await dbConnection.current.run(query, [preferenceName, preferenceValue]);
    }

    setUserPreferences((userPreferences: userPreferencesType) => ({
      ...userPreferences,
      [preferenceName]: preferenceValue,
    }));
  } catch (error) {
    console.error(`ERROR ENTERING ${preferenceName} into DB`);
    console.error(error);
  } finally {
    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }
    let DBResultPreferences = await dbConnection.current.query(
      `SELECT * FROM userPreferencesTable`,
    );
    console.log("DBResultPreferences: ", DBResultPreferences.values);
    await toggleDBConnection(dbConnection, "close");
  }
};

export const getActiveLocation = (userLocations: LocationsDataObjTypeArr) => {
  const activeLocation = userLocations.find((loc) => loc.isSelected === 1);
  // if (!activeLocation) {
  //   console.error("No active location exists");
  // }

  return activeLocation;
};

export const cancelSalahReminderNotifications = async (
  salahName: SalahNamesTypeAdhanLibrary,
) => {
  // console.log("CANCELLING NOTIFICATIONS FOR THE FOLLOWING SALAH: ", salahName);

  const pendingNotifications = await LocalNotifications.getPending();

  const notificationsToCancel = pendingNotifications.notifications
    .filter((item) => item.title === salahName)
    .map((n) => ({
      id: n.id,
    }));

  // console.log("notificationsToCancel: ", notificationsToCancel);

  if (notificationsToCancel.length === 0) return;

  await LocalNotifications.cancel({ notifications: notificationsToCancel });

  // console.log("pending notifications after cancelling: ", (await LocalNotifications.getPending()).notifications);
};

const salahIdMap = {
  fajr: 1,
  dhuhr: 2,
  asr: 3,
  maghrib: 4,
  isha: 5,
};

const generateNotificationId = (
  salahName: SalahNamesTypeAdhanLibrary,
  date: Date,
) => {
  const dateFormatted = format(date, "ddMMyyyy");

  return Number(dateFormatted + salahIdMap[salahName]);
};

export const toLocalDateFromUTCClock = (utcDate: Date) => {
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds(),
  );
};

export const upperCaseFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const checkNotificationPermissions = async () => {
  const userNotificationPermission =
    await LocalNotifications.checkPermissions();
  return userNotificationPermission.display;
};

// const createNotificationChannel = async () => {
//   await LocalNotifications.createChannel({
//     id: "daily-reminder",
//     name: "Reminders",
//     importance: 4,
//     description: "General reminders",
//     sound: "default",
//     visibility: 1,
//     vibration: true,
//   });
// };

export const scheduleDailyNotification = async (
  hour: number,
  minute: number,
) => {
  // if (device === "android") {
  //   await createNotificationChannel();
  // }

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
          // allowWhileIdle: true,
          repeats: true,
        },
        channelId: "daily-reminder",
        // foreground: true, // iOS only
      },
    ],
  });
};

export const createLocalisedDate = (date: string) => {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  const userLocale = navigator.language || "en-US";
  const formattedParsedDate = new Intl.DateTimeFormat(userLocale, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
    .format(parsedDate)
    .replace(/\//g, ".");
  return [format(parsedDate, "EEEE"), formattedParsedDate];
};

export const scheduleSalahTimesNotifications = async (
  userLocations: LocationsDataObjTypeArr,
  salahName: SalahNamesTypeAdhanLibrary,
  userPreferences: userPreferencesType,
  setting: SalahNotificationSettings,
) => {
  await cancelSalahReminderNotifications(salahName);

  const now = new Date();

  const customAdjustment = Number(
    userPreferences[`${salahName}Adjustment` as keyof userPreferencesType],
  );

  const nextSevenDays = Array.from({ length: 8 }, (_, i) => {
    return addDays(now, i);
  });

  const sound =
    setting === "adhan"
      ? device === "android"
        ? "adhan.mp3"
        : "adhan.wav"
      : "default";

  if (setting === "on" || setting === "adhan") {
    const result = await generateActiveLocationParams(
      userLocations,
      userPreferences,
    );

    if (!result) return;
    const { params, coordinates } = result;

    const arr = [];

    for (let i = 0; i < nextSevenDays.length; i++) {
      const salahTime = new PrayerTimes(coordinates, nextSevenDays[i], params)[
        salahName
      ];

      const localisedSalahTime = toLocalDateFromUTCClock(salahTime);

      if (now < localisedSalahTime) {
        arr.push(addMinutes(localisedSalahTime, customAdjustment));
      }
    }

    for (let i = 0; i < arr.length; i++) {
      const uniqueId = generateNotificationId(salahName, arr[i]);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: uniqueId,
            title: `${salahName}`,
            body: `It's time to pray ${upperCaseFirstLetter(salahName)}`,
            schedule: {
              at: arr[i],
              allowWhileIdle: true,
              repeats: false,
            },
            sound: sound,
            channelId:
              setting === "adhan"
                ? "salah-reminders-with-adhan"
                : "salah-reminders-without-adhan",
          },
        ],
      });
    }
  }

  // console.log(
  //   "PENDING NOTIFICATIONS: ",
  //   (await LocalNotifications.getPending()).notifications,
  // );
};

export const generateActiveLocationParams = async (
  userLocations: LocationsDataObjTypeArr,
  userPreferences: userPreferencesType,
) => {
  // console.log("USER. LOCATIONS IN GENERATE: ", userLocations);

  const activeLocation = getActiveLocation(userLocations);

  if (userLocations.length === 0 || !activeLocation) {
    console.log(
      "No active location exists, generateActiveLocationParams function discontinouing",
    );
    return;
  }

  if (!activeLocation) {
    // throw new Error("No active location found");
    console.error("Active location does not exist");
    return;
  }

  const coordinates = new Coordinates(
    activeLocation.latitude,
    activeLocation.longitude,
  );

  const params =
    CalculationMethod[
      userPreferences.prayerCalculationMethod || "MuslimWorldLeague"
    ]();

  params.madhab = userPreferences.madhab;
  params.highLatitudeRule = userPreferences.highLatitudeRule;
  params.fajrAngle = Number(userPreferences.fajrAngle);
  params.ishaAngle = Number(userPreferences.ishaAngle);
  params.methodAdjustments.fajr = Number(userPreferences.fajrAdjustment);
  params.methodAdjustments.dhuhr = Number(userPreferences.dhuhrAdjustment);
  params.methodAdjustments.asr = Number(userPreferences.asrAdjustment);
  params.methodAdjustments.maghrib = Number(userPreferences.maghribAdjustment);
  params.methodAdjustments.isha = Number(userPreferences.ishaAdjustment);
  params.shafaq = userPreferences.shafaqRule;
  params.polarCircleResolution = userPreferences.polarCircleResolution;

  // console.log("params after amendments:", params);

  return { params, coordinates };
};

export const extractSalahTime = (
  salah: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha",
  coordinates: Coordinates,
  date: Date,
  params: CalculationParameters,
  userPreferences: userPreferencesType,
) => {
  const salahTime = new PrayerTimes(coordinates, date, params)[salah];

  const locale = navigator.language;

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: userPreferences.timeFormat === "24hr" ? "h23" : "h12",
  }).format(salahTime);
};

export const getSalahTimes = async (
  userLocations: LocationsDataObjTypeArr,
  date: Date,
  userPreferences: userPreferencesType,
  setSalahtimes: React.Dispatch<React.SetStateAction<salahTimesObjType>>,
) => {
  // console.log("GETTING SALAH TIMES FOR: ", date);

  const result = await generateActiveLocationParams(
    userLocations,
    userPreferences,
  );

  if (!result) return;

  const { params, coordinates } = result;

  if (!params || !coordinates || !date) return;

  setSalahtimes({
    fajr: extractSalahTime("fajr", coordinates, date, params, userPreferences),
    sunrise: extractSalahTime(
      "sunrise",
      coordinates,
      date,
      params,
      userPreferences,
    ),
    dhuhr: extractSalahTime(
      "dhuhr",
      coordinates,
      date,
      params,
      userPreferences,
    ),
    asr: extractSalahTime("asr", coordinates, date, params, userPreferences),
    maghrib: extractSalahTime(
      "maghrib",
      coordinates,
      date,
      params,
      userPreferences,
    ),
    isha: extractSalahTime("isha", coordinates, date, params, userPreferences),
  });
};

export const getNextSalah = async (
  userLocations: LocationsDataObjTypeArr,
  userPreferences: userPreferencesType,
) => {
  const result = await generateActiveLocationParams(
    userLocations,
    userPreferences,
  );

  if (!result) return;

  const { params, coordinates } = result;

  const todaysDate = new Date();

  let allSalahTimes = new PrayerTimes(coordinates, todaysDate, params);

  let next = allSalahTimes.nextPrayer();
  let nextSalahTime: Date | null = null;
  let currentSalah:
    | "none"
    | "fajr"
    | "sunrise"
    | "dhuhr"
    | "asr"
    | "maghrib"
    | "isha" = "none";

  // const sunnahTimes = new SunnahTimes(allSalahTimes);
  // console.log("sunnahTimes: ", sunnahTimes);

  if (next === "none") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    allSalahTimes = new PrayerTimes(coordinates, tomorrow, params);

    currentSalah = "isha";
    next = allSalahTimes.nextPrayer();

    nextSalahTime = allSalahTimes.timeForPrayer(next);
  } else if (next === "sunrise") {
    next = "sunrise";
    nextSalahTime = allSalahTimes.timeForPrayer(next);
    currentSalah = "fajr";
  } else {
    nextSalahTime = allSalahTimes.timeForPrayer(next);
    currentSalah = allSalahTimes.currentPrayer();
  }

  if (nextSalahTime === null) {
    console.error("nextSalahTime is null");
    return;
  }

  const now = new Date();
  const diffMs = nextSalahTime.getTime() - now.getTime();
  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);

  return {
    currentSalah: currentSalah,
    nextSalah: next,
    nextSalahTime: nextSalahTime,
    hoursRemaining: hours,
    minsRemaining: minutes,
  };
};

export const setAdhanLibraryDefaults = async (
  calcMethod: calculationMethod,
  userLocations: LocationsDataObjTypeArr | undefined,
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>,
) => {
  // if (!userPreferences.prayerCalculationMethod) return;

  if (!userLocations) {
    console.error(
      "Unable to set calculation method as no user locations exist",
    );
    return;
  }

  try {
    await toggleDBConnection(dbConnection, "open");

    const activeLocation = getActiveLocation(userLocations);

    const params = CalculationMethod[calcMethod]();

    if (!activeLocation) {
      console.error("Active location does not exist");
      return;
    }

    const coordinates = new Coordinates(
      activeLocation.latitude,
      activeLocation.longitude,
    );

    const defaultCalcMethodValues = {
      prayerCalculationMethod: calcMethod,
      madhab: params.madhab,
      highLatitudeRule: HighLatitudeRule.recommended(coordinates),
      fajrAngle: String(params.fajrAngle),
      ishaAngle: String(params.ishaAngle),
      fajrAdjustment: String(params.methodAdjustments.fajr),
      dhuhrAdjustment: String(params.methodAdjustments.dhuhr),
      asrAdjustment: String(params.methodAdjustments.asr),
      maghribAdjustment: String(params.methodAdjustments.maghrib),
      ishaAdjustment: String(params.methodAdjustments.isha),
    };

    const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;

    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    for (const [key, value] of Object.entries(defaultCalcMethodValues)) {
      console.log(key, value);
      await dbConnection.current.run(query, [key, value]);
    }

    setUserPreferences((userPreferences: userPreferencesType) => ({
      ...userPreferences,
      ...defaultCalcMethodValues,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    await toggleDBConnection(dbConnection, "close");
  }
};
