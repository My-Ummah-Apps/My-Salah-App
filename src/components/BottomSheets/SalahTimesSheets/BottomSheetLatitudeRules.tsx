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

interface BottomSheetLatitudeRulesProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetLatitudeRules = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: BottomSheetLatitudeRulesProps) => {
  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // expandToScroll={false}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>High Latitude Rule</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* <IonContent> */}
      <section className="mx-4">
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "highLatitudeRule",
              "middleofthenight",
              setUserPreferences,
            );
          }}
          className={`options-wrap ${
            userPreferences.highLatitudeRule === "middleofthenight"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.highLatitudeRule === "middleofthenight"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />
          </div>

          <div>
            <p className="mt-0">Middle Of The Night</p>
            <p className="text-xs">
              Fajr will never be earlier than the middle of the night and Isha
              will never be later than the middle of the night.
            </p>
          </div>
        </div>
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "highLatitudeRule",
              "seventhofthenight",
              setUserPreferences,
            );
          }}
          className={`options-wrap  ${
            userPreferences.highLatitudeRule === "seventhofthenight"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={` ${
                userPreferences.highLatitudeRule === "seventhofthenight"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />{" "}
          </div>
          <div>
            <p className="mt-0">Seventh Of The Night</p>
            <p className="text-xs">
              Fajr will never be earlier than the beginning of the last seventh
              of the night and Isha will never be later than the end of the
              first seventh of the night. This is recommended to use for
              locations above 48° latitude to prevent prayer times that would be
              difficult to perform.
            </p>
          </div>
        </div>
        <div
          onClick={async () => {
            await updateUserPrefs(
              dbConnection,
              "highLatitudeRule",
              "twilightangle",
              setUserPreferences,
            );
          }}
          className={`options-wrap ${
            userPreferences.highLatitudeRule === "twilightangle"
              ? "border-blue-500"
              : "border-transparent"
          }`}
        >
          <div className="mr-2">
            <IonIcon
              color="primary"
              className={`${
                userPreferences.highLatitudeRule === "twilightangle"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              icon={checkmarkCircle}
            />{" "}
          </div>
          <div>
            <p className="mt-0">Twilight Angle</p>
            <p className="text-xs">
              The night is divided into portions of roughly 1/3. The exact value
              is derived by dividing the fajr/isha angles by 60. This can be
              used to prevent difficult fajr and isha times at certain
              locations.
            </p>
          </div>
        </div>
      </section>
      {/* </IonContent> */}
    </IonModal>
  );
};

export default BottomSheetLatitudeRules;
