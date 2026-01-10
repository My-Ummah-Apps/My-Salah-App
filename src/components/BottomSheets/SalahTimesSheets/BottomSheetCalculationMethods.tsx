import {
  IonContent,
  IonHeader,
  IonIcon,
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
import { checkmarkCircle } from "ionicons/icons";

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

  const calculationMethods = [
    {
      calculationMethod: "Dubai",
      description:
        "Used in the UAE. Slightly earlier Fajr time and slightly later sha time with angles of 18.2° for Fajr and Isha in addition to 3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib.",
    },
    {
      calculationMethod: "Egyptian",
      description:
        "Early Fajr time using an angle 19.5° and a slightly earlier Isha time using an angle of 17.5°.",
    },
    {
      calculationMethod: "MuslimWorldLeague",
      description:
        "Standard Fajr time with an angle of 18°. Earlier Isha time with an angle of 17°.",
    },
    {
      calculationMethod: "Karachi",
      description:
        " University of Islamic Sciences, Karachi. A generally applicable method that uses standard Fajr and Isha angles of 18°.",
    },
    {
      calculationMethod: "Kuwait",
      description:
        "Standard Fajr time with an angle of 18°. Slightly earlier Isha time with an angle of 17.5°.",
    },
    {
      calculationMethod: "MoonsightingCommittee",
      description:
        " Uses standard 18° angles for Fajr and Isha in addition to easonal adjustment values. This method automatically applies the 1/7 approximation rule for locations above 55° latitude. Recommended for North America and the UK.",
    },
    {
      calculationMethod: "Singapore",
      description:
        "Early Fajr time with an angle of 20° and standard Isha time with an angle of 18°.",
    },
    {
      calculationMethod: "Tehran",
      description:
        "Institute of Geophysics, University of Tehran. Early Isha time with an angle of 14°. Slightly later Fajr time with an angle of 17.7°. Calculates Maghrib based on the sun reaching an angle of 4.5° below the horizon.",
    },
    {
      calculationMethod: "Turkey",
      description:
        "An approximation of the Diyanet method used in Turkey. This approximation is less accurate outside the region of Turkey.",
    },
    {
      calculationMethod: "NorthAmerica",
      description:
        "Islamic Society of North America. Can be used for North America, but the Moonsighting Committee method is preferable. Gives later Fajr times and early Isha times with angles of 15°.",
    },
    {
      calculationMethod: "UmmAlQura",
      description:
        "Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. Note: you should add a +30 minute custom adjustment for Isha during Ramadan.",
    },
  ];

  const setAdhanLibraryDefaults = async (calcMethod) => {
    // if (!userPreferences.prayerCalculationMethod) return;

    try {
      await toggleDBConnection(dbConnection, "open");

      const allLocations = await fetchAllLocations(dbConnection);

      const params = CalculationMethod[calcMethod]();

      const latitudeRule =
        typeof params.highLatitudeRule === "string"
          ? params.highLatitudeRule
          : params.highLatitudeRule(allLocations.activeLocation.latitude);

      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;

      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection / dbconnection.current does not exist");
      }

      await dbConnection.current.run(query, [
        "prayerCalculationMethod",
        calcMethod,
      ]);
      await dbConnection.current.run(query, ["madhab", params.madhab]);
      await dbConnection.current.run(query, ["highLatitudeRule", latitudeRule]);
      await dbConnection.current.run(query, [
        "fajrAngle",
        String(params.fajrAngle),
      ]);
      await dbConnection.current.run(query, [
        "ishaAngle",
        String(params.ishaAngle),
      ]);
      await dbConnection.current.run(query, [
        "fajrAdjustment",
        String(params.methodAdjustments.fajr),
      ]);
      await dbConnection.current.run(query, [
        "dhuhrAdjustment",
        String(params.methodAdjustments.dhuhr),
      ]);
      await dbConnection.current.run(query, [
        "asrAdjustment",
        String(params.methodAdjustments.asr),
      ]);
      await dbConnection.current.run(query, [
        "maghribAdjustment",
        String(params.methodAdjustments.maghrib),
      ]);
      await dbConnection.current.run(query, [
        "ishaAdjustment",
        String(params.methodAdjustments.isha),
      ]);

      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        prayerCalculationMethod: calcMethod,
        madhab: params.madhab,
        highLatitudeRule: latitudeRule,
        fajrAngle: params.fajrAngle,
        ishaAngle: params.ishaAngle,
        fajrAdjustment: params.methodAdjustments.fajr,
        dhuhrAdjustment: params.methodAdjustments.dhuhr,
        asrAdjustment: params.methodAdjustments.asr,
        maghribAdjustment: params.methodAdjustments.maghrib,
        ishaAdjustment: params.methodAdjustments.isha,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      await toggleDBConnection(dbConnection, "close");
    }
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
            {calculationMethods.map((item, i) => {
              return (
                <div
                  key={`${item}${i}`}
                  onClick={async () => {
                    await setAdhanLibraryDefaults(item.calculationMethod);
                    setSelectedCalculationMethod(item.calculationMethod);
                  }}
                  className={`options-wrap  ${
                    userPreferences.prayerCalculationMethod ===
                    item.calculationMethod
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="mr-2">
                    <IonIcon
                      color="primary"
                      className={` ${
                        userPreferences.prayerCalculationMethod ===
                        item.calculationMethod
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      icon={checkmarkCircle}
                    />
                  </div>
                  <div>
                    <p className="mt-0 font-bold text-md">
                      {prayerCalculationMethodLabels[item.calculationMethod]}
                    </p>
                    <p className="text-xs">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetCalculationMethods;
