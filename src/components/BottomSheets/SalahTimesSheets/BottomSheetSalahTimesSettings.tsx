import { IonContent, IonModal, IonButton, IonToggle } from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  prayerCalculationMethodLabels,
  updateUserPrefs,
} from "../../../utils/constants";

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
import { MdOutlineChevronRight } from "react-icons/md";
import BottomSheetMadhabOptions from "./BottomSheetMadhabOptions";
import BottomSheetPolarCircleSetting from "./BottomSheetPolarCircleSetting";

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
  // const [selectedCalculationMethod, setSelectedCalculationMethod] =
  //   useState<CalculationMethodsType | null>(
  //     userPreferences.prayerCalculationMethod
  //   );

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

  const latitudeRuleValues = {
    middleofthenight: "Middle of the Night",
    seventhofthenight: "Seventh of the Night",
    twilightangle: "Twilight Angle",
  };

  const polarCircleResolutionValues = {
    Unresolved: "Unresolved (default)",
    AqrabBalad: "Closest City",
    AqrabYaum: "Closest Date",
  };

  const buttonStyles = {
    "--background": "transparent",
    padding: 0,
    "--padding-start": "0",
    "--padding-end": "0",
    "--inner-padding-start": "0",
    "--inner-padding-end": "0",
    "--padding-top": "0",
    "--padding-bottom": "0",
    "--inner-padding-top": "0",
    "--inner-padding-bottom": "0",
    "--margin-bottom": "0",
    minHeight: "0",
  };

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
        <section className="px-2 mt-10">
          <IonButton
            // size="small"
            expand="full"
            style={{
              ...buttonStyles,
              "padding-top": "10px",
            }}
            id="open-salah-calculations-sheet"
            className="text-[var(--ion-text-color)] font-light mb-3"
          >
            <div className="flex items-center justify-between w-full py-3 px-1 bg-[color:var(--card-bg-color)] rounded-lg">
              <p className="">Calculation Method:</p>
              <div className="flex items-center gap-1">
                <p>
                  {userPreferences.prayerCalculationMethod === ""
                    ? "Select Calculation method"
                    : prayerCalculationMethodLabels[
                        userPreferences.prayerCalculationMethod
                      ]}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <IonButton
            // size="small"
            id="open-madhab-options-sheet"
            expand="full"
            style={{
              ...buttonStyles,
            }}
            className="text-[var(--ion-text-color)] font-light mb-3"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
              <p className="">Madhab / Asr Time:</p>
              <div className="flex items-center gap-1">
                <p>
                  {userPreferences.madhab === "shafi"
                    ? "Earlier Asr"
                    : "Later Asr"}
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
          <div className="flex items-center justify-between bg-[color:var(--card-bg-color)] rounded-lg py-1 px-1">
            <p className="text-[var(--ion-text-color)] leading-[1.25rem] font-light pl-[0.1rem]">
              24-Hour Time
            </p>
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

        <p className="text-[var(--ion-text-color)] mx-4 mt-7 mb-1 font-light text-center">
          Advanced Settings
        </p>
        <section className="mx-2 rounded-lg">
          <IonButton
            // size="small"
            id="open-salah-latitude-rules-sheet"
            expand="full"
            style={{
              ...buttonStyles,
              // "padding-top": "10px",
            }}
            className="text-[var(--ion-text-color)] font-light mb-3 mt-2"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
              <p className="">High Latitude Rule:</p>
              <div className="flex items-center gap-1">
                <p>{latitudeRuleValues[userPreferences.highLatitudeRule]}</p>
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
          <p className="text-[var(--ion-text-color)] ml-1 mt-5 font-light text-sm text-left">
            Fajr / Isha Angles
          </p>
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAngleSalah("fajrAngle");
              setShowCustomAnglesSheet(true);
            }}
            expand="full"
            style={{
              ...buttonStyles,
            }}
            className="text-[var(--ion-text-color)] font-light mb-3"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
              ...buttonStyles,
              "padding-bottom": "10px",
            }}
            className="text-[var(--ion-text-color)] font-light mb-4"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
        <p className="text-[var(--ion-text-color)] ml-3 mt-5 font-light text-sm text-left">
          Custom Adjustments
        </p>
        <section className="mx-2 mt-2">
          <IonButton
            // size="small"
            onClick={() => {
              setCustomAdjustmentSalah("fajrAdjustment");
              setShowCustomAdjustmentsSheet(true);
            }}
            expand="full"
            style={{
              ...buttonStyles,
            }}
            className="text-[var(--ion-text-color)] font-light mb-4"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
              ...buttonStyles,
            }}
            className="text-[var(--ion-text-color)] font-light mb-4"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
              ...buttonStyles,
            }}
            className="text-[var(--ion-text-color)] font-light mb-4"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
              ...buttonStyles,
            }}
            className="text-[var(--ion-text-color)] font-light mb-4"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
              ...buttonStyles,
              // "min-height": "40px",
              "padding-bottom": "10px",
            }}
            className="text-[var(--ion-text-color)] font-light mb-4"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg">
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
          <section className="mx-2 my-5">
            <IonButton
              // size="small"
              onClick={() => {
                setShowShafaqRulesSheet(true);
              }}
              expand="full"
              style={{
                ...buttonStyles,
                // "min-height": "40px",
              }}
              className="text-[var(--ion-text-color)] text-sm"
            >
              <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg font-light">
                <p className="">Shafaq Rule:</p>
                <div className="flex items-center gap-1">
                  <p>
                    {userPreferences.shafaqRule.charAt(0).toUpperCase() +
                      userPreferences.shafaqRule.slice(1)}
                  </p>
                  <p>
                    <MdOutlineChevronRight />
                  </p>
                </div>
              </div>
            </IonButton>
          </section>
        )}
        <section className="mx-2 my-5 ">
          <IonButton
            // size="small"
            id="open-polar-circle-settings-sheet"
            expand="full"
            style={{
              ...buttonStyles,
              "min-height": "40px",
            }}
            className="text-[var(--ion-text-color)] text-sm"
          >
            <div className="flex items-center justify-between w-full py-3  px-1 bg-[color:var(--card-bg-color)] rounded-lg font-light">
              <p className="">Polar Circle Resolution:</p>
              <div className="flex items-center gap-1">
                <p>
                  {
                    polarCircleResolutionValues[
                      userPreferences.polarCircleResolution
                    ]
                  }
                </p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </div>
            </div>
          </IonButton>
        </section>
      </IonContent>
      <BottomSheetCalculationMethods
        triggerId="open-salah-calculations-sheet"
        dbConnection={dbConnection}
        // setSelectedCalculationMethod={setSelectedCalculationMethod}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
      />
      <BottomSheetMadhabOptions
        triggerId="open-madhab-options-sheet"
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
      <BottomSheetPolarCircleSetting
        triggerId="open-polar-circle-settings-sheet"
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
      />
      {/* </IonPage> */}
    </IonModal>
  );
};

export default BottomSheetSalahTimesSettings;
