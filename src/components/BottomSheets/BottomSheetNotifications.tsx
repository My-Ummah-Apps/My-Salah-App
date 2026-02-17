import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

import { AndroidSettings } from "capacitor-native-settings";

import {
  dailyNotificationOption,
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../types/types";

import type { InputCustomEvent, InputChangeEventDetail } from "@ionic/react";

import {
  checkNotificationPermissions,
  updateUserPrefs,
  promptToOpenDeviceSettings,
  scheduleFixedTimeDailyNotification,
  cancelNotifications,
  scheduleSalahNotifications,
  isBatteryOptimizationEnabled,
  // requestIgnoreBatteryOptimization,
  scheduleAfterIshaDailyNotifications,
} from "../../utils/helpers";
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonToggle,
  isPlatform,
} from "@ionic/react";
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
  isAppActive,
  setUserPreferences,
  userPreferences,
  userLocations,
}: {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  triggerId: string;
  isAppActive: boolean;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr;
}) => {
  const [dailyNotificationToggle, setDailyNotificationToggle] =
    useState<boolean>(userPreferences.dailyNotification === "1" ? true : false);

  const [notificationToggle, setNotificationToggle] = useState(false);

  const [isBatteryOptEnabled, setIsBatteryOptEnabled] =
    useState<boolean>(false);
  const [selectedDailyNotificationOption, setSelectedDailyNotificationOption] =
    useState(userPreferences.dailyNotificationOption);

  const getBatteryOptimizationStatus = async () => {
    if (Capacitor.getPlatform() !== "android") return;
    const res = await isBatteryOptimizationEnabled();
    setIsBatteryOptEnabled(res);
  };

  useEffect(() => {
    const battOptStatus = async () => {
      await getBatteryOptimizationStatus();
    };

    if (!isAppActive) return;

    battOptStatus();
  }, [isAppActive]);

  const isAfterIshaOptionEnabled =
    userPreferences.prayerCalculationMethod !== "" && userLocations.length > 0;

  const minuteIntervals = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

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
          setNotificationToggle(true);
        }
      }
    }
  };

  const scheduleFixedOrAfterIshaDailyNotifications = async (
    setting: dailyNotificationOption,
  ) => {
    await cancelNotifications("Daily Reminder");

    if (setting === "fixedTime") {
      const [hour, minute] = userPreferences.dailyNotificationTime
        .split(":")
        .map(Number);
      await scheduleFixedTimeDailyNotification(hour, minute);
    } else if (setting === "afterIsha") {
      await scheduleAfterIshaDailyNotifications(
        Number(userPreferences.dailyNotificationAfterIshaDelay),
        userLocations,
        userPreferences,
      );
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
        await cancelNotifications("Daily Reminder");
      } else if (dailyNotificationToggle === false) {
        await scheduleFixedOrAfterIshaDailyNotifications(
          userPreferences.dailyNotificationOption,
        );
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
      await scheduleFixedTimeDailyNotification(hour, minute);

      // await updateUserPrefs(
      //   dbConnection,
      //   "dailyNotification",
      //   "1",
      //   setUserPreferences,
      // );
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

  const handleTimeChange = async (
    e: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    if (!e.detail.value) return;

    const userSelectedTime = e.detail.value;

    setUserPreferences((userPreferences) => ({
      ...userPreferences,
      dailyNotificationTime: userSelectedTime,
    }));
    const [hour, minute] = userSelectedTime.split(":").map(Number);

    await scheduleFixedTimeDailyNotification(hour, minute);
    await updateUserPrefs(
      dbConnection,
      "dailyNotificationTime",
      userSelectedTime,
      setUserPreferences,
    );
  };

  // useEffect(() => {
  //   const notificationValue = dailyNotificationToggle === true ? "1" : "0";
  //   setUserPreferences((userPreferences) => ({
  //     ...userPreferences,
  //     dailyNotification: notificationValue,
  //   }));
  //   const modifyDBAndState = async () => {
  //     await updateUserPrefs(
  //       dbConnection,
  //       "dailyNotification",
  //       notificationValue,
  //       setUserPreferences,
  //     );
  //   };
  //   modifyDBAndState();
  // }, [dailyNotificationToggle]);

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onWillPresent={async () => {
        getNotificationStatuses();
        await getBatteryOptimizationStatus();
      }}
    >
      <section className="mb-10">
        <div className="flex items-center justify-between p-3 mt-10 notification-text-and-toggle-wrap">
          <p>Turn on Daily Notification</p>{" "}
          <IonToggle
            mode={isPlatform("android") ? "md" : "ios"}
            style={{ "--track-background": "#555" }}
            checked={dailyNotificationToggle}
            onIonChange={async (e) => {
              const toggleStatus = e.detail.checked;

              const notificationValue = toggleStatus === true ? "1" : "0";

              await updateUserPrefs(
                dbConnection,
                "dailyNotification",
                notificationValue,
                setUserPreferences,
              );

              await handleNotificationPermissions();
              // console.log(
              //   "PENDING NOTIFICATIONS: ",
              //   (await LocalNotifications.getPending()).notifications,
              // );
            }}
          ></IonToggle>
        </div>

        {dailyNotificationToggle && (
          <div
          // className="flex flex-col py-3 border-b border-[var(--app-border-color)]"
          >
            <IonList
              style={{
                "--background": "transparent",
                background: "transparent",
              }}
            >
              <IonRadioGroup
                value={selectedDailyNotificationOption}
                onIonChange={async (e) => {
                  const eventValue = e.detail.value;

                  setSelectedDailyNotificationOption(eventValue);
                  await updateUserPrefs(
                    dbConnection,
                    "dailyNotificationOption",
                    eventValue,
                    setUserPreferences,
                  );

                  await scheduleFixedOrAfterIshaDailyNotifications(eventValue);
                }}
              >
                <IonItem
                  style={{
                    "--background": "transparent",
                    background: "transparent",
                  }}
                  lines="none"
                >
                  <IonRadio
                    mode="ios"
                    slot="start"
                    labelPlacement="end"
                    value="fixedTime"
                    color="primary"
                  >
                    At fixed time
                  </IonRadio>
                  <IonInput
                    slot="end"
                    onIonChange={async (e) => {
                      e.stopPropagation();
                      await handleTimeChange(e);
                    }}
                    style={{
                      "--background": "var(--card-bg-color)",
                    }}
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
                </IonItem>
                {/* {userPreferences.prayerCalculationMethod !== "" &&
                  userLocations.length > 0 && ( */}
                <IonItem
                  style={{
                    "--background": "transparent",
                    background: "transparent",
                  }}
                  lines="none"
                >
                  <IonRadio
                    mode="ios"
                    slot="start"
                    labelPlacement="end"
                    value="afterIsha"
                    color="primary"
                    disabled={
                      // userPreferences.prayerCalculationMethod === "" ||
                      // userLocations.length === 0
                      !isAfterIshaOptionEnabled
                    }
                  >
                    After Isha
                  </IonRadio>
                  <IonSelect
                    slot="end"
                    label=""
                    disabled={
                      !isAfterIshaOptionEnabled
                      // userPreferences.prayerCalculationMethod === "" ||
                      // userLocations.length === 0
                    }
                    placeholder={`${userPreferences.dailyNotificationAfterIshaDelay} minutes`}
                    onIonChange={async (e) => {
                      e.stopPropagation();
                      const delay = e.detail.value;
                      if (selectedDailyNotificationOption === "afterIsha") {
                        await scheduleAfterIshaDailyNotifications(
                          delay,
                          userLocations,
                          userPreferences,
                        );
                      }
                      await updateUserPrefs(
                        dbConnection,
                        "dailyNotificationAfterIshaDelay",
                        String(delay),
                        setUserPreferences,
                      );
                    }}
                  >
                    {minuteIntervals.map((min) => {
                      return (
                        <IonSelectOption
                          key={min}
                          value={min}
                        >{`${min} minutes`}</IonSelectOption>
                      );
                    })}
                  </IonSelect>
                </IonItem>
                {!isAfterIshaOptionEnabled && (
                  <p className="mx-4 mt-2 text-xs text-center opacity-70">
                    Please set up salah times to use the 'After Isha' option
                  </p>
                )}
                {/* )} */}
              </IonRadioGroup>
            </IonList>
          </div>
        )}
        {userPreferences.prayerCalculationMethod !== "" &&
          userLocations.length > 0 && (
            <section className="px-3 mt-5">
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
                        if (salah === "sunrise") continue;
                        await scheduleSalahNotifications(
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
                        await cancelNotifications(salah);
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
              <p className="mt-3 text-sm opacity-50">
                Turn this on to receive all Salah reminders. You can also manage
                individual reminders on the Salah Times page.
              </p>
            </section>
          )}
        {Capacitor.getPlatform() === "android" && (
          <section className="p-3 mt-10 mb-10">
            <div className="flex items-center justify-between notification-text-and-toggle-wrap">
              <p>
                Battery Optimisation Is Currently:{" "}
                <span
                  className={`${isBatteryOptEnabled ? "text-red-500" : "text-green-500"}`}
                >{`${isBatteryOptEnabled ? "Enabled" : "Disabled"}`}</span>
              </p>{" "}
            </div>

            {isBatteryOptEnabled && (
              <>
                <p className="mt-3 mb-5 text-sm opacity-50">
                  {`Battery optimization for this app is currently on, which may delay notifications. To ensure timely alerts, you can turn it off in Settings:`}
                </p>{" "}
                <IonButton
                  className="text-xs"
                  onClick={async () => {
                    // const res = await requestIgnoreBatteryOptimization();
                    // console.log("res: ", res);
                    // await getBatteryOptimizationStatus();

                    await promptToOpenDeviceSettings(
                      "Disable Battery Optimization",
                      "To ensure notifications arrive on time, please turn off battery optimization for this app.",
                      AndroidSettings.BatteryOptimization,
                    );
                  }}
                >
                  Turn off battery optimisation
                </IonButton>
              </>
            )}
            {!isBatteryOptEnabled && (
              <p className="mt-3 text-sm opacity-50">
                {`Battery optimization is off, so notifications should arrive promptly.`}
              </p>
            )}
          </section>
        )}
      </section>
    </IonModal>
  );
};

export default BottomSheetNotifications;
