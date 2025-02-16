import { EasingDefinition } from "framer-motion";
import { Toast } from "@capacitor/toast";
import { LocalNotifications } from "@capacitor/local-notifications";
import { format, isValid, parse } from "date-fns";
import {
  MissedSalahObjType,
  SalahNamesType,
  userPreferencesType,
} from "../types/types";

export const TWEEN_CONFIG = {
  ease: "easeInOut" as EasingDefinition,
  duration: 0.5,
};

export const bottomSheetContainerStyles = {
  borderRadius: "1.5rem 1.5rem 0 0",
  overflow: "hidden",
  backgroundColor: "rgb(33, 36, 38)",
};

export const defaultReasons =
  "Alarm,Education,Caregiving,Emergency,Family/Friends,Gaming,Guests,Health,Leisure,Shopping,Sleep,Sports,Travel,TV,Other,Work";

export const dictPreferencesDefaultValues: userPreferencesType = {
  userGender: "male",
  userStartDate: format(new Date(), "yyyy-MM-dd"),
  dailyNotification: "0",
  dailyNotificationTime: "21:00",
  reasons: defaultReasons.split(","),
  showReasons: "0",
  showMissedSalahCount: "1",
  isExistingUser: "0",
  isMissedSalahToolTipShown: "0",
  appLaunchCount: "0",
  saveButtonTapCount: "0",
  haptics: "0",
};

export const reasonsStyles = "p-2 m-1 text-xs bg-[rgb(39,39,39)] rounded-xl";

// export const prayerStatusColorsHexCodes = {
//   group: "#448b75",
//   "male-alone": "#bcaa4b",
//   "female-alone": "#448b75",
//   excused: "#b317ae",
//   late: "#ea580c",
//   missed: "#b62e2e",
//   "": "#585858",
// };

export const prayerStatusColorsHexCodes = {
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
  const { display: userNotificationPermission } =
    await LocalNotifications.checkPermissions();
  return userNotificationPermission;
};

const createNotificationChannel = async () => {
  await LocalNotifications.createChannel({
    id: "daily-reminder",
    name: "Reminders",
    importance: 4,
    description: "General reminders",
    sound: "default",
    visibility: 1,
    vibration: true,
  });
};

export const scheduleDailyNotification = async (
  hour: number,
  minute: number
) => {
  await createNotificationChannel();

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
  return [format(parsedDate, "EE"), formattedParsedDate];
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

export const sheetHeaderHeight = {
  height: "60px",
  // backgroundColor: "black",
};

export const sheetBackdropColor = {
  backgroundColor: "rgba(0, 0, 0, 0.7)",
};

export const showToast = async (text: string, duration: "short" | "long") => {
  await Toast.show({
    text: text,
    position: "center",
    duration: duration,
  });
};

export const prayerTableIndividualSquareStyles = `w-[1.5rem] h-[1.5rem] rounded-md`;

export const getMissedSalahCount = (missedSalahList: MissedSalahObjType) => {
  return Object.values(missedSalahList).flat().length;
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return isValid(parsedDate);
};

export const bottomSheetCloseBtnStyles =
  "text-base fixed bottom-[7%] left-1/2 transform -translate-x-1/2 translate-y-1/2 border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3";
