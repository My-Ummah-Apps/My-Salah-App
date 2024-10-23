import { EasingDefinition } from "framer-motion";
import { Toast } from "@capacitor/toast";

export const TWEEN_CONFIG = {
  ease: "easeInOut" as EasingDefinition,
  duration: 0.5,
};

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
  group: "#1ee8b6",
  "male-alone": "#f5e31d",
  "female-alone": "#1ee8b6",
  excused: "#9c1ae7",
  late: "#f27c14",
  missed: "#f7093b",
  "": "#585858",
};

export const sheetHeaderHeight = { height: "60px" };

export const showToast = async (text: string, duration: "short" | "long") => {
  await Toast.show({
    text: text,
    position: "center",
    duration: duration,
  });
};
