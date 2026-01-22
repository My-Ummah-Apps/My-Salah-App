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

import { CalculationMethod, Coordinates, HighLatitudeRule } from "adhan";
import {
  calculationMethod,
  countryOptionsType,
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../../types/types";
import {
  calculationMethodsDetails,
  countryOptions,
  countryToMethod,
  getActiveLocation,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  prayerCalculationMethodLabels,
  updateUserPrefs,
} from "../../../utils/constants";
import { toggleDBConnection } from "../../../utils/dbUtils";
import { useState } from "react";
import { checkmarkCircle } from "ionicons/icons";

// import { CalculationMethod } from "adhan";

interface BottomSheetCalculationMethodsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  // setSelectedCalculationMethod: React.Dispatch<
  //   React.SetStateAction<CalculationMethodsType | null>
  // >;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr | undefined;
  // calculateActiveLocationSalahTimes: () => Promise<void>;
}

const BottomSheetCalculationMethods = ({
  triggerId,
  dbConnection,
  // setSelectedCalculationMethod,
  setUserPreferences,
  userPreferences,
  userLocations,
}: // calculateActiveLocationSalahTimes,
BottomSheetCalculationMethodsProps) => {
  const [segmentOption, setSegmentOption] = useState<"manual" | "country">(
    "country",
  );

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
              placeholder="Select Country"
              value={userPreferences.country || undefined}
              label="Select Country"
              onIonChange={async (e) => {
                console.log(e.detail.value);
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
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetCalculationMethods;
