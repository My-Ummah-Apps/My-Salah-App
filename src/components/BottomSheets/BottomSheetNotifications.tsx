import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

import { AndroidSettings } from "capacitor-native-settings";

import { userPreferencesType } from "../../types/types";
import {
  checkNotificationPermissions,
  updateUserPrefs,
  promptToOpenDeviceSettings,
  scheduleDailyNotification,
} from "../../utils/helpers";
import { IonModal, IonToggle, isPlatform } from "@ionic/react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

const BottomSheetNotifications = ({
  dbConnection,
  triggerId,
  setUserPreferences,
  userPreferences,
}: {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  triggerId: string;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}) => {
  const [dailyNotificationToggle, setDailyNotificationToggle] =
    useState<boolean>(userPreferences.dailyNotification === "1" ? true : false);

  const cancelNotification = async (id: number) => {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

  async function handleNotificationPermissions() {
    const userNotificationPermission = await checkNotificationPermissions();

    if (userNotificationPermission === "denied") {
      await promptToOpenDeviceSettings(
        `open settings`,
        `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
        AndroidSettings.AppNotification,
      );
    } else if (userNotificationPermission === "granted") {
      if (dailyNotificationToggle === true) {
        cancelNotification(1);
      } else if (dailyNotificationToggle === false) {
        const [hour, minute] = userPreferences.dailyNotificationTime
          .split(":")
          .map(Number);
        scheduleDailyNotification(hour, minute);
      }
      setDailyNotificationToggle(!dailyNotificationToggle);
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      requestPermissionFunction();
    }
  }

  const requestPermissionFunction = async () => {
    // const requestPermission = await LocalNotifications.requestPermissions();
    const requestPermission = await LocalNotifications.requestPermissions();

    if (requestPermission.display === "granted") {
      setDailyNotificationToggle(true);
      const [hour, minute] = userPreferences.dailyNotificationTime
        .split(":")
        .map(Number);
      scheduleDailyNotification(hour, minute);
      // modifyDataInUserPreferencesTable("1", "dailyNotification");
    } else if (
      requestPermission.display === "prompt" ||
      requestPermission.display === "prompt-with-rationale" ||
      requestPermission.display === "denied"
    ) {
      await updateUserPrefs(
        dbConnection,
        "dailyNotification",
        "0",
        setUserPreferences,
      );
    }
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPreferences((userPreferences) => ({
      ...userPreferences,
      dailyNotificationTime: e.target.value,
    }));
    const [hour, minute] = e.target.value.split(":").map(Number);

    scheduleDailyNotification(hour, minute);
    await updateUserPrefs(
      dbConnection,
      "dailyNotificationTime",
      e.target.value,
      setUserPreferences,
    );
  };

  useEffect(() => {
    const notificationValue = dailyNotificationToggle === true ? "1" : "0";

    setUserPreferences((userPreferences) => ({
      ...userPreferences,
      dailyNotification: notificationValue,
    }));

    const modifyDBAndState = async () => {
      await updateUserPrefs(
        dbConnection,
        "dailyNotification",
        notificationValue,
        setUserPreferences,
      );
    };

    modifyDBAndState();
  }, [dailyNotificationToggle]);

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <div className="h-[50vh]">
        <div className="flex items-center justify-between p-3 mt-10 notification-text-and-toggle-wrap">
          <p>Turn on Daily Notification</p>{" "}
          <IonToggle
            mode={isPlatform("android") ? "md" : "ios"}
            style={{ "--track-background": "#555" }}
            checked={dailyNotificationToggle}
            onIonChange={async () => {
              handleNotificationPermissions();
            }}
          ></IonToggle>
        </div>

        {dailyNotificationToggle && (
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
              dir="auto"
              id="appt"
              name="appt"
              min="09:00"
              max="18:00"
              value={userPreferences.dailyNotificationTime}
              required
            />
          </div>
        )}
      </div>
    </IonModal>
  );
};

export default BottomSheetNotifications;
