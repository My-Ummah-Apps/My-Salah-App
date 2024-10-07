import { useEffect } from "react";
import Sheet from "react-modal-sheet";
// @ts-ignore
import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";

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
            }, // THIS WORKS ON IOS
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
      alert("Please turn notifications back on from within system settings");
      // setDailyNotification(false);
      return;
    } else if (userNotificationPermission === "granted") {
      // setDailyNotification(true);
      // const notificationTime = dailyNotificationTime.split(":").map(Number);
      // scheduleDailyNotification(notificationTime[0], notificationTime[1]);
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      // setDailyNotification(false);
      requestPermissionFunction();
    }
  }

  const requestPermissionFunction = async () => {
    const requestPermission = await LocalNotifications.requestPermissions();
    if (requestPermission.display == "granted") {
      // setDailyNotification(true);
      modifyDataInUserPreferencesTable("1", "dailyNotification");
    } else if (
      requestPermission.display == "prompt" ||
      requestPermission.display == "denied"
    ) {
      // setDailyNotification(false);
      modifyDataInUserPreferencesTable("0", "dailyNotification");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setDailyNotificationTime(e.target.value);
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

  return (
    <Sheet
      detent="content-height"
      // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
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
                checked={
                  userPreferences.dailyNotification === "1" ? true : false
                }
                className={undefined}
                disabled={undefined}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={() => {
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
            {userPreferences.dailyNotification === "1" ? (
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
                    userPreferences.dailyNotification === "1" ? "slideUp" : ""
                  } focus:outline-none focus:ring-0 focus:border-transparent w-[auto] `}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  value={
                    userPreferences.dailyNotificationTime
                    // ? userPreferences.dailyNotificationTime
                    // : "21:00"
                  }
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
