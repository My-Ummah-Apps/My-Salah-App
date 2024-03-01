import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

const Notifications = () => {
  let requestPermission;
  let checkPermission;
  let userNotificationPermission;

  async function checkNotificationPermissions() {
    checkPermission = await LocalNotifications.checkPermissions();
    userNotificationPermission = checkPermission.display;

    if (userNotificationPermission == "denied") {
      alert("Please turn notifications back on from within system settings");
      return;
    } else if (checkPermission.display == "granted") {
    } else if (
      // checkPermission.display == "denied" ||
      checkPermission.display == "prompt" ||
      checkPermission.display == "prompt-with-rationale"
    ) {
      requestPermissionFunction();
      // setMorningNotification(false);

      localStorage.setItem("morning-notification", JSON.stringify(false));
    }
  }

  const requestPermissionFunction = async () => {
    requestPermission = await LocalNotifications.requestPermissions();

    if (requestPermission.display == "granted") {
      // setMorningNotification(true);
    } else if (requestPermission.display == "denied") {
      // setMorningNotification(false);
    } else if (requestPermission.display == "prompt") {
      // setMorningNotification(false);
    }
  };

  let scheduleMorningNotifications: () => void;
  let scheduleAfternoonNotification;
  let scheduleEveningNotification;

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
    scheduleAfternoonNotification = async () => {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Afternoon Reminder",
            body: `“And remember Allah much, that you may be successful." (Quran 62:10)`,
            id: 3,
            schedule: {
              allowWhileIdle: true,
              //   foreground: true, // iOS only
              on: { hour: 14, minute: 0 }, // THIS WORKS ON IOS
              repeats: true,
            },
          },
        ],
      });
    };
    scheduleEveningNotification = async () => {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Evening Reminder",
            body: `"And the remembrance of Allah is greater." (Quran 29:45)`,
            id: 4,
            schedule: {
              allowWhileIdle: true,
              //   foreground: true, // iOS only
              on: { hour: 19, minute: 0 }, // THIS WORKS ON IOS
              repeats: true,
            },
          },
        ],
      });
    };
  }
};

export default Notifications;
