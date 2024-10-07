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
import { TWEEN_CONFIG } from "../../utils/constants";

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
  const [dailyNotification, setDailyNotification] = useState<boolean>(
    userPreferences.dailyNotification === "1" ? true : false
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

  async function checkNotificationPermissions() {
    const checkPermission = await LocalNotifications.checkPermissions();
    const userNotificationPermission = checkPermission.display;
    if (userNotificationPermission === "denied") {
      // alert("Please turn notifications back on from within system settings");
      showNotificationsAlert();
      setDailyNotification(false);
    } else if (userNotificationPermission === "granted") {
      setDailyNotification(!dailyNotification);
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      setDailyNotification(false);
      requestPermissionFunction();
    }
  }

  const requestPermissionFunction = async () => {
    const requestPermission = await LocalNotifications.requestPermissions();
    console.log("requestPermission: ", requestPermission);

    if (requestPermission.display === "granted") {
      setDailyNotification(true);
      modifyDataInUserPreferencesTable("1", "dailyNotification");
    } else if (
      requestPermission.display === "prompt" ||
      requestPermission.display === "denied"
    ) {
      setDailyNotification(false);
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
    modifyDataInUserPreferencesTable(
      userPreferences.dailyNotification,
      "dailyNotification"
    );
  }, [userPreferences.dailyNotification]);

  const cancelNotification = async (id: number) => {
    console.log(
      "Daily notification is: ",
      dailyNotification,
      "CANCELLING NOTIFICATIONS"
    );
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

  return (
    <Sheet
      detent="content-height"
      tweenConfig={TWEEN_CONFIG}
      isOpen={showNotificationsModal}
      onClose={() => setShowNotificationsModal(false)}
    >
      <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
        <Sheet.Header />
        <Sheet.Content>
          <div className="h-[50vh]">
            <div className="flex items-center justify-between p-3 notification-text-and-toggle-wrap">
              <p>Turn on Daily Notification</p>{" "}
              <Switch
                // checked={dailyNotification}
                checked={dailyNotification}
                className={undefined}
                disabled={undefined}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={() => {
                  if (dailyNotification === true) {
                    cancelNotification(1);
                  }
                  checkNotificationPermissions();
                  // setUserPreferences((userPreferences) => ({
                  //   ...userPreferences,
                  //   dailyNotification:
                  //     userPreferences.dailyNotification === "1" ? "0" : "1",
                  // }));
                }}
                onColor="lightblue"
                pendingOffColor={undefined}
                pendingOnColor={undefined}
                readOnly={undefined}
                style={undefined}
              />
            </div>
            {/* {userPreferences.dailyNotification === "1" ? ( */}
            {dailyNotification === true ? (
              <div className="flex items-center justify-between p-3">
                <p>Set Time</p>
                {/* <p> */}
                <input
                  onChange={(e) => {
                    handleTimeChange(e);
                    // console.log(e.currentTarget);
                  }}
                  style={{ backgroundColor: "transparent" }}
                  className={`${
                    // userPreferences.dailyNotification === "1" ? "slideUp" : ""
                    dailyNotification === true ? "slideUp" : ""
                  } focus:outline-none focus:ring-0 focus:border-transparent w-[auto] `}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  value={userPreferences.dailyNotificationTime}
                  required
                />
                {/* </p> */}
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
