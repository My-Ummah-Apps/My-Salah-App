import { IonContent, IonModal } from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../../utils/constants";

// import { CalculationMethod } from "adhan";

interface BottomSheetPolarCircleSettingProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetPolarCircleSetting = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: BottomSheetPolarCircleSettingProps) => {
  return (
    <IonModal
      //   className="modal-fit-content"
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}

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
                "polarCircleResolution",
                "unresolved",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.polarCircleResolution === "unresolved"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Unresolved</h5>
            <p className="text-sm">
              (default) Leaves sunrise and sunset prayer times undefined when
              they can't be computed
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "polarCircleResolution",
                "aqrabBalad",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.polarCircleResolution === "aqrabBalad"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">AqrabBalad</h5>
            <p className="text-sm">
              Finds the closest location for which sunrise and sunset prayer
              times can be computed
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "polarCircleResolution",
                "aqrabYaum",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.polarCircleResolution === "aqrabYaum"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">AqrabYaum</h5>
            <p className="text-sm">
              Finds the closest date (forward or backward) for which sunrise and
              sunset prayer times can be computed
            </p>
          </div>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetPolarCircleSetting;
