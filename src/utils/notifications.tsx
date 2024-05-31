import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

console.log("NOTIFICATIONS LOADED");
let requestPermission;
let checkPermission;
let userNotificationPermission;
export async function checkNotificationPermissions() {
  checkPermission = await LocalNotifications.checkPermissions();
  userNotificationPermission = checkPermission.display;
  if (userNotificationPermission == "denied") {
    alert("Please turn notifications back on from within system settings");
    return "denied";
  } else if (checkPermission.display == "granted") {
    // return "granted";
  } else if (
    // checkPermission.display == "denied" ||
    checkPermission.display == "prompt" ||
    checkPermission.display == "prompt-with-rationale"
  ) {
    requestPermissionFunction();
    localStorage.setItem("daily-notification", JSON.stringify(false));
    // return "prompt";
  }
}
export const requestPermissionFunction = async () => {
  requestPermission = await LocalNotifications.requestPermissions();
  if (requestPermission.display == "granted") {
    return "granted";
  } else if (requestPermission.display == "denied") {
    return "denied";
  } else if (
    requestPermission.display == "prompt" ||
    requestPermission.display == "prompt-with-rationale"
  ) {
    return "prompt";
  }
};
let scheduleMorningNotifications: () => void;
// let scheduleEveningNotification;
if (Capacitor.isNativePlatform()) {
  // LocalNotifications.createChannel({
  //   id: "1",
  //   name: "Notification",
  //   description: "General Notification",
  // });
  scheduleMorningNotifications = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Morning Reminder",
          body: `"Therefore remember Me. I will remember you." (Quran 2:152)`,
          id: 1,
          schedule: {
            on: { hour: 9, minute: 0 }, // THIS WORKS ON IOS
            allowWhileIdle: true,
            //   foreground: true, // iOS only
            repeats: true,
          },
        },
      ],
    });
  };
}
