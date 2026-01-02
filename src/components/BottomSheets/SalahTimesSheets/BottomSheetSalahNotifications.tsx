import {
  IonContent,
  IonHeader,
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
  scheduleSalahTimesNotifications,
  updateUserPrefs,
} from "../../../utils/constants";

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

  return (
    <IonModal
      //   className="modal-fit-content"
      mode="ios"
      isOpen={showSalahNotificationsSheet}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onDidDismiss={() => {
        setShowSalahNotificationsSheet(false);
      }}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      //   style={{ "--height": "80vh" }}
      // expandToScroll={false}
    >
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Calculation Methods</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
        <section className="px-4 mt-10">
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                key,
                "off",
                setUserPreferences
              );

              await cancelSalahReminderNotifications(selectedSalah);
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences[key] === "off" ? "bg-blue-500" : ""
            }`}
          >
            <h5 className="mt-0">Silent</h5>
            <p className="text-sm">No notifications will be sent.</p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                key,
                "on",
                setUserPreferences
              );

              await scheduleSalahTimesNotifications(
                dbConnection,
                selectedSalah,
                userPreferences,
                "on"
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences[key] === "on" ? "bg-blue-500" : ""
            }`}
          >
            <h5 className="mt-0">Notification</h5>
            <p className="text-sm">Banner notification with default sound.</p>
          </div>
          <div
            onClick={async () => {
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
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences[key] === "adhan" ? "bg-blue-500" : ""
            }`}
          >
            <h5 className="mt-0">Adhan</h5>
            <p className="text-sm">
              Adhan by [insert name] + banner notification
            </p>
          </div>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetSalahNotifications;
