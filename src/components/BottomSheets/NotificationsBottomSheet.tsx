import { useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
// @ts-ignore
import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";

const NotificationsBottomSheet = ({
  setHandleNotificationsModal,
  handleNotificationsModal,
}: {
  setHandleNotificationsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleNotificationsModal: boolean;
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
      setDailyNotification("false");
      return;
    } else if (userNotificationPermission === "granted") {
      setDailyNotification("true");
      // const notificationTime = dailyNotificationTime.split(":").map(Number);
      // scheduleDailyNotification(notificationTime[0], notificationTime[1]);
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      setDailyNotification("false");
      requestPermissionFunction();
    }
  }

  const requestPermissionFunction = async () => {
    const requestPermission = await LocalNotifications.requestPermissions();
    if (requestPermission.display == "granted") {
      setDailyNotification("true");
    } else if (
      requestPermission.display == "prompt" ||
      requestPermission.display == "denied"
    ) {
      setDailyNotification("false");
    }
  };

  const [dailyNotification, setDailyNotification] = useState<string>(
    localStorage.getItem("daily-notification") || "false"
  );
  const defaultDailyNotificationTime = "21:00";
  const [dailyNotificationTime, setDailyNotificationTime] = useState<string>(
    localStorage.getItem("dailyNotificationTime") ||
      defaultDailyNotificationTime
  );

  useEffect(() => {
    if (localStorage.getItem("dailyNotificationTime") === null) {
      localStorage.setItem(
        "dailyNotificationTime",
        defaultDailyNotificationTime
      );
    }
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setDailyNotificationTime(e.target.value);
    const [hour, minute] = e.target.value.split(":").map(Number);
    scheduleDailyNotification(hour, minute);
    localStorage.setItem("dailyNotificationTime", e.target.value);
  };

  useEffect(() => {
    if (dailyNotification !== null) {
      localStorage.setItem("daily-notification", dailyNotification);
    }
  }, [dailyNotification]);

  useEffect(() => {
    if (localStorage.getItem("dailyNotificationTime") === null) {
      localStorage.setItem(
        "dailyNotificationTime",
        defaultDailyNotificationTime
      );
    }
  }, []);

  useEffect(() => {
    if (dailyNotification !== null) {
      localStorage.setItem("daily-notification", dailyNotification);
    }
  }, [dailyNotification]);

  return (
    <Sheet
      detent="content-height"
      tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      isOpen={handleNotificationsModal}
      onClose={() => setHandleNotificationsModal(false)}
    >
      <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
        <Sheet.Header />
        <Sheet.Content>
          <div className="h-[50vh]">
            <div className="flex items-center justify-between p-3 notification-text-and-toggle-wrap">
              <p>Turn on Daily Notification</p>{" "}
              <Switch
                checked={dailyNotification === "true" ? true : false}
                className={undefined}
                disabled={undefined}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={() => {
                  if (localStorage.getItem("daily-notification") === "true") {
                    setDailyNotification("false");
                  } else if (
                    localStorage.getItem("daily-notification") === "false"
                  ) {
                    setDailyNotification("true");
                    checkNotificationPermissions();
                  }
                }}
                onColor="lightblue"
                pendingOffColor={undefined}
                pendingOnColor={undefined}
                readOnly={undefined}
                style={undefined}
              />
            </div>
            {dailyNotification === "true" ? (
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
                    dailyNotification ? "slideUp" : ""
                  } focus:outline-none focus:ring-0 focus:border-transparent w-[auto] `}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  value={dailyNotificationTime}
                  required
                />
                {/* </p> */}
              </div>
            ) : null}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};

export default NotificationsBottomSheet;
