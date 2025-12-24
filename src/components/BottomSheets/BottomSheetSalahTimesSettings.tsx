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
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../utils/constants";

import { MdOutlineChevronRight } from "react-icons/md";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../types/types";
import BottomSheetCalculationMethods from "./BottomSheetCalculationMethods";
import BottomSheetSalahTimeCustomAdjustments from "./BottomSheetSalahTimeCustomAdjustments";
import { useState } from "react";
import BottomSheetLatitudeRules from "./BottomSheetLatitudeRules";

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
}

const BottomSheetSalahTimesSettings = ({
  setShowSalahTimesSettingsSheet,
  showSalahTimesSettingsSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
}: BottomSheetSalahTimesSettingsProps) => {
  const [customAdjustmentSalah, setCustomAdjustmentSalah] = useState<
    | "fajrIncrement"
    | "dhuhrIncrement"
    | "asrIncrement"
    | "maghribIncrement"
    | "ishaIncrement"
  >("fajrIncrement");

  const [showCustomAdjustmentsSheet, setShowCustomAdjustmentsSheet] =
    useState<boolean>(false);

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
                    "shafiMalikiHanbali",
                    setUserPreferences
                  );
                }}
                className={`${
                  userPreferences.madhab === "shafiMalikiHanbali"
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
                <p>Select Latitude Rule</p>
                {/* <p>
                  <MdOutlineChevronRight />
                </p> */}
              </IonButton>
            </div>
            <h6>Custom Angles</h6>
            <section>
              <h6 className="mb-4">Custom Adjustments Per Salah</h6>
              <div
                onClick={() => {
                  setCustomAdjustmentSalah("fajrIncrement");
                  setShowCustomAdjustmentsSheet(true);
                }}
                className="flex items-center justify-between p-2 mb-4 border rounded-lg"
              >
                <p>Fajr Adjustment</p>
                <p>
                  {" "}
                  {userPreferences.fajrIncrement}{" "}
                  {userPreferences.fajrIncrement === "1" ? "minute" : "minutes"}
                </p>
              </div>
              <div
                onClick={() => {
                  setCustomAdjustmentSalah("dhuhrIncrement");
                  setShowCustomAdjustmentsSheet(true);
                }}
                className="flex items-center justify-between p-2 mb-4 border rounded-lg"
              >
                <p>Dhuhr Adjustment</p>
                <p>
                  {" "}
                  {userPreferences.dhuhrIncrement}{" "}
                  {userPreferences.dhuhrIncrement === "1"
                    ? "minute"
                    : "minutes"}
                </p>
              </div>
              <div
                onClick={() => {
                  setCustomAdjustmentSalah("asrIncrement");
                  setShowCustomAdjustmentsSheet(true);
                }}
                className="flex items-center justify-between p-2 mb-4 border rounded-lg"
              >
                <p>Asr Adjustment</p>
                {userPreferences.asrIncrement}{" "}
                {userPreferences.asrIncrement === "1" ? "minute" : "minutes"}
              </div>
              <div
                onClick={() => {
                  setCustomAdjustmentSalah("maghribIncrement");
                  setShowCustomAdjustmentsSheet(true);
                }}
                className="flex items-center justify-between p-2 mb-4 border rounded-lg"
              >
                <p>Maghrib Adjustment</p>
                {userPreferences.maghribIncrement}{" "}
                {userPreferences.maghribIncrement === "1"
                  ? "minute"
                  : "minutes"}
              </div>
              <div
                onClick={() => {
                  setCustomAdjustmentSalah("ishaIncrement");
                  setShowCustomAdjustmentsSheet(true);
                }}
                className="flex items-center justify-between p-2 mb-4 border rounded-lg"
              >
                <p>Isha Adjustment</p>
                <p>
                  {userPreferences.ishaIncrement}{" "}
                  {userPreferences.ishaIncrement === "1" ? "minute" : "minutes"}
                </p>
              </div>
            </section>
          </section>
        </IonContent>
        <BottomSheetCalculationMethods
          triggerId="open-salah-calculations-sheet"
          dbConnection={dbConnection}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
        />
        <BottomSheetLatitudeRules
          triggerId="open-salah-latitude-rules-sheet"
          dbConnection={dbConnection}
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
