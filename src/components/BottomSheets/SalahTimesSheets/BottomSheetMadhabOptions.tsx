import {
  IonContent,
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

interface BottomSheetMadhabOptionsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetMadhabOptions = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: BottomSheetMadhabOptionsProps) => {
  return (
    <IonModal
      className="modal-fit-content "
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}

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
          <IonTitle>Madhab</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* <IonContent> */}
      <section className="mx-4">
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "madhab",
              "shafi",
              setUserPreferences
            );
          }}
          className={`options-wrap ${
            userPreferences.madhab === "shafi"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.madhab === "shafi" ? "opacity-100" : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>

          <div>
            <p className="mt-0">Shafi'i, Maliki & Hanbali</p>
            <p className="text-xs">Earlier Asr time</p>
          </div>
        </div>

        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "madhab",
              "hanafi",
              setUserPreferences
            );
          }}
          className={`options-wrap   ${
            userPreferences.madhab === "hanafi"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.madhab === "hanafi"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />{" "}
          </div>
          {/* ! HANAFI NOW! */}
          <div>
            <p className="mt-0">Hanafi</p>
            <p className="text-xs">Later Asr time</p>
          </div>
        </div>
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetMadhabOptions;
