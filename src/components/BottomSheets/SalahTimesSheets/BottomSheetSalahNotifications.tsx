import {
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { SalahNamesType, userPreferencesType } from "../../../types/types";
import {
  cancelSalahReminderNotifications,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  promptToOpenDeviceSettings,
  scheduleSalahTimesNotifications,
  updateUserPrefs,
} from "../../../utils/constants";
import { AndroidSettings } from "capacitor-native-settings";
import { Capacitor } from "@capacitor/core";
import {
  checkmarkCircle,
  megaphone,
  notifications,
  notificationsOff,
} from "ionicons/icons";

// import { CalculationMethod } from "adhan";

interface BottomSheetSalahNotificationsProps {
  setShowSalahNotificationsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showSalahNotificationsSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  selectedSalah: SalahNamesType;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetSalahNotifications = ({
  setShowSalahNotificationsSheet,
  showSalahNotificationsSheet,
  dbConnection,
  selectedSalah,
  setUserPreferences,
  userPreferences,
}: BottomSheetSalahNotificationsProps) => {
  const key = `${selectedSalah}Notification`;
  // console.log("key: ", key);

  const handleBatteryOptimisation = async () => {
    if (
      userPreferences.hasSeenBatteryPrompt === "0" &&
      Capacitor.getPlatform() === "android"
    ) {
      await promptToOpenDeviceSettings(
        "Ensure prayer notifications arrive on time",
        "Some Android phones delay notifications to save battery. Disabling battery optimisation helps prayer notifications arrive on time.",
        AndroidSettings.BatteryOptimization
      );

      await updateUserPrefs(
        dbConnection,
        "hasSeenBatteryPrompt",
        "1",
        setUserPreferences
      );
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
            {selectedSalah.charAt(0).toUpperCase() + selectedSalah.slice(1)}{" "}
            Notifications
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
            userPreferences[key] === "off"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="flex">
            <div className="mr-2">
              <IonIcon
                color="primary"
                className={` ${
                  userPreferences[key] === "off" ? "opacity-100" : "opacity-0"
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
            await cancelSalahReminderNotifications(selectedSalah);

            await updateUserPrefs(dbConnection, key, "on", setUserPreferences);

            await scheduleSalahTimesNotifications(
              dbConnection,
              selectedSalah,
              userPreferences,
              "on"
            );

            await handleBatteryOptimisation();
          }}
          className={`options-wrap justify-between  ${
            userPreferences[key] === "on"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="flex">
            <div className="mr-2">
              <IonIcon
                color="primary"
                className={` ${
                  userPreferences[key] === "on" ? "opacity-100" : "opacity-0"
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
        <div
          onClick={async () => {
            await cancelSalahReminderNotifications(selectedSalah);

            await updateUserPrefs(
              dbConnection,
              key,
              "adhan",
              setUserPreferences
            );
            await scheduleSalahTimesNotifications(
              dbConnection,
              selectedSalah,
              userPreferences,
              "adhan"
            );

            await handleBatteryOptimisation();
          }}
          className={`options-wrap justify-between ${
            userPreferences[key] === "adhan"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="flex">
            <div className="mr-2">
              <IonIcon
                color="primary"
                className={` ${
                  userPreferences[key] === "adhan" ? "opacity-100" : "opacity-0"
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
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetSalahNotifications;
