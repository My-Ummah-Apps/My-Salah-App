import { EasingDefinition } from "framer-motion";
import { Toast } from "@capacitor/toast";

export const TWEEN_CONFIG = {
  ease: "easeIn" as EasingDefinition,
  duration: 0.3,
};

export const showToast = async (text: string, duration: "short" | "long") => {
  await Toast.show({
    text: text,
    position: "center",
    duration: duration,
  });
};
