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
      <section className="px-4 mt-10">
        {/* <p className="mb-5">
            Shafaq is used to determine what type of twilight to use in order to
            determine the time for Isha.
          </p> */}
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "madhab",
              "shafi",
              setUserPreferences
            );
          }}
          className={`p-2 mb-5 border rounded-lg ${
            userPreferences.madhab === "shafi" ? "bg-blue-500" : ""
          }`}
        >
          <h5 className="mt-0">Earlier Asr Time</h5>
          <p className="text-sm">Shafi'i, Maliki & Hanbali</p>
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
          className={`p-2 mb-5 border rounded-lg ${
            userPreferences.madhab === "hanafi" ? "bg-blue-500" : ""
          }`}
        >
          <h5 className="mt-0">Later Asr Time</h5>
          <p className="text-sm">Hanafi</p>
        </div>
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetMadhabOptions;
