import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../../utils/constants";

// import { CalculationMethod } from "adhan";

interface BottomSheetShafaqRulesProps {
  setShowShafaqRulesSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showShafaqRulesSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetShafaqRules = ({
  //   triggerId,
  setShowShafaqRulesSheet,
  showShafaqRulesSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: BottomSheetShafaqRulesProps) => {
  return (
    <IonModal
      //   className="modal-fit-content"
      mode="ios"
      isOpen={showShafaqRulesSheet}
      //   trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onDidDismiss={() => {
        setShowShafaqRulesSheet(false);
      }}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
    >
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Calculation Methods</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
        <section className="px-4 mt-10">
          <p className="mb-5">
            Shafaq is used to determine what type of twilight to use in order to
            determine the time for Isha.
          </p>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "shafaqRule",
                "general",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.shafaqRule === "general" ? "bg-blue-500" : ""
            }`}
          >
            <h5 className="mt-0">General</h5>
            <p className="text-sm">
              General is a combination of Ahmer and Abyad. This is the defualt
              value and will provide more reasonable times for locations at
              higher latitudes.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "shafaqRule",
                "ahmer",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.shafaqRule === "ahmer" ? "bg-blue-500" : ""
            }`}
          >
            <h5 className="mt-0">Ahmer</h5>
            <p className="text-sm">
              Ahmer means the twilight is the red glow in the sky. Used by the
              Shafi, Maliki, and Hanbali madhabs. This generally produces an
              earlier Isha time.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "shafaqRule",
                "abyad",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.shafaqRule === "abyad" ? "bg-blue-500" : ""
            }`}
          >
            <h5 className="mt-0">Abyad</h5>
            <p className="text-sm">
              Abyad means the twilight is the white glow in the sky. Used by the
              Hanafi madhab. This generally produces a later Isha time.
            </p>
          </div>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetShafaqRules;
