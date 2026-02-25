import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  IonContent,
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
import { setAdhanLibraryDefaults, updateUserPrefs } from "../utils/helpers";

interface CalculationMethodOptionsProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr;
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
    "Canada",
    "Egypt",
    "Indonesia",
    "Iran",
    "Kuwait",
    "Malaysia",
    "Pakistan",
    "Qatar",
    "Saudi Arabia",
    "Singapore",
    "Turkey",
    "UAE",
    "UK",
    "US",
    "Not listed",
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
        "Uses standard 18° angles for Fajr and Isha in addition to easonal adjustment values. This method automatically applies the 1/7 approximation rule for locations above 55° latitude.",
    },
    {
      calculationMethod: "MuslimWorldLeague",
      description:
        "Standard Fajr time with an angle of 18°. Earlier Isha time with an angle of 17°.",
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
      calculationMethod: "UmmAlQura",
      description:
        "Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. Note: you should add a +30 minute custom adjustment for Isha during Ramadan.",
    },
  ];

  const countryToMethod: Record<countryOptionsType, CalculationMethodsType> = {
    Canada: "NorthAmerica",
    Egypt: "Egyptian",
    Indonesia: "Singapore",
    Iran: "Tehran",
    Kuwait: "Kuwait",
    Malaysia: "Singapore",
    Pakistan: "Karachi",
    Qatar: "Qatar",
    "Saudi Arabia": "UmmAlQura",
    Singapore: "Singapore",
    Turkey: "Turkey",
    UAE: "Dubai",
    UK: "MoonsightingCommittee",
    US: "NorthAmerica",
    "Not listed": "MuslimWorldLeague",
  };

  return (
    <IonContent
      style={{
        "--background": "var(--card-bg-color)",
      }}
    >
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
            style={{ "--ion-text-color": "white" }}
            placeholder="Select Country"
            value={userPreferences.country || undefined}
            label="Select Country"
            onIonChange={async (e) => {
              const selectedCountry: countryOptionsType = e.detail.value;

              const method = countryToMethod[selectedCountry];

              if (!method) {
                console.error("No option selected");
                return;
              }

              await setAdhanLibraryDefaults(
                dbConnection,
                method,
                setUserPreferences,
                userPreferences,
                userLocations,
              );
              // await updateUserPrefs(
              //   dbConnection,
              //   "prayerCalculationMethod",
              //   countryToMethod[selectedCountry],
              //   setUserPreferences,
              // );
              await updateUserPrefs(
                dbConnection,
                "country",
                selectedCountry,
                setUserPreferences,
              );
            }}
          >
            {countryOptions.map((country) => (
              <IonSelectOption
                // style={{ color: "red" }}
                key={country}
                value={country}
              >
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
              <p className="mt-2 text-sm text-gray-400">
                This is the calculation method in use for your selection
              </p>
            </div>
          )}
        </section>
      )}
      {segmentOption === "manual" && (
        <section className="px-4 mb-[15rem]">
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
                  await setAdhanLibraryDefaults(
                    dbConnection,
                    item.calculationMethod,
                    setUserPreferences,
                    userPreferences,
                    userLocations,
                  );
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
    </IonContent>
  );
};

export default CalculationMethodOptions;
