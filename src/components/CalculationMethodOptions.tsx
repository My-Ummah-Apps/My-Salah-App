import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  calculationMethod,
  CalculationMethodsType,
  countryOptionsType,
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../types/types";
import { prayerCalculationMethodLabels } from "../utils/constants";
import { checkmarkCircle } from "ionicons/icons";
import { getActiveLocation, updateUserPrefs } from "../utils/helpers";
import { CalculationMethod, Coordinates, HighLatitudeRule } from "adhan";
import { toggleDBConnection } from "../utils/dbUtils";

interface CalculationMethodOptionsProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr | undefined;
  setSegmentOption: React.Dispatch<React.SetStateAction<"manual" | "country">>;
  segmentOption: "manual" | "country";
}

const CalculationMethodOptions = ({
  dbConnection,
  setSegmentOption,
  segmentOption,
  userLocations,
  userPreferences,
  setUserPreferences,
}: CalculationMethodOptionsProps) => {
  const countryOptions: countryOptionsType[] = [
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
    "Other",
  ];

  const calculationMethodsDetails: {
    calculationMethod: calculationMethod;
    description: string;
  }[] = [
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
        "University of Islamic Sciences, Karachi. A generally applicable method that uses standard Fajr and Isha angles of 18°.",
    },
    {
      calculationMethod: "Kuwait",
      description:
        "Standard Fajr time with an angle of 18°. Slightly earlier Isha time with an angle of 17.5°.",
    },
    {
      calculationMethod: "MoonsightingCommittee",
      description:
        "Uses standard 18° angles for Fajr and Isha in addition to easonal adjustment values. This method automatically applies the 1/7 approximation rule for locations above 55° latitude. Recommended for North America and the UK.",
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
      calculationMethod: "Qatar",
      description:
        "Same Isha interval as ummAlQura but with the standard Fajr time using an angle of 18°.",
    },
    {
      calculationMethod: "UmmAlQura",
      description:
        "Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. Note: you should add a +30 minute custom adjustment for Isha during Ramadan.",
    },
  ];

  const countryToMethod: Record<countryOptionsType, CalculationMethodsType> = {
    Egypt: "Egyptian",
    Pakistan: "Karachi",
    "Saudi Arabia": "UmmAlQura",
    UAE: "Dubai",
    Qatar: "Qatar",
    Kuwait: "Kuwait",
    Turkey: "Turkey",
    Iran: "Tehran",
    US: "NorthAmerica",
    Canada: "NorthAmerica",
    Singapore: "Singapore",
    Malaysia: "Singapore",
    Indonesia: "Singapore",
    Other: "MoonsightingCommittee",
  };

  const setAdhanLibraryDefaults = async (calcMethod: calculationMethod) => {
    // if (!userPreferences.prayerCalculationMethod) return;

    if (!userLocations) {
      console.error(
        "Unable to set calculation method as no user locations exist",
      );
      return;
    }

    try {
      await toggleDBConnection(dbConnection, "open");

      const activeLocation = getActiveLocation(userLocations);

      const params = CalculationMethod[calcMethod]();

      if (!activeLocation) {
        console.error("Active location does not exist");
        return;
      }

      const coordinates = new Coordinates(
        activeLocation.latitude,
        activeLocation.longitude,
      );

      const defaultCalcMethodValues = {
        prayerCalculationMethod: calcMethod,
        madhab: params.madhab,
        highLatitudeRule: HighLatitudeRule.recommended(coordinates),
        fajrAngle: String(params.fajrAngle),
        ishaAngle: String(params.ishaAngle),
        fajrAdjustment: String(params.methodAdjustments.fajr),
        dhuhrAdjustment: String(params.methodAdjustments.dhuhr),
        asrAdjustment: String(params.methodAdjustments.asr),
        maghribAdjustment: String(params.methodAdjustments.maghrib),
        ishaAdjustment: String(params.methodAdjustments.isha),
      };

      const query = `INSERT OR REPLACE INTO userPreferencesTable (preferenceName, preferenceValue) VALUES (?, ?)`;

      if (!dbConnection || !dbConnection.current) {
        throw new Error("dbConnection / dbconnection.current does not exist");
      }

      for (const [key, value] of Object.entries(defaultCalcMethodValues)) {
        console.log(key, value);
        await dbConnection.current.run(query, [key, value]);
      }

      setUserPreferences((userPreferences: userPreferencesType) => ({
        ...userPreferences,
        ...defaultCalcMethodValues,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      await toggleDBConnection(dbConnection, "close");
    }
  };

  return (
    <>
      <div className="mb-10">
        {" "}
        <IonSegment
          className="w-4/5 mx-auto"
          mode="ios"
          value={segmentOption}
          onIonChange={(e) => {
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
            placeholder="Select Country"
            value={userPreferences.country || undefined}
            label="Select Country"
            onIonChange={async (e) => {
              const selectedCountry: countryOptionsType = e.detail.value;
              await updateUserPrefs(
                dbConnection,
                "prayerCalculationMethod",
                countryToMethod[selectedCountry],
                setUserPreferences,
              );
              await updateUserPrefs(
                dbConnection,
                "country",
                selectedCountry,
                setUserPreferences,
              );
            }}
          >
            {countryOptions.map((country) => (
              <IonSelectOption key={country} value={country}>
                {country}
              </IonSelectOption>
            ))}
          </IonSelect>
          {userPreferences.country !== "" && (
            <div>
              <p>
                <span className="font-bold">Using: </span>
                <span className="text-blue-500">
                  {
                    prayerCalculationMethodLabels[
                      userPreferences.prayerCalculationMethod
                    ]
                  }
                </span>
              </p>
              <p className="text-sm text-gray-400">
                The most common calculation method used in your location
              </p>
            </div>
          )}
        </section>
      )}
      {segmentOption === "manual" && (
        <section className="px-4">
          {calculationMethodsDetails.map((item, i) => {
            return (
              <div
                key={`${item}${i}`}
                onClick={async () => {
                  if (
                    userPreferences.prayerCalculationMethod ===
                    item.calculationMethod
                  ) {
                    return;
                  }
                  await setAdhanLibraryDefaults(item.calculationMethod);
                  await updateUserPrefs(
                    dbConnection,
                    "country",
                    "",
                    setUserPreferences,
                  );
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
    </>
  );
};

export default CalculationMethodOptions;
