import { useEffect } from "react";
import Sheet from "react-modal-sheet";
// @ts-ignore
import Switch from "react-ios-switch";
import { LocalNotifications } from "@capacitor/local-notifications";
// import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { PreferenceType } from "../../types/types";

const NotificationsBottomSheet = ({
  setHandleNotificationsModal,
  handleNotificationsModal,
  // dbConnection,
  modifyDataInUserPreferencesTable,
  // checkAndOpenOrCloseDBConnection,
  setDailyNotification,
  dailyNotification,
  setDailyNotificationTime,
  dailyNotificationTime,
}: {
  setHandleNotificationsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleNotificationsModal: boolean;
  // dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  modifyDataInUserPreferencesTable: (
    value: string,
    preference: PreferenceType
  ) => Promise<void>;
  // checkAndOpenOrCloseDBConnection: (action: string) => Promise<void>;
  setDailyNotification: React.Dispatch<React.SetStateAction<string>>;
  dailyNotification: string;
  setDailyNotificationTime: React.Dispatch<React.SetStateAction<string>>;
  dailyNotificationTime: string;
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

  // async function checkNotificationPermissions() {
  //   const checkPermission = await LocalNotifications.checkPermissions();
  //   const userNotificationPermission = checkPermission.display;
  //   if (userNotificationPermission === "denied") {
  //     alert("Please turn notifications back on from within system settings");
  //     setDailyNotification("0");
  //     return;
  //   } else if (userNotificationPermission === "granted") {
  //     setDailyNotification("1");

  //     // const notificationTime = dailyNotificationTime.split(":").map(Number);
  //     // scheduleDailyNotification(notificationTime[0], notificationTime[1]);
  //   } else if (
  //     userNotificationPermission === "prompt" ||
  //     userNotificationPermission === "prompt-with-rationale"
  //   ) {
  //     setDailyNotification("0");
  //     requestPermissionFunction();
  //   }
  // }

  // const requestPermissionFunction = async () => {
  //   const requestPermission = await LocalNotifications.requestPermissions();
  //   if (requestPermission.display == "granted") {
  //     setDailyNotification("1");
  //     modifyDataInUserPreferencesTable("1", "dailyNotification");
  //   } else if (
  //     requestPermission.display == "prompt" ||
  //     requestPermission.display == "denied"
  //   ) {
  //     setDailyNotification("0");
  //     modifyDataInUserPreferencesTable("0", "dailyNotification");
  //   }
  // };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyNotificationTime(e.target.value);
    const [hour, minute] = e.target.value.split(":").map(Number);
    scheduleDailyNotification(hour, minute);
    modifyDataInUserPreferencesTable(e.target.value, "dailyNotificationTime");
    // localStorage.setItem("dailyNotificationTime", e.target.value);
  };

  useEffect(() => {
    modifyDataInUserPreferencesTable(dailyNotification, "dailyNotification");
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
                checked={dailyNotification === "1" ? true : false}
                className={undefined}
                disabled={undefined}
                handleColor="white"
                name={undefined}
                offColor="white"
                onChange={() => {
                  setDailyNotification((prevValue) => {
                    return prevValue === "1" ? "0" : "1";
                  });
                }}
                onColor="lightblue"
                pendingOffColor={undefined}
                pendingOnColor={undefined}
                readOnly={undefined}
                style={undefined}
              />
            </div>
            {dailyNotification === "1" ? (
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
