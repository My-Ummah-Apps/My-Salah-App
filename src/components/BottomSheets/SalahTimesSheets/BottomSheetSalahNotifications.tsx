import {
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  LocationsDataObjTypeArr,
  SalahNamesTypeAdhanLibrary,
  userPreferencesType,
} from "../../../types/types";
import {
  cancelSalahReminderNotifications,
  promptToOpenDeviceSettings,
  scheduleSalahTimesNotifications,
  updateUserPrefs,
  upperCaseFirstLetter,
} from "../../../utils/helpers";
import { AndroidSettings } from "capacitor-native-settings";
import { Capacitor } from "@capacitor/core";
import {
  checkmarkCircle,
  megaphone,
  notifications,
  notificationsOff,
} from "ionicons/icons";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../../utils/constants";

interface BottomSheetSalahNotificationsProps {
  setShowSalahNotificationsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showSalahNotificationsSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  selectedSalah: SalahNamesTypeAdhanLibrary;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr;
}

const BottomSheetSalahNotifications = ({
  setShowSalahNotificationsSheet,
  showSalahNotificationsSheet,
  dbConnection,
  selectedSalah,
  setUserPreferences,
  userPreferences,
  userLocations,
}: BottomSheetSalahNotificationsProps) => {
  const key: keyof userPreferencesType = `${selectedSalah}Notification`;

  const handleBatteryOptimisation = async () => {
    if (
      // userPreferences.hasSeenBatteryPrompt === "0" &&
      Capacitor.getPlatform() === "android"
    ) {
      await promptToOpenDeviceSettings(
        "Ensure prayer notifications arrive on time",
        "Some Android phones delay notifications to save battery. Disabling battery optimisation helps prayer notifications arrive on time.",
        AndroidSettings.BatteryOptimization,
      );

      // await updateUserPrefs(
      //   dbConnection,
      //   "hasSeenBatteryPrompt",
      //   "1",
      //   setUserPreferences,
      // );
    }
  };

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      isOpen={showSalahNotificationsSheet}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onDidDismiss={() => {
        setShowSalahNotificationsSheet(false);
      }}
      // style={{ "--height": "80vh" }}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>
            {upperCaseFirstLetter(selectedSalah)} Notifications
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* <IonContent > */}
      <section className="px-4">
        <div
          onClick={async () => {
            await updateUserPrefs(dbConnection, key, "off", setUserPreferences);
            await cancelSalahReminderNotifications(selectedSalah);
          }}
          className={`options-wrap justify-between ${
            userPreferences[key as keyof userPreferencesType] === "off"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="flex">
            <div className="mr-2">
              <IonIcon
                color="primary"
                className={` ${
                  userPreferences[key as keyof userPreferencesType] === "off"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                icon={checkmarkCircle}
              />
            </div>
            <div>
              <p className="mt-0">Silent</p>
              <p className="text-xs">No notifications will be sent.</p>
            </div>
          </div>
          <div
            // className="flex items-center mr-4"
            className="flex items-center "
          >
            <IonIcon icon={notificationsOff} />
          </div>
        </div>
        <div
          onClick={async () => {
            if (!userLocations) {
              console.error("userLocations is undefined");
              return;
            }

            await cancelSalahReminderNotifications(selectedSalah);

            await updateUserPrefs(dbConnection, key, "on", setUserPreferences);

            await scheduleSalahTimesNotifications(
              userLocations,
              selectedSalah,
              userPreferences,
              "on",
            );

            await handleBatteryOptimisation();
          }}
          className={`options-wrap justify-between  ${
            userPreferences[key as keyof userPreferencesType] === "on"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="flex">
            <div className="mr-2">
              <IonIcon
                color="primary"
                className={` ${
                  userPreferences[key as keyof userPreferencesType] === "on"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                icon={checkmarkCircle}
              />
            </div>
            <div>
              <p className="mt-0">On</p>
              <p className="text-xs">
                Banner notification only with default system sound.
              </p>
            </div>
          </div>
          <div
            // className="flex items-center mr-4"
            className="flex items-center "
          >
            <IonIcon icon={notifications} />
          </div>
        </div>
        {selectedSalah !== "sunrise" && (
          <div
            onClick={async () => {
              if (!userLocations) {
                console.error("userLocations is undefined");
                return;
              }

              await cancelSalahReminderNotifications(selectedSalah);

              await updateUserPrefs(
                dbConnection,
                key,
                "adhan",
                setUserPreferences,
              );

              await scheduleSalahTimesNotifications(
                userLocations,
                selectedSalah,
                userPreferences,
                "adhan",
              );

              await handleBatteryOptimisation();
            }}
            className={`options-wrap justify-between ${
              userPreferences[key as keyof userPreferencesType] === "adhan"
                ? "border-blue-500"
                : "border-transparent"
            }`}
          >
            <div className="flex">
              <div className="mr-2">
                <IonIcon
                  color="primary"
                  className={` ${
                    userPreferences[key as keyof userPreferencesType] ===
                    "adhan"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  icon={checkmarkCircle}
                />
              </div>
              <div>
                <p className="mt-0">Athan</p>
                <p className="text-xs">
                  Athan by Mishary Rashid Al-Afasy + banner notification
                </p>
              </div>
            </div>
            <div
              // className="flex items-center mr-4"
              className="flex items-center "
            >
              <IonIcon icon={megaphone} />
            </div>
          </div>
        )}
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetSalahNotifications;
