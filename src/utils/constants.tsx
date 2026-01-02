import { Dialog } from "@capacitor/dialog";
import { Toast } from "@capacitor/toast";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, format, isValid, parse } from "date-fns";
import { StatusBar, Style } from "@capacitor/status-bar";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { Capacitor } from "@capacitor/core";
import {
  PreferenceType,
  SalahByDateObjType,
  SalahNamesType,
  userPreferencesType,
  SalahNotificationSettings,
} from "../types/types";
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from "capacitor-native-settings";
import { fetchAllLocations, toggleDBConnection } from "./dbUtils";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";

const device = Capacitor.getPlatform();

export const MODAL_BREAKPOINTS = [0, 1];
export const INITIAL_MODAL_BREAKPOINT = 1;

export const defaultReasons =
  "Alarm,Appointment,Caregiving,Education,Emergency,Family/Friends,Gaming,Guests,Health,Leisure,Shopping,Sleep,Sports,Travel,TV,Other,Work";

export const pageTransitionStyles = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

export const dictPreferencesDefaultValues: userPreferencesType = {
  userGender: "male",
  userStartDate: format(new Date(), "yyyy-MM-dd"),
  dailyNotification: "0",
  dailyNotificationTime: "21:00",
  reasons: defaultReasons.split(",").sort((a, b) => a.localeCompare(b)),
  showReasons: "0",
  showMissedSalahCount: "1",
  isExistingUser: "0",
  isMissedSalahToolTipShown: "0",
  appLaunchCount: "0",
  saveButtonTapCount: "0",
  haptics: "0",
  theme: "dark",
  timeFormat: "12hr",
  prayerCalculationMethod: "MuslimWorldLeague",
  madhab: "shafi",
  highLatitudeRule: "middleofthenight",
  fajrAngle: "18",
  ishaAngle: "17",
  fajrAdjustment: "0",
  dhuhrAdjustment: "0",
  asrAdjustment: "0",
  maghribAdjustment: "0",
  ishaAdjustment: "0",
  shafaqRule: "general",
  // PolarCircleResolution: "general",
  fajrNotification: "off",
  dhuhrNotification: "off",
  asrNotification: "off",
  maghribNotification: "off",
  ishaNotification: "off",
};

export const reasonsStyles =
  "p-2 m-1 text-xs bg-[var(--reasons-bg-color-status-sheet)] rounded-xl";

export const salahStatusColorsHexCodes = {
  group: "#5FAE82",
  "male-alone": "#D4B245",
  "female-alone": "#5FAE82",
  excused: "#8C4FB5",
  late: "#D9653B",
  missed: "#E63946",
  "": "#585858",
};

// export const prayerStatusColorsHexCodes = {
//   group: "#0ec188",
//   "male-alone": "rgb(216, 204, 24)",
//   "female-alone": "#0ec188",
//   excused: "#9c1ae7",
//   late: "#f27c14",
//   missed: "#f7093b",
//   "": "#585858",
// };

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
  minute: number
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
          allowWhileIdle: true,
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

export const salahNamesArr: SalahNamesType[] = [
  "Fajr",
  "Dhuhr",
  "Asar",
  "Maghrib",
  "Isha",
];

export const validSalahStatuses = [
  "group",
  "male-alone",
  "female-alone",
  "late",
  "missed",
  "excused",
];

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
  msg: string
): Promise<boolean> => {
  const { value } = await Dialog.confirm({
    title: title,
    message: msg,
  });

  return value;
};

export const setStatusAndNavBarBGColor = async (
  backgroundColor: string,
  textColor: Style
) => {
  if (device === "android") {
    await EdgeToEdge.setBackgroundColor({ color: backgroundColor });
  }
  await StatusBar.setStyle({ style: textColor });
};

