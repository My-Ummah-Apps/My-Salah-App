import { Dialog } from "@capacitor/dialog";
import { EasingDefinition } from "framer-motion";
import { Toast } from "@capacitor/toast";
import { LocalNotifications } from "@capacitor/local-notifications";
import { format, isValid, parse } from "date-fns";
import {
  SalahByDateObjType,
  SalahNamesType,
  userPreferencesType,
} from "../types/types";

export const defaultReasons =
  "Alarm,Appointment,Caregiving,Education,Emergency,Family/Friends,Gaming,Guests,Health,Leisure,Shopping,Sleep,Sports,Travel,TV,Other,Work";

export const TWEEN_CONFIG = {
  ease: "easeInOut" as EasingDefinition,
  duration: 0.5,
};

export const bottomSheetContainerStyles = {
  borderRadius: "1.5rem 1.5rem 0 0",
  overflow: "hidden",
  backgroundColor: "rgb(33, 36, 38)",
};

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
};

export const reasonsStyles = "p-2 m-1 text-xs bg-[rgb(39,39,39)] rounded-xl";

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

// export const bottomSheetCloseBtnStyles =
//   "text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3";
