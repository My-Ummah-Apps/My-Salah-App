import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

import { AndroidSettings } from "capacitor-native-settings";

import {
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../types/types";
import {
  checkNotificationPermissions,
  updateUserPrefs,
  promptToOpenDeviceSettings,
  scheduleDailyNotification,
  cancelSalahReminderNotifications,
  scheduleSalahTimesNotifications,
  isBatteryOptimizationEnabled,
  requestIgnoreBatteryOptimization,
} from "../../utils/helpers";
import { IonModal, IonToggle, isPlatform } from "@ionic/react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  adhanLibrarySalahs,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import { Capacitor } from "@capacitor/core";

const BottomSheetNotifications = ({
  dbConnection,
  triggerId,
  setUserPreferences,
  userPreferences,
  userLocations,
}: {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  triggerId: string;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr;
}) => {
  const [dailyNotificationToggle, setDailyNotificationToggle] =
    useState<boolean>(userPreferences.dailyNotification === "1" ? true : false);

  const [notificationToggle, setNotificationToggle] = useState(false);

  const cancelNotification = async (id: number) => {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  };

  const [isBatteryOptEnabled, setIsBatteryOptEnabled] =
    useState<boolean>(false);

  const getBatteryOptimisationStatus = async () => {
    if (Capacitor.getPlatform() !== "android" || !Capacitor.isNativePlatform())
      return;

    const getBatteryOptimizationStatus = async () => {
      const res = await isBatteryOptimizationEnabled();
      setIsBatteryOptEnabled(res);
    };

    getBatteryOptimizationStatus();
  };

  const getNotificationStatuses = () => {
    const notifications = [
      "fajrNotification",
      "sunriseNotification",
      "dhuhrNotification",
      "asrNotification",
      "maghribNotification",
      "ishaNotification",
    ];

    for (const [key, value] of Object.entries(userPreferences)) {
      if (notifications.includes(key)) {
        if (value === "on" || value === "adhan") {
          console.log("key, value: ", key, value);
          setNotificationToggle(true);
        }
      }
    }
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
      onWillPresent={async () => {
        getNotificationStatuses();
        await getBatteryOptimisationStatus();
      }}
    >
      <section
      //  className="h-[50vh]"
      >
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
        <section className="p-3 mt-10 ">
          <div className="flex items-center justify-between notification-text-and-toggle-wrap">
            <p>Turn on Salah Notifications</p>{" "}
            <IonToggle
              mode={isPlatform("android") ? "md" : "ios"}
              style={{ "--track-background": "#555" }}
              checked={notificationToggle}
              onIonChange={async () => {
                if (!notificationToggle) {
                  setNotificationToggle(true);

                  const salahs = adhanLibrarySalahs;

                  for (const salah of salahs) {
                    await scheduleSalahTimesNotifications(
                      userLocations,
                      salah,
                      userPreferences,
                      "on",
                    );
                  }

                  for (const salah of adhanLibrarySalahs) {
                    await updateUserPrefs(
                      dbConnection,
                      `${salah}Notification`,
                      "on",
                      setUserPreferences,
                    );
                  }
                } else {
                  setNotificationToggle(false);

                  for (const salah of adhanLibrarySalahs) {
                    await cancelSalahReminderNotifications(salah);
                  }
                  for (const salah of adhanLibrarySalahs) {
                    await updateUserPrefs(
                      dbConnection,
                      `${salah}Notification`,
                      "off",
                      setUserPreferences,
                    );
                  }
                }
              }}
            ></IonToggle>
          </div>
          <p className="mt-5 opacity-50">
            Turn this on to receive all prayer and sunrise reminders. You can
            also manage individual reminders on the Salah Times page.
          </p>
        </section>
        {/* {Capacitor.getPlatform() === "android" && ( */}
        <section className="p-3 mt-10 mb-10">
          <div className="flex items-center justify-between notification-text-and-toggle-wrap">
            <p>Battery Optimisation Disabled</p>{" "}
            <IonToggle
              mode={isPlatform("android") ? "md" : "ios"}
              style={{ "--track-background": "#555" }}
              checked={isBatteryOptEnabled}
              onIonChange={async () => {
                await requestIgnoreBatteryOptimization();
                getBatteryOptimisationStatus();
                console.log("HELLO");
              }}
            ></IonToggle>
          </div>
          <p className="mt-5 opacity-50">
            Disable battery optimisation to ensure notifications arrive on time.
          </p>
        </section>
        {/* // )} */}
      </section>
    </IonModal>
  );
};

export default BottomSheetNotifications;
