import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../../types/types";

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calculation Methods</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="px-4">
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerLatitudeRule",
                "MiddleOfTheNight",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerLatitudeRule === "MiddleOfTheNight"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Middle Of The Night</h5>
            <p className="text-sm">
              Fajr will never be earlier than the middle of the night and Isha
              will never be later than the middle of the night.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerLatitudeRule",
                "SeventhOfTheNight",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerLatitudeRule === "SeventhOfTheNight"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Seventh Of The Night</h5>
            <p className="text-sm">
              Fajr will never be earlier than the beginning of the last seventh
              of the night and Isha will never be later than the end of the
              first seventh of the night. This is recommended to use for
              locations above 48° latitude to prevent prayer times that would be
              difficult to perform.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerLatitudeRule",
                "TwilightAngle",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerLatitudeRule === "TwilightAngle"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Twilight Angle</h5>
            <p className="text-sm">
              The night is divided into portions of roughly 1/3. The exact value
              is derived by dividing the fajr/isha angles by 60. This can be
              used to prevent difficult fajr and isha times at certain
              locations.
            </p>
          </div>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetLatitudeRules;
