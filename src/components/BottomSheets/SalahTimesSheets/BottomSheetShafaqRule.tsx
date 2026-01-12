import {
  IonHeader,
  IonIcon,
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
import { checkmarkCircle } from "ionicons/icons";

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
      className="modal-fit-content"
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
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>Shafaq Rule</IonTitle>
        </IonToolbar>
      </IonHeader>
      <section className="px-4">
        <p className="mb-5 text-xs">
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
          className={`options-wrap ${
            userPreferences.shafaqRule === "general"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.shafaqRule === "general"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>
          <div>
            <p className="mt-0">General</p>
            <p className="text-xs">
              General is a combination of Ahmer and Abyad. This is the defualt
              value and will provide more reasonable times for locations at
              higher latitudes.
            </p>
          </div>
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
          className={`options-wrap ${
            userPreferences.shafaqRule === "ahmer"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.shafaqRule === "ahmer"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>
          <div>
            <p className="mt-0">Ahmer</p>
            <p className="text-xs">
              Ahmer means the twilight is the red glow in the sky. Used by the
              Shafi, Maliki, and Hanbali madhabs. This generally produces an
              earlier Isha time.
            </p>
          </div>
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
          className={`p-2 mb-5 border rounded-lg flex bg-[var(--sheet-option-bg)] ${
            userPreferences.shafaqRule === "abyad"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.shafaqRule === "abyad"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>
          <div>
            <p className="mt-0">Abyad</p>
            <p className="text-xs">
              Abyad means the twilight is the white glow in the sky. Used by the
              Hanafi madhab. This generally produces a later Isha time.
            </p>
          </div>
        </div>
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetShafaqRules;
