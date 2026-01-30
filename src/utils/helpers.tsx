import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
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
  PrayerTimes,
} from "adhan";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, format, isValid, parse } from "date-fns";
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

import { BatteryOptimization } from "@capawesome-team/capacitor-android-battery-optimization";

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
  sunrise: 2,
  dhuhr: 3,
  asr: 4,
  maghrib: 5,
  isha: 6,
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

  // console.log("Scheduling notifications for: ", salahName);

  const now = new Date();

  // const customAdjustment = Number(
  //   userPreferences[`${salahName}Adjustment` as keyof userPreferencesType],
  // );

  const nextSevenDays = Array.from({ length: 8 }, (_, i) => {
    return addDays(now, i);
  });

  const sound =
    setting === "adhan"
      ? device === "android" && salahName === "fajr"
        ? "adhan_fajr.mp3"
        : device === "android" && salahName !== "fajr"
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

    // console.log("params: ", params);

    for (let i = 0; i < nextSevenDays.length; i++) {
      const salahTime = new PrayerTimes(coordinates, nextSevenDays[i], params)[
        salahName
      ];

      // console.log(
      //   "new PrayerTimes(): ",
      //   new PrayerTimes(coordinates, nextSevenDays[i], params),
      // );

      // if (salahName === "maghrib") {
      //   console.log("salahName: ", salahName, "scheduling for: ", salahTime);
      // }
      // if (salahName === "dhuhr") {
      //   console.log("salahName: ", salahName, "scheduling for: ", salahTime);
      // }

      const localisedSalahTime = toLocalDateFromUTCClock(salahTime);

      if (now < localisedSalahTime) {
        // arr.push(addMinutes(localisedSalahTime, customAdjustment));
        arr.push(localisedSalahTime);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      // if (salahName === "maghrib") {
      //   console.log("salahName: ", salahName, "scheduling for: ", arr[i]);
      // }
      // if (salahName === "dhuhr") {
      //   console.log("salahName: ", salahName, "scheduling for: ", arr[i]);
      // }

      const uniqueId = generateNotificationId(salahName, arr[i]);

      const notificationMsg =
        salahName === "sunrise"
          ? "The sun is rising!"
          : `It's time to pray ${upperCaseFirstLetter(salahName)}`;

      // const channelId =
      //   setting === "adhan" && salahName == "fajr"
      //     ? "salah-reminders-with-adhan"
      //     : "salah-reminders-without-adhan";

      const channelId =
        setting === "adhan" && salahName === "fajr"
          ? "fajr-reminder-with-adhan"
          : setting === "adhan" && salahName !== "fajr"
            ? "dhuhr-asr-maghrib-isha-reminders-with-adhan"
            : "salah-reminders-without-adhan";

      await LocalNotifications.schedule({
        notifications: [
          {
            id: uniqueId,
            title: `${upperCaseFirstLetter(salahName)}`,
            body: notificationMsg,
            schedule: {
              at: arr[i],
              allowWhileIdle: true,
              repeats: false,
            },
            sound: sound,
            channelId: channelId,
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

const generateActiveLocationParams = async (
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

  // console.log("params before amendments:", params);

  params.madhab = userPreferences.madhab;
  params.highLatitudeRule = userPreferences.highLatitudeRule;
  params.fajrAngle = Number(userPreferences.fajrAngle);
  params.ishaAngle = Number(userPreferences.ishaAngle);
  params.adjustments.fajr = Number(userPreferences.fajrAdjustment);
  params.adjustments.dhuhr = Number(userPreferences.dhuhrAdjustment);
  params.adjustments.asr = Number(userPreferences.asrAdjustment);
  params.adjustments.maghrib = Number(userPreferences.maghribAdjustment);
  params.adjustments.isha = Number(userPreferences.ishaAdjustment);
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

  // if (salah === "maghrib") {
  //   console.log("Salah name: ", salah, "Salah Time: ", salahTime);
  // }

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

  // console.log("RESULT IN GETSALAHTIMES: ", result);

  if (!result) return;

  const { params, coordinates } = result;

  if (!params || !coordinates || !date) return;

  // console.log("PARAMS IN GET: ", params);

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

export const handleNotificationPermissions = async () => {
  const userNotificationPermission = await checkNotificationPermissions();

  if (userNotificationPermission === "denied") {
    await promptToOpenDeviceSettings(
      `Notifications are turned off`,
      `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
      AndroidSettings.AppNotification,
    );
    return "denied";
  } else if (userNotificationPermission === "granted") {
    return "granted";
  } else if (
    userNotificationPermission === "prompt" ||
    userNotificationPermission === "prompt-with-rationale"
  ) {
    const requestPermission = await LocalNotifications.requestPermissions();

    if (requestPermission.display === "granted") {
      return "granted";
    } else if (requestPermission.display === "denied") {
      return "denied";
    }
  }
};

export const formatNumberWithSign = (number: number) => {
  if (number > 0) return `+${number}`;
  if (number < 0) return `${number}`;
  return 0;
};

export const isBatteryOptimizationEnabled = async () => {
  if (Capacitor.getPlatform() !== "android") {
    return false;
  }
  const { enabled } = await BatteryOptimization.isBatteryOptimizationEnabled();
  return enabled;
};

export const requestIgnoreBatteryOptimization = async () => {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }
  await BatteryOptimization.requestIgnoreBatteryOptimization();
};
