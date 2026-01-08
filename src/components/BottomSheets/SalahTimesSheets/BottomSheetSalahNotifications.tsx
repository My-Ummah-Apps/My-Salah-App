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
import { checkmarkCircle, notificationsOff } from "ionicons/icons";

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
  //   console.log("key: ", key);

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {selectedSalah.charAt(0).toUpperCase() + selectedSalah.slice(1)}{" "}
            Notifications
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* <IonContent > */}
      <section className="px-4 mt-10">
        <div
          onClick={async () => {
            await updateUserPrefs(dbConnection, key, "off", setUserPreferences);

            await cancelSalahReminderNotifications(selectedSalah);
          }}
          className={`p-2 mb-5 border rounded-lg flex justify-between ${
            userPreferences[key] === "off" ? "bg-blue-500" : ""
          }`}
        >
          <div className="flex">
            <div className="mr-2">
              <IonIcon
                color="primary"
                // className={` ${
                //   userPreferences.madhab === "shafi" ? "opacity-100" : "opacity-0"
                // }`}
                icon={checkmarkCircle}
              />
            </div>
            <div>
              <p className="mt-0">Silent</p>
              <p className="text-sm">No notifications will be sent.</p>
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
          className={`p-2 mb-5 border rounded-lg ${
            userPreferences[key] === "on" ? "bg-blue-500" : ""
          }`}
        >
          <p className="mt-0">Notification</p>
          <p className="text-sm">Banner notification with default sound.</p>
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
          className={`p-2 mb-5 border rounded-lg ${
            userPreferences[key] === "adhan" ? "bg-blue-500" : ""
          }`}
        >
          <p className="mt-0">Adhan</p>
          <p className="text-sm">
            Adhan by [insert name] + banner notification
          </p>
        </div>
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetSalahNotifications;
