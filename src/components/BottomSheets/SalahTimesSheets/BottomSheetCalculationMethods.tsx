import {
  IonContent,
  IonHeader,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
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
  prayerCalculationMethodLabels,
  updateUserPrefs,
} from "../../../utils/constants";
import { fetchAllLocations, toggleDBConnection } from "../../../utils/dbUtils";
import { useState } from "react";

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
  const [segmentOption, setSegmentOption] = useState<"manual" | "country">(
    "country"
  );

  const setDefaults = async (calcMethod: CalculationMethodsType) => {
    if (!userPreferences.prayerCalculationMethod) return;

    let allLocations;

    try {
      await toggleDBConnection(dbConnection, "open");

      allLocations = await fetchAllLocations(dbConnection);
    } catch (error) {
      console.error(error);
    } finally {
      await toggleDBConnection(dbConnection, "close");
    }

    const params = CalculationMethod[calcMethod]();

    const latitudeRule =
      typeof params.highLatitudeRule === "string"
        ? params.highLatitudeRule
        : params.highLatitudeRule(allLocations?.activeLocation.latitude);

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

  const countryOptions = [
    "Egypt",
    "Pakistan",
    "Saudi Arabia",
    "UAE",
    "Qatar",
    "Kuwait",
    "Turkey",
    "Iran",
    "US",
    "Canada",
    "Singapore",
    "Malaysia",
    "Indonesia",
    "Sudan",
    "Somalia",
    "Bangladesh",
    "India",
    "Nigeria",
    "Other",
  ];

  const countryToMethod: Record<string, string> = {
    Egypt: "Egyptian General Authority of Survey",
    Pakistan: "University of Islamic Sciences, Karachi",
    SaudiArabia: "Umm Al-Qura University, Makkah",
    UAE: "Dubai - UAE",
    Qatar: "Qatar Ministry of Awqaf",
    Kuwait: "Kuwait",
    Turkey: "Diyanet, Turkey",
    Iran: "University of Tehran",
    US: "North America (ISNA)",
    Canada: "North America (ISNA)",
    Singapore: "Singapore / Malaysia / Indonesia",
    Malaysia: "Singapore / Malaysia / Indonesia",
    Indonesia: "Singapore / Malaysia / Indonesia",
    Sudan: "Moonsighting Committee",
    Somalia: "Moonsighting Committee",
    Bangladesh: "Moonsighting Committee",
    India: "Moonsighting Committee",
    Nigeria: "Moonsighting Committee",
  };

  return (
    <IonModal
      style={{ "--height": "80vh" }}
      // className="modal-fit-content"
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      mode="ios"
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
        <div className="mb-10">
          {" "}
          <IonSegment
            className="w-4/5 mx-auto"
            mode="ios"
            value={segmentOption}
            onIonChange={(e) => {
              console.log("e.detail: ", e.detail.value);

              setSegmentOption(e.detail.value as "country" | "manual");
            }}
          >
            <IonSegmentButton value="country">
              <IonLabel>Based on Country</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="manual">
              <IonLabel>Manual</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        {segmentOption === "country" && (
          <section className="mx-4">
            <IonSelect
              label="Select Country"
              placeholder="Select Country"
              onIonChange={async (e) => {
                console.log(e.detail.value);
                const selectedCountry = e.detail.value;
                await updateUserPrefs(
                  dbConnection,
                  "prayerCalculationMethod",
                  countryToMethod[selectedCountry],
                  setUserPreferences
                );
              }}
            >
              {countryOptions.map((country) => (
                <IonSelectOption key={country} value={country}>
                  {country}
                </IonSelectOption>
              ))}
            </IonSelect>
            <p>
              <span className="font-bold">Using: </span>
              <span className="text-blue-500 underline">
                {
                  prayerCalculationMethodLabels[
                    userPreferences.prayerCalculationMethod
                  ]
                }
              </span>
            </p>
            <p className="text-sm text-gray-400">
              The most common calculation method used in your country
            </p>
          </section>
        )}
        {segmentOption === "manual" && (
          <section className="px-4">
            {/* <p className="mb-5">
            Prayer times can vary depending on the calculation method used.
            Select the method that’s commonly followed in your region.
          </p> */}

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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["MuslimWorldLeague"]}
              </p>
              <p className="text-xs">
                Standard Fajr time with an angle of 18°. Earlier Isha time with
                an angle of 17°.
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Egyptian"]}
              </p>
              <p className="text-xs">
                Early Fajr time using an angle 19.5° and a slightly earlier Isha
                time using an angle of 17.5°.
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
              <p className="mt-0 font-bold text-md">
                {" "}
                {prayerCalculationMethodLabels["Karachi"]}
              </p>
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["UmmAlQura"]}
              </p>
              <p className="text-xs">
                Uses a fixed interval of 90 minutes from maghrib to calculate
                Isha. And a slightly earlier Fajr time with an angle of 18.5°.
                Note: you should add a +30 minute custom adjustment for Isha
                during Ramadan.
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Dubai"]}
              </p>
              <p className="text-xs">
                Used in the UAE. Slightly earlier Fajr time and slightly later
                Isha time with angles of 18.2° for Fajr and Isha in addition to
                3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib.
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Qatar"]}
              </p>
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Kuwait"]}
              </p>
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["MoonsightingCommittee"]}
              </p>
              <p className="text-xs">
                Uses standard 18° angles for Fajr and Isha in addition to
                seasonal adjustment values. This method automatically applies
                the 1/7 approximation rule for locations above 55° latitude.
                Recommended for North America and the UK.
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Singapore"]}
              </p>
              <p className="text-xs">
                Early Fajr time with an angle of 20° and standard Isha time with
                an angle of 18°.
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Turkey"]}
              </p>
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["Tehran"]}
              </p>
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
              <p className="mt-0 font-bold text-md">
                {prayerCalculationMethodLabels["NorthAmerica"]}
              </p>
              <p className="text-xs">
                Islamic Society of North America. Can be used for North America,
                but the Moonsighting Committee method is preferable. Gives later
                Fajr times and early Isha times with angles of 15°.
              </p>
            </div>
          </section>
        )}
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetCalculationMethods;
