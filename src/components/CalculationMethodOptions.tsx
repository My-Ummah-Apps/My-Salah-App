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
  countryOptionsType,
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../types/types";
import {
  calculationMethodsDetails,
  countryOptions,
  countryToMethod,
  prayerCalculationMethodLabels,
} from "../utils/constants";
import { checkmarkCircle } from "ionicons/icons";
import { setAdhanLibraryDefaults, updateUserPrefs } from "../utils/helpers";

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
                  await setAdhanLibraryDefaults(
                    item.calculationMethod,
                    userLocations,
                    dbConnection,
                    setUserPreferences,
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
    </>
  );
};

export default CalculationMethodOptions;
