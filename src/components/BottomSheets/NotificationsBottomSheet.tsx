import { useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
// @ts-ignore
import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";

import { PreferenceType, userPreferencesType } from "../../types/types";
import { sheetHeaderHeight, TWEEN_CONFIG } from "../../utils/constants";

const NotificationsBottomSheet = ({
  setShowNotificationsModal,
  showNotificationsModal,
  modifyDataInUserPreferencesTable,
  setUserPreferences,
  userPreferences,
}: {
  setShowNotificationsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showNotificationsModal: boolean;
  modifyDataInUserPreferencesTable: (
    value: string,
    preference: PreferenceType
  ) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}) => {
  const [dailyNotificationToggle, setDailyNotificationToggle] =
    useState<boolean>(userPreferences.dailyNotification === "1" ? true : false);

  console.log(
    "userPreferences.dailyNotification: ",
    userPreferences.dailyNotification
  );

  const showNotificationsAlert = async () => {
    const { value } = await Dialog.confirm({
      title: "Open Settings",
      message: `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
      okButtonTitle: "Settings",
      cancelButtonTitle: "Cancel",
    });

    if (value) {
      if (Capacitor.getPlatform() === "ios") {
        NativeSettings.openIOS({
          option: IOSSettings.App,
        });
      } else if (Capacitor.getPlatform() === "android") {
        NativeSettings.openAndroid({
          option: AndroidSettings.AppNotification,
        });
      }
    }
  };

  const scheduleDailyNotification = async (hour: number, minute: number) => {
    console.log("SCHEDULING NOTIFICATION");

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Daily Reminder",
          body: `Did you log your prayers today?`,
          id: 1,
          schedule: {
            on: {
              hour: hour,
              minute: minute,
            },
            allowWhileIdle: true,
            // foreground: true, // iOS only
            repeats: true,
          },
        },
      ],
    });
  };

  const cancelNotification = async (id: number) => {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

  // useEffect(() => {
  //   const checkPermissionFunc = async () => {
  //     const checkPermission = await LocalNotifications.checkPermissions();
  //     const userNotificationPermission = checkPermission.display;
  //     // if (userNotificationPermission === "denied" && dailyNotification === true) {
  //     if (
  //       userNotificationPermission === "denied" &&
  //       userPreferences.dailyNotification === "1"
  //     ) {
  //       modifyDataInUserPreferencesTable("0", "dailyNotification");
  //       setDailyNotification(false);
  //     }
  //   };
  //   checkPermissionFunc();
  // }, []);

  async function checkNotificationPermissions() {
    const checkPermission = await LocalNotifications.checkPermissions();
    const userNotificationPermission = checkPermission.display;
    console.log("userNotificationPermission: ", userNotificationPermission);

    console.log("DAILYNOTIFICATION STATE: ", dailyNotificationToggle);

    if (userNotificationPermission === "denied") {
      console.log("PERMISSION DENIED");

      showNotificationsAlert();
    } else if (userNotificationPermission === "granted") {
      console.log("PERMISSION GRANTED");

      if (dailyNotificationToggle === true) {
        cancelNotification(1);
      } else if (dailyNotificationToggle === false) {
        console.log("TOGGLE DETECTED, SETTING NOTICIATION TIME");

        const [hour, minute] = userPreferences.dailyNotificationTime
          .split(":")
          .map(Number);
        scheduleDailyNotification(hour, minute);
      }
      setDailyNotificationToggle(!dailyNotificationToggle);
      modifyDataInUserPreferencesTable(
        dailyNotificationToggle === true ? "1" : "0",
        "dailyNotification"
      );
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      requestPermissionFunction();
    }
  }

  const requestPermissionFunction = async () => {
    const requestPermission = await LocalNotifications.requestPermissions();
    if (requestPermission.display === "granted") {
      setDailyNotificationToggle(true);
      modifyDataInUserPreferencesTable("1", "dailyNotification");
    } else if (
      requestPermission.display === "prompt" ||
      requestPermission.display === "prompt-with-rationale" ||
      requestPermission.display === "denied"
    ) {
      modifyDataInUserPreferencesTable("0", "dailyNotification");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPreferences((userPreferences) => ({
      ...userPreferences,
      dailyNotificationTime: e.target.value,
    }));
    const [hour, minute] = e.target.value.split(":").map(Number);
    scheduleDailyNotification(hour, minute);
    modifyDataInUserPreferencesTable(e.target.value, "dailyNotificationTime");
  };

  useEffect(() => {
    const notificationValue = dailyNotificationToggle === true ? "1" : "0";
    modifyDataInUserPreferencesTable(notificationValue, "dailyNotification");
  }, [dailyNotificationToggle]);

  return (
    <Sheet
      detent="content-height"
      tweenConfig={TWEEN_CONFIG}
      isOpen={showNotificationsModal}
      onClose={() => setShowNotificationsModal(false)}
    >
      <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
        <Sheet.Header style={sheetHeaderHeight} />
        <Sheet.Content>
          <div className="h-[50vh]">
            <div className="flex items-center justify-between p-3 notification-text-and-toggle-wrap">
              <p>Turn on Daily Notification</p>{" "}
              <Switch
                checked={dailyNotificationToggle}
                className={undefined}
                disabled={undefined}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={() => {
                  checkNotificationPermissions();
                }}
                onColor="lightblue"
                pendingOffColor={undefined}
                pendingOnColor={undefined}
                readOnly={undefined}
                style={undefined}
              />
            </div>

            {dailyNotificationToggle === true ? (
              <div className="flex items-center justify-between p-3">
                <p>Set Time</p>

                <input
                  onChange={(e) => {
                    handleTimeChange(e);
                  }}
                  style={{ backgroundColor: "transparent" }}
                  className={`${
                    dailyNotificationToggle === true ? "slideUp" : ""
                  } focus:outline-none focus:ring-0 focus:border-transparent w-[auto] time-input`}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  value={userPreferences.dailyNotificationTime}
                  required
                />
              </div>
            ) : null}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onTap={() => setShowNotificationsModal(false)}
      />
    </Sheet>
  );
};

export default NotificationsBottomSheet;
