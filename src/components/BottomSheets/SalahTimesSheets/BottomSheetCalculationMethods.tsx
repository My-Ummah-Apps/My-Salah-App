import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";

import { CalculationMethod, Coordinates } from "adhan";
import {
  CalculationMethodsType,
  userPreferencesType,
} from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../../utils/constants";
import { fetchAllLocations } from "../../../utils/dbUtils";

// import { CalculationMethod } from "adhan";

interface BottomSheetCalculationMethodsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setSelectedCalculationMethod: React.Dispatch<
    React.SetStateAction<CalculationMethodsType | null>
  >;
  selectedCalculationMethod: CalculationMethodsType | null;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  // calculateActiveLocationSalahTimes: () => Promise<void>;
}

const BottomSheetCalculationMethods = ({
  triggerId,
  dbConnection,
  setSelectedCalculationMethod,
  selectedCalculationMethod,
  setUserPreferences,
  userPreferences,
}: // calculateActiveLocationSalahTimes,
BottomSheetCalculationMethodsProps) => {
  const setDefaults = async (calcMethod: CalculationMethodsType) => {
    if (!userPreferences.prayerCalculationMethod) return;

    const { activeLocation } = await fetchAllLocations(dbConnection);
    // const activeLocation = locations?.filter((loc) => loc.isSelected === 1)[0];

    // const params = CalculationMethod[userPreferences.prayerCalculationMethod]();
    const params = CalculationMethod[calcMethod]();

    const latitudeRule =
      typeof params.highLatitudeRule === "string"
        ? params.highLatitudeRule
        : params.highLatitudeRule(activeLocation.latitude);

    await updateUserPrefs(
      dbConnection,
      "madhab",
      params.madhab,
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "highLatitudeRule",
      latitudeRule,
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "fajrAngle",
      String(params.fajrAngle),
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "ishaAngle",
      String(params.ishaAngle),
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "fajrAdjustment",
      String(params.methodAdjustments.fajr),
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "dhuhrAdjustment",
      String(params.methodAdjustments.dhuhr),
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "asrAdjustment",
      String(params.methodAdjustments.asr),
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "maghribAdjustment",
      String(params.methodAdjustments.maghrib),
      setUserPreferences
    );
    await updateUserPrefs(
      dbConnection,
      "ishaAdjustment",
      String(params.methodAdjustments.isha),
      setUserPreferences
    );
  };

  return (
    <IonModal
      style={{ "--height": "80vh" }}
      // className="modal-fit-content"
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      mode="ios"
      //   isOpen={showAddLocationSheet}
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle className="">Calculation Methods</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="px-4">
          <p className="mb-5">
            Prayer times can vary depending on the calculation method used.
            Select the method that’s commonly followed in your region.
          </p>
          <div
            onClick={async () => {
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                "MuslimWorldLeague",
                setUserPreferences
              );
              await setDefaults("MuslimWorldLeague");
              setSelectedCalculationMethod("MuslimWorldLeague");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "MuslimWorldLeague"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Muslim World League</p>
            <p className="text-xs">
              Standard Fajr time with an angle of 18°. Earlier Isha time with an
              angle of 17°.
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
              await setDefaults("Egyptian");
              setSelectedCalculationMethod("Egyptian");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Egyptian"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <h6 className="mt-0 font-bold text-md">Egypt</h6>
            <p className="text-xs">
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
              await setDefaults("Karachi");
              setSelectedCalculationMethod("Karachi");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Karachi"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Karachi</p>
            <p className="text-xs">
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
              await setDefaults("UmmAlQura");
              setSelectedCalculationMethod("UmmAlQura");
              console.log("UMM AL QURA SELECTED");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "UmmAlQura"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">UmmAlQura</p>
            <p className="text-xs">
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
              await setDefaults("Dubai");
              setSelectedCalculationMethod("Dubai");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Dubai"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Dubai</p>
            <p className="text-xs">
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
              await setDefaults("Qatar");
              setSelectedCalculationMethod("Qatar");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Qatar"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Qatar</p>
            <p className="text-xs">
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
              await setDefaults("Kuwait");
              setSelectedCalculationMethod("Kuwait");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Kuwait"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Kuwait</p>
            <p className="text-xs">
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
              await setDefaults("MoonsightingCommittee");
              setSelectedCalculationMethod("MoonsightingCommittee");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod ===
              "MoonsightingCommittee"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Moonsighting Committee</p>
            <p className="text-xs">
              Uses standard 18° angles for Fajr and Isha in addition to seasonal
              adjustment values. This method automatically applies the 1/7
              approximation rule for locations above 55° latitude. Recommended
              for North America and the UK.
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
              await setDefaults("Singapore");
              setSelectedCalculationMethod("Singapore");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Singapore"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Singapore</p>
            <p className="text-xs">
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
              await setDefaults("Turkey");
              setSelectedCalculationMethod("Turkey");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Turkey"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Turkey</p>
            <p className="text-xs">
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
              await setDefaults("Tehran");
              setSelectedCalculationMethod("Tehran");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "Tehran"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">Tehran</p>
            <p className="text-xs">
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
              await setDefaults("NorthAmerica");
              setSelectedCalculationMethod("NorthAmerica");
            }}
            className={`p-2 mb-5 border rounded-lg ${
              userPreferences.prayerCalculationMethod === "NorthAmerica"
                ? "bg-blue-500"
                : ""
            }`}
          >
            <p className="mt-0 font-bold text-md">North America</p>
            <p className="text-xs">
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
