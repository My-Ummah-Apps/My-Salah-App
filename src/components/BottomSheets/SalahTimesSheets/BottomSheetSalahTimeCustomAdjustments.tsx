import {
  IonHeader,
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useState } from "react";
import { userPreferencesType } from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../../utils/constants";

interface BottomSheetSalahTimeCustomAdjustmentsProps {
  setShowCustomAdjustmentsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showCustomAdjustmentsSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  customAdjustmentSalah:
    | "fajrAdjustment"
    | "dhuhrAdjustment"
    | "asrAdjustment"
    | "maghribAdjustment"
    | "ishaAdjustment";
}

const BottomSheetSalahTimeCustomAdjustments = ({
  showCustomAdjustmentsSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
  setShowCustomAdjustmentsSheet,
  customAdjustmentSalah,
}: BottomSheetSalahTimeCustomAdjustmentsProps) => {
  const [increment, setIncrement] = useState(
    userPreferences[customAdjustmentSalah]
  );

  const salahMap = {
    fajrAdjustment: "Fajr Adjustment",
    dhuhrAdjustment: "Dhuhr Adjustment",
    asrAdjustment: "Asr Adjustment",
    maghribAdjustment: "Maghrib Adjustment",
    ishaAdjustment: "Isha Adjustment",
  };

  const arr = [];
  for (let i = -60; i <= 60; i++) {
    arr.push(String(i));
  }

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      isOpen={showCustomAdjustmentsSheet}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onWillPresent={() => {
        setIncrement(userPreferences[customAdjustmentSalah]);
      }}
      onWillDismiss={async () => {
        console.log("customAdjustmentSalah: ", customAdjustmentSalah);
        // if (!customAdjustmentSalah) return;
        await updateUserPrefs(
          dbConnection,
          customAdjustmentSalah,
          String(increment),
          setUserPreferences
        );
        setIncrement("0");
      }}
      onDidDismiss={() => {
        setShowCustomAdjustmentsSheet(false);
      }}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>{salahMap[customAdjustmentSalah]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonPicker className="">
        <IonPickerColumn
          value={increment}
          onIonChange={({ detail }) => {
            setIncrement(String(detail.value));
            console.log("CHANGED");
          }}
        >
          {arr.map((item) => {
            return (
              <IonPickerColumnOption key={item} value={item}>
                {item}
              </IonPickerColumnOption>
            );
          })}
        </IonPickerColumn>
      </IonPicker>
    </IonModal>
  );
};

export default BottomSheetSalahTimeCustomAdjustments;
