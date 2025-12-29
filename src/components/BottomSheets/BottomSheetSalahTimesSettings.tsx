import {
  IonContent,
  IonHeader,
  IonModal,
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
  IonToggle,
  IonIcon,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../utils/constants";

import {
  CalculationMethod,
  PrayerTimes,
  Coordinates,
  HighLatitudeRule,
} from "adhan";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  CalculationMethodsType,
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../types/types";
import BottomSheetCalculationMethods from "./BottomSheetCalculationMethods";
import BottomSheetSalahTimeCustomAdjustments from "./BottomSheetSalahTimeCustomAdjustments";
import { useEffect, useState } from "react";
import BottomSheetLatitudeRules from "./BottomSheetLatitudeRules";
import BottomSheetCustomAngles from "./BottomSheetCustomAngles";

interface BottomSheetSalahTimesSettingsProps {
  setShowSalahTimesSettingsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showSalahTimesSettingsSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
  calculateActiveLocationSalahTimes: () => Promise<void>;
}

const BottomSheetSalahTimesSettings = ({
  setShowSalahTimesSettingsSheet,
  showSalahTimesSettingsSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
  calculateActiveLocationSalahTimes,
}: BottomSheetSalahTimesSettingsProps) => {
  const [selectedCalculationMethod, setSelectedCalculationMethod] =
    useState<CalculationMethodsType | null>(
      userPreferences.prayerCalculationMethod
    );

  const [customAdjustmentSalah, setCustomAdjustmentSalah] = useState<
    | "fajrAdjustment"
    | "dhuhrAdjustment"
    | "asrAdjustment"
    | "maghribAdjustment"
    | "ishaAdjustment"
  >("fajrAdjustment");

  const [customAngleSalah, setCustomAngleSalah] = useState<
    "fajrAngle" | "ishaAngle"
  >("fajrAngle");

  const [showCustomAdjustmentsSheet, setShowCustomAdjustmentsSheet] =
    useState<boolean>(false);
  const [showCustomAnglesSheet, setShowCustomAnglesSheet] =
    useState<boolean>(false);

  // const methodObj = CalculationMethod["Egyptian"]().highLatitudeRule;
  // console.log("methodObj: ", methodObj);

  // var params = CalculationMethod.UmmAlQura();
  // console.log(params);

  // console.log(HighLatitudeRule.recommended());

  return (
    <IonModal
      mode="ios"
      isOpen={showSalahTimesSettingsSheet}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onDidDismiss={() => {
        setShowSalahTimesSettingsSheet(false);
      }}
      onWillDismiss={() => {}}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Salah Times Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <section className="mt-10 text-center">
            <section className="text-center"></section>
            <h5>Calculation Method</h5>
            <IonButton
              id="open-salah-calculations-sheet"
              style={{
                "--background": "transparent",
              }}
              className="flex items-center mx-5 border border-gray-500 rounded-md"
            >
              <p>
                {userPreferences.prayerCalculationMethod === ""
                  ? "Select Calculation method"
                  : userPreferences.prayerCalculationMethod}
              </p>
              <p>{/* <MdOutlineChevronRight /> */}</p>
            </IonButton>
          </section>
          {userPreferences.prayerCalculationMethod !== null && (
            <>
              <section className="mt-10 text-center">
                <h5 className="mb-5">Madhab / Asr Time</h5>
                <div className="flex justify-center gap-2 m-3">
                  <IonButton
                    style={{
                      "--background": "transparent",
                    }}
                    onClick={async () => {
                      await updateUserPrefs(
                        dbConnection,
                        "madhab",
                        "shafi",
                        setUserPreferences
                      );
                    }}
                    className={`${
                      userPreferences.madhab === "shafi"
                        ? "bg-green-800 rounded-md"
                        : "border rounded-md"
                    }`}
                  >
                    <div className="text-sm text-white">
                      <p className="mb-2">
                        <strong>Earlier Asr Time</strong>
                      </p>
                      <p className="text-xs">Shafi'i, Maliki & Hanbali</p>
                    </div>
                  </IonButton>
                  <IonButton
                    style={{
                      "--background": "transparent",
                    }}
                    onClick={async () => {
                      await updateUserPrefs(
                        dbConnection,
                        "madhab",
                        "hanafi",
                        setUserPreferences
                      );
                    }}
                    className={` ${
                      userPreferences.madhab === "hanafi"
                        ? "bg-green-800 rounded-md"
                        : "border rounded-md"
                    }`}
                  >
                    <div className="text-sm text-white">
                      <p className="mb-2">
                        <strong>Later Asr Time </strong>
                      </p>
                      <p className="text-xs">Hanafi</p>
                    </div>
                  </IonButton>
                </div>
              </section>
              <section className="flex items-center justify-between mx-2">
                <h6>24-Hour Time</h6>
                <IonToggle
                  style={{ "--track-background": "#555" }}
                  checked={userPreferences.timeFormat === "24hr" ? true : false}
                  onIonChange={async (e) => {
                    const selectedTimeFormat =
                      e.detail.checked === true ? "24hr" : "12hr";

                    await updateUserPrefs(
                      dbConnection,
                      "timeFormat",
                      selectedTimeFormat,
                      setUserPreferences
                    );
                  }}
                ></IonToggle>
              </section>
              <section className="mx-2">
                <h5>Advanced Settings</h5>
                <div>
                  <h6>High Latitude Rule</h6>
                  <IonButton
                    id="open-salah-latitude-rules-sheet"
                    style={{
                      "--background": "transparent",
                    }}
                    className="flex items-center mx-5 border border-gray-500 rounded-md"
                  >
                    <p>
                      {CalculationMethod[
                        selectedCalculationMethod || "MuslimWorldLeague"
                      ]().highLatitudeRule.toString()}
                    </p>
                    {/* <p>
                  <MdOutlineChevronRight />
                </p> */}
                  </IonButton>
                </div>
                <div>
                  <h6>Custom Angles</h6>
                  <div className="">
                    <div
                      onClick={() => {
                        setCustomAngleSalah("fajrAngle");
                        setShowCustomAnglesSheet(true);
                      }}
                      className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                    >
                      <p>Fajr Angle</p>
                      <p>{userPreferences.fajrAngle}</p>
                    </div>
                  </div>
                  <div className="">
                    <div
                      onClick={() => {
                        setCustomAngleSalah("ishaAngle");
                        setShowCustomAnglesSheet(true);
                      }}
                      className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                    >
                      <p>Isha Angle</p>
                      <p>{userPreferences.ishaAngle}</p>
                    </div>
                  </div>
                </div>
                <section>
                  <h6 className="mb-4">Custom Adjustments Per Salah</h6>
                  {/* <div className="flex flex-wrap"> */}
                  <div
                    onClick={() => {
                      setCustomAdjustmentSalah("fajrAdjustment");
                      setShowCustomAdjustmentsSheet(true);
                    }}
                    className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                  >
                    <p>Fajr Adjustment</p>
                    <p>
                      {" "}
                      {userPreferences.fajrAdjustment}{" "}
                      {userPreferences.fajrAdjustment === "1"
                        ? "minute"
                        : "minutes"}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      setCustomAdjustmentSalah("dhuhrAdjustment");
                      setShowCustomAdjustmentsSheet(true);
                    }}
                    className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                  >
                    <p>Dhuhr Adjustment</p>
                    <p>
                      {" "}
                      {userPreferences.dhuhrAdjustment}{" "}
                      {userPreferences.dhuhrAdjustment === "1"
                        ? "minute"
                        : "minutes"}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      setCustomAdjustmentSalah("asrAdjustment");
                      setShowCustomAdjustmentsSheet(true);
                    }}
                    className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                  >
                    <p>Asr Adjustment</p>
                    {userPreferences.asrAdjustment}{" "}
                    {userPreferences.asrAdjustment === "1"
                      ? "minute"
                      : "minutes"}
                  </div>
                  <div
                    onClick={() => {
                      setCustomAdjustmentSalah("maghribAdjustment");
                      setShowCustomAdjustmentsSheet(true);
                    }}
                    className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                  >
                    <p>Maghrib Adjustment</p>
                    {userPreferences.maghribAdjustment}{" "}
                    {userPreferences.maghribAdjustment === "1"
                      ? "minute"
                      : "minutes"}
                  </div>
                  <div
                    onClick={() => {
                      setCustomAdjustmentSalah("ishaAdjustment");
                      setShowCustomAdjustmentsSheet(true);
                    }}
                    className="flex items-center justify-between p-2 mb-4 border rounded-lg"
                  >
                    <p>Isha Adjustment</p>
                    <p>
                      {userPreferences.ishaAdjustment}{" "}
                      {userPreferences.ishaAdjustment === "1"
                        ? "minute"
                        : "minutes"}
                    </p>
                  </div>
                  {/* </div> */}
                </section>
              </section>
            </>
          )}
        </IonContent>
        <BottomSheetCalculationMethods
          triggerId="open-salah-calculations-sheet"
          dbConnection={dbConnection}
          setSelectedCalculationMethod={setSelectedCalculationMethod}
          selectedCalculationMethod={selectedCalculationMethod}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
          calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
        />
        <BottomSheetLatitudeRules
          triggerId="open-salah-latitude-rules-sheet"
          dbConnection={dbConnection}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
        />
        <BottomSheetCustomAngles
          dbConnection={dbConnection}
          setShowCustomAnglesSheet={setShowCustomAnglesSheet}
          showCustomAnglesSheet={showCustomAnglesSheet}
          customAngleSalah={customAngleSalah}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
        />
        <BottomSheetSalahTimeCustomAdjustments
          setShowCustomAdjustmentsSheet={setShowCustomAdjustmentsSheet}
          showCustomAdjustmentsSheet={showCustomAdjustmentsSheet}
          customAdjustmentSalah={customAdjustmentSalah}
          dbConnection={dbConnection}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
        />
      </IonPage>
    </IonModal>
  );
};

export default BottomSheetSalahTimesSettings;
