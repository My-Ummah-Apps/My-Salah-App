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
} from "../../../utils/constants";
import { checkmarkCircle } from "ionicons/icons";
import { updateUserPrefs } from "../../../utils/helpers";

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
      className="modal-fit-content"
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
          <IonTitle>Polar Circle Resolution</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* <IonContent> */}
      <section className="px-4">
        <p className="mb-5 text-sm text-center opacity-80">
          This setting is intended for users in polar regions or with advanced
          knowledge of prayer calculation methods. For most users, it will not
          have any effect. Only change this if you understand how it works, as
          incorrect settings can affect your prayer times.
        </p>
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "polarCircleResolution",
              "Unresolved",
              setUserPreferences,
            );
          }}
          className={`options-wrap   ${
            userPreferences.polarCircleResolution === "Unresolved"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.polarCircleResolution === "Unresolved"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>
          <div>
            <p className="mt-0">Unresolved (default)</p>
            <p className="text-xs">
              Leaves sunrise and sunset Salah times undefined when they can't be
              computed
            </p>
          </div>
        </div>
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "polarCircleResolution",
              "AqrabBalad",
              setUserPreferences,
            );
          }}
          className={`p-2 mb-5 border rounded-lg bg-[var(--sheet-option-bg)] flex ${
            userPreferences.polarCircleResolution === "AqrabBalad"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.polarCircleResolution === "AqrabBalad"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>
          <div>
            <p className="mt-0">Closest City</p>
            <p className="text-xs">
              Finds the closest location for which sunrise and sunset Salah
              times can be computed
            </p>
          </div>
        </div>
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "polarCircleResolution",
              "AqrabYaum",
              setUserPreferences,
            );
          }}
          className={`options-wrap  ${
            userPreferences.polarCircleResolution === "AqrabYaum"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.polarCircleResolution === "AqrabYaum"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>
          <div>
            <p className="mt-0">Closest Date</p>
            <p className="text-xs">
              Finds the closest date (forward or backward) for which sunrise and
              sunset Salah times can be computed
            </p>
          </div>
        </div>
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetPolarCircleSetting;
