import { EasingDefinition } from "framer-motion";
import { Toast } from "@capacitor/toast";
import { LocalNotifications } from "@capacitor/local-notifications";

export const TWEEN_CONFIG = {
  ease: "easeInOut" as EasingDefinition,
  duration: 0.5,
};

export const reasonsStyles =
  "p-2 m-1 text-xs bg-[rgba(0, 0, 0, 1)] bg-gray-800/70 rounded-xl";

export const prayerStatusColorsHexCodes = {
  group: "#448b75",
  "male-alone": "#bcaa4b",
  "female-alone": "#448b75",
  excused: "#b317ae",
  late: "#ea580c",
  missed: "#b62e2e",
  "": "#585858",
};

export const checkNotificationPermissions = async () => {
  const { display: userNotificationPermission } =
    await LocalNotifications.checkPermissions();
  return userNotificationPermission;
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

export const sheetHeaderHeight = {
  height: "60px",
  // backgroundColor: "black",
};

export const showToast = async (text: string, duration: "short" | "long") => {
  await Toast.show({
    text: text,
    position: "center",
    duration: duration,
  });
};