export const promptToOpenDeviceSettings = async (
  message: string,
  androidOption: AndroidSettings
) => {
  const { value } = await Dialog.confirm({
    title: "Open Settings",
    message: message,
    okButtonTitle: "Settings",
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
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>
) => {
  try {
    await toggleDBConnection(dbConnection, "open");

    if (preferenceName === "reasons") {
      const query = `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`;
      await dbConnection.current?.run(query, [
        preferenceValue.toString(),
        preferenceName,
      ]);
    } else {
      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;
      await dbConnection.current?.run(query, [preferenceName, preferenceValue]);
    }

    setUserPreferences((userPreferences: userPreferencesType) => ({
      ...userPreferences,
      [preferenceName]: preferenceValue,
    }));
  } catch (error) {
    console.log(`ERROR ENTERING ${preferenceName} into DB`);
    console.error(error);
  } finally {
    let DBResultPreferences = await dbConnection.current?.query(
      `SELECT * FROM userPreferencesTable`
    );
    console.log("DBResultPreferences: ", DBResultPreferences?.values);
    await toggleDBConnection(dbConnection, "close");
  }
};

export const cancelSalahReminderNotifications = async (
  salahName: SalahNamesType
) => {
  // ! Might need to loop through all notifications and cancel them one by one or there might be a way of obtaining all scheduled notifications and cancelled relevant ones that way
};

export const scheduleSalahTimesNotifications = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  salahName: SalahNamesType,
  userPreferences: userPreferencesType,
  setting: SalahNotificationSettings
) => {
  const today = new Date();

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    return addDays(today, i);
  });

  console.log("nextSevenDays: ", nextSevenDays);

  // const { activeLocation } = await fetchAllLocations(dbConnection);
  const useAdhan = setting;

  if (useAdhan === "on" || useAdhan === "adhan") {
    // if (device === "android") {
    // ! Inset for loop to schedule next seven days worth of notifications
    const { params, coordinates, todaysDate } =
      await generateActiveLocationParams(dbConnection, userPreferences);

    console.log(salahName, setting);

    console.log(coordinates, todaysDate, params);

    const salahTime = new PrayerTimes(coordinates, todaysDate, params)["fajr"];

    console.log("salahTime: ", salahTime);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1, // ! These will need unique IDs for each notification
          title: `${salahName}`,
          body: `It's time to pray ${salahName}`,
          schedule: {
            //  at:
            allowWhileIdle: true,
            repeats: false,
          },
          sound: useAdhan === "adhan" ? "adhan.mp3" : "default",
          channelId:
            useAdhan === "adhan"
              ? "salah-reminders-with-adhan"
              : "salah-reminders-without-adhan",
        },
      ],
    });
    // } else if (device === "ios") {
    // await LocalNotifications.schedule({
    //   notifications: [
    //     {
    //       id: 1, // ! These will need unique IDs for each notification
    //       title: `${salahName}`,
    //       body: `It's time to pray ${salahName}`,
    //       schedule: {
    //         // at:
    //         allowWhileIdle: true,
    //         repeats: false,
    //       },
    //       sound: useAdhan === "adhan" ? "adhan.wav" : "default",
    //       // foreground: true, // iOS only
    //     },
    //   ],
    // });
    // }
  }
};

export const generateActiveLocationParams = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  userPreferences: userPreferencesType
) => {
  // if (!isDatabaseInitialised) return;

  const todaysDate = new Date();

  const { activeLocation } = await fetchAllLocations(dbConnection);

  // const activeLocation = locations?.filter((loc) => loc.isSelected === 1)[0];

  const coordinates = new Coordinates(
    activeLocation?.latitude,
    activeLocation?.longitude
  );

  // console.log("activeLocation: ", activeLocation);

  const params =
    CalculationMethod[
      userPreferences.prayerCalculationMethod || "MuslimWorldLeague"
    ]();

  // console.log(
  //   "userPreferences.prayerCalculationMethod: ",
  //   userPreferences.prayerCalculationMethod
  // );

  // console.log("params before amendments: ", params);

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

  // console.log("params after amendments:", params);

  return { params, coordinates, todaysDate };
};

export const getSalahTimes = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  userPreferences: userPreferencesType,
  setSalahtimes: React.Dispatch<
    React.SetStateAction<{
      fajr: string;
      sunrise: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    }>
  >
) => {
  const { params, coordinates, todaysDate } =
    await generateActiveLocationParams(dbConnection, userPreferences);

  const extractSalahTime = (
    salah: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"
  ) => {
    const salahTime = new PrayerTimes(coordinates, todaysDate, params)[salah];

    const locale = navigator.language;

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

  // console.log("salahTimes: ", salahTimes);
};

export const getNextSalah = async (
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
  userPreferences: userPreferencesType
) => {
  const { params, coordinates, todaysDate } =
    await generateActiveLocationParams(dbConnection, userPreferences);

  let allSalahTimes = new PrayerTimes(coordinates, todaysDate, params);

  let next = allSalahTimes.nextPrayer();
  let nextSalahTime;
  let currentSalah;

  // const sunnahTimes = new SunnahTimes(allSalahTimes);
  // console.log("sunnahTimes: ", sunnahTimes);

  if (next === "none") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    allSalahTimes = new PrayerTimes(coordinates, tomorrow, params);

    currentSalah = "Isha";
    next = allSalahTimes.nextPrayer();

    nextSalahTime = allSalahTimes.timeForPrayer(next);
  } else {
    nextSalahTime = allSalahTimes.timeForPrayer(next);
    currentSalah = allSalahTimes.currentPrayer();
  }

  if (next === "sunrise") {
    next = "dhuhr";
    nextSalahTime = allSalahTimes.timeForPrayer(next);
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
