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
import {
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../types/types";

// import { CalculationMethod } from "adhan";

interface BottomSheetCalculationMethodsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetCalculationMethods = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: BottomSheetCalculationMethodsProps) => {
  return (
    <IonModal
      // className="modal-fit-content"

      mode="ios"
      //   isOpen={showAddLocationSheet}
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
                "prayerCalculationMethod",
                "MuslimWorldLeague",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "MuslimWorldLeague"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Muslim World League</h5>
            <p className="text-sm">
              Muslim World League. Standard Fajr time with an angle of 18°.
              Earlier Isha time with an angle of 17°.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Egyptian",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Egyptian"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Egypt</h5>
            <p className="text-sm">
              Egyptian General Authority of Survey. Early Fajr time using an
              angle 19.5° and a slightly earlier Isha time using an angle of
              17.5°.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Karachi",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Karachi"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Karachi</h5>
            <p className="text-sm">
              University of Islamic Sciences, Karachi. A generally applicable
              method that uses standard Fajr and Isha angles of 18°.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "UmmAlQura",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "UmmAlQura"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">UmmAlQura</h5>
            <p className="text-sm">
              Umm al-Qura University, Makkah. Uses a fixed interval of 90
              minutes from maghrib to calculate Isha. And a slightly earlier
              Fajr time with an angle of 18.5°. Note: you should add a +30
              minute custom adjustment for Isha during Ramadan.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Dubai",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Dubai"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Dubai</h5>
            <p className="text-sm">
              Used in the UAE. Slightly earlier Fajr time and slightly later
              Isha time with angles of 18.2° for Fajr and Isha in addition to 3
              minute offsets for sunrise, Dhuhr, Asr, and Maghrib.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Qatar",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Qatar"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Qatar</h5>
            <p className="text-sm">
              Same Isha interval as ummAlQura but with the standard Fajr time
              using an angle of 18°.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Kuwait",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Kuwait"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Kuwait</h5>
            <p className="text-sm">
              Standard Fajr time with an angle of 18°. Slightly earlier Isha
              time with an angle of 17.5°.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "MoonsightingCommittee",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod ===
              "MoonsightingCommittee"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Moonsighting Committee</h5>
            <p className="text-sm">
              Method developed by Khalid Shaukat, founder of Moonsighting
              Committee Worldwide. Uses standard 18° angles for Fajr and Isha in
              addition to seasonal adjustment values. This method automatically
              applies the 1/7 approximation rule for locations above 55°
              latitude. Recommended for North America and the UK.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Singapore",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Singapore"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Singapore</h5>
            <p className="text-sm">
              Used in Singapore, Malaysia, and Indonesia. Early Fajr time with
              an angle of 20° and standard Isha time with an angle of 18°.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Turkey",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Turkey"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Turkey</h5>
            <p className="text-sm">
              An approximation of the Diyanet method used in Turkey. This
              approximation is less accurate outside the region of Turkey.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "Tehran",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Tehran"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">Tehran</h5>
            <p className="text-sm">
              Institute of Geophysics, University of Tehran. Early Isha time
              with an angle of 14°. Slightly later Fajr time with an angle of
              17.7°. Calculates Maghrib based on the sun reaching an angle of
              4.5° below the horizon.
            </p>
          </div>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "NorthAmerica",
                setUserPreferences
              );
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "NorthAmerica"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h5 className="mt-0">North America</h5>
            <p className="text-sm">
              Also known as the ISNA method. Can be used for North America, but
              the moonsightingCommittee method is preferable. Gives later Fajr
              times and early Isha times with angles of 15°.
            </p>
          </div>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetCalculationMethods;
