import {
  IonContent,
  IonHeader,
  IonModal,
  IonButton,
  IonTitle,
  IonToolbar,
  IonToggle,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../../utils/constants";

import { CalculationMethod } from "adhan";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  CalculationMethodsType,
  userPreferencesType,
} from "../../../types/types";

import { useState } from "react";
import BottomSheetCalculationMethods from "./BottomSheetCalculationMethods";
import BottomSheetLatitudeRules from "./BottomSheetLatitudeRules";
import BottomSheetCustomAngles from "./BottomSheetCustomAngles";
import BottomSheetSalahTimeCustomAdjustments from "./BottomSheetSalahTimeCustomAdjustments";
import BottomSheetShafaqRules from "./BottomSheetShafaqRule";
import SettingIndividual from "../../Settings/SettingIndividual";
import { MdOutlineChevronRight } from "react-icons/md";

interface BottomSheetSalahTimesSettingsProps {
  setShowSalahTimesSettingsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showSalahTimesSettingsSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  // calculateActiveLocationSalahTimes: () => Promise<void>;
}

const BottomSheetSalahTimesSettings = ({
  setShowSalahTimesSettingsSheet,
  showSalahTimesSettingsSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: // calculateActiveLocationSalahTimes,
BottomSheetSalahTimesSettingsProps) => {
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
  const [showShafaqRulesSheet, setShowShafaqRulesSheet] = useState(false);

  // const methodObj = CalculationMethod["Egyptian"]().highLatitudeRule;
  // console.log("methodObj: ", methodObj);

  // var params = CalculationMethod.UmmAlQura();
  // console.log(params);

  // console.log(HighLatitudeRule.recommended());

  return (
    <IonModal
      mode="ios"
      isOpen={showSalahTimesSettingsSheet}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
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
      {/* <IonHeader> */}
      {/* <IonToolbar>
          <IonTitle>Salah Times Settings</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
        <section className="px-2 mx-2 mt-10 border rounded-lg bg-[color:var(--card-bg-color)]">
          <IonButton
            // size="small"
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            id="open-salah-calculations-sheet"
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Calculation Method:</p>
              <div className="flex items-center gap-1">
                <p>
                  {userPreferences.prayerCalculationMethod === ""
                    ? "Select Calculation method"
                    : userPreferences.prayerCalculationMethod}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            id="open-salah-calculations-sheet"
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Madhab / Asr Time:</p>
              <div className="flex items-center gap-1">
                <p>{userPreferences.madhab}</p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <div className="flex items-center justify-between ">
            <h6 className="text-[var(--ion-text-color)] ">24-Hour Time</h6>
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
          </div>
        </section>
        {/* <section className="mt-10 text-center">
            <h5 className="mb-5 text-[var(--ion-text-color)] ">
              Madhab / Asr Time
            </h5>
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
                <div className="text-sm text-[var(--ion-text-color)] ">
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
                <div className="text-sm text-[var(--ion-text-color)] ">
                  <p className="mb-2">
                    <strong>Later Asr Time </strong>
                  </p>
                  <p className="text-xs">Hanafi</p>
                </div>
              </IonButton>
            </div>
          </section> */}
        <p className="text-[var(--ion-text-color)] mx-4 mt-5 mb-1">
          Advanced Settings
        </p>
        <section className="px-2 mx-2 border rounded-lg bg-[color:var(--card-bg-color)]">
          <IonButton
            // size="small"
            id="open-salah-latitude-rules-sheet"
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">High Latitude Rule:</p>
              <div className="flex items-center gap-1">
                <p>{userPreferences.highLatitudeRule}</p>
                {/* <p>
                  {CalculationMethod[
                    selectedCalculationMethod || "MuslimWorldLeague"
                  ]().highLatitudeRule.toString()}
                </p> */}
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAngleSalah("fajrAngle");
              setShowCustomAnglesSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Fajr Angle:</p>
              <div className="flex items-center gap-1">
                <p>{userPreferences.fajrAngle}</p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAngleSalah("ishaAngle");
              setShowCustomAnglesSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Isha Angle:</p>
              <div className="flex items-center gap-1">
                <p>{userPreferences.ishaAngle}</p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
        </section>
        <section className="px-2 mx-2 border rounded-lg bg-[color:var(--card-bg-color)] mt-4">
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAdjustmentSalah("fajrAdjustment");
              setShowCustomAdjustmentsSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Fajr Adjustment:</p>
              <div className="flex items-center gap-1">
                <p>
                  {" "}
                  {userPreferences.fajrAdjustment}{" "}
                  {userPreferences.fajrAdjustment === "1"
                    ? "minute"
                    : "minutes"}
                </p>
                {/* <p>
                  {CalculationMethod[
                    selectedCalculationMethod || "MuslimWorldLeague"
                  ]().highLatitudeRule.toString()}
                </p> */}
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAdjustmentSalah("dhuhrAdjustment");
              setShowCustomAdjustmentsSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Dhuhr Adjustment:</p>
              <div className="flex items-center gap-1">
                <p>
                  {" "}
                  {userPreferences.dhuhrAdjustment}{" "}
                  {userPreferences.dhuhrAdjustment === "1"
                    ? "minute"
                    : "minutes"}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAdjustmentSalah("asrAdjustment");
              setShowCustomAdjustmentsSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Asr Adjustment:</p>
              <div className="flex items-center gap-1">
                <p>
                  {" "}
                  {userPreferences.asrAdjustment}{" "}
                  {userPreferences.asrAdjustment === "1" ? "minute" : "minutes"}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAdjustmentSalah("maghribAdjustment");
              setShowCustomAdjustmentsSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Maghrib Adjustment:</p>
              <div className="flex items-center gap-1">
                <p>
                  {" "}
                  {userPreferences.maghribAdjustment}{" "}
                  {userPreferences.maghribAdjustment === "1"
                    ? "minute"
                    : "minutes"}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAdjustmentSalah("ishaAdjustment");
              setShowCustomAdjustmentsSheet(true);
            }}
            expand="full"
            style={{
              "--background": "transparent",
              padding: 0,
              "--padding-start": "0",
              "--padding-end": "0",
              "--inner-padding-start": "0",
              "--inner-padding-end": "0",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full ">
              <p className="">Isha Adjustment:</p>
              <div className="flex items-center gap-1">
                <p>
                  {userPreferences.ishaAdjustment}{" "}
                  {userPreferences.ishaAdjustment === "1"
                    ? "minute"
                    : "minutes"}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
        </section>
        {userPreferences.prayerCalculationMethod ===
          "MoonsightingCommittee" && (
          <section className="px-2 mx-2 mt-10 mb-5 border rounded-lg bg-[color:var(--card-bg-color)]">
            <IonButton
              // size="small"
              onClick={() => {
                setShowShafaqRulesSheet(true);
              }}
              expand="full"
              style={{
                "--background": "transparent",
                padding: 0,
                "--padding-start": "0",
                "--padding-end": "0",
                "--inner-padding-start": "0",
                "--inner-padding-end": "0",
              }}
              className="text-[var(--ion-text-color)] text-sm"
            >
              <div className="flex items-center justify-between w-full ">
                <p className="">Shafaq Rule:</p>
                <div className="flex items-center gap-1">
                  <p>{userPreferences.shafaqRule}</p>
                  <p>
                    <MdOutlineChevronRight />
                  </p>
                </div>
              </div>
            </IonButton>
          </section>
        )}
      </IonContent>
      <BottomSheetCalculationMethods
        triggerId="open-salah-calculations-sheet"
        dbConnection={dbConnection}
        setSelectedCalculationMethod={setSelectedCalculationMethod}
        selectedCalculationMethod={selectedCalculationMethod}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
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
      <BottomSheetShafaqRules
        setShowShafaqRulesSheet={setShowShafaqRulesSheet}
        showShafaqRulesSheet={showShafaqRulesSheet}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
      />
      {/* </IonPage> */}
    </IonModal>
  );
};

export default BottomSheetSalahTimesSettings;
