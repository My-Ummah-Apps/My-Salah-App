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
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../../utils/constants";
import { userPreferencesType } from "../../../types/types";

interface BottomSheetCustomAnglesProps {
  setShowCustomAnglesSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showCustomAnglesSheet: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  customAngleSalah: "fajrAngle" | "ishaAngle";
}

const BottomSheetCustomAngles = ({
  setShowCustomAnglesSheet,
  showCustomAnglesSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
  customAngleSalah,
}: BottomSheetCustomAnglesProps) => {
  const [increment, setIncrement] = useState(userPreferences[customAngleSalah]);

  const angleOptions = Array.from({ length: 181 }, (_, i) =>
    (7 + i / 10).toString()
  );

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      isOpen={showCustomAnglesSheet}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onWillPresent={() => {
        setIncrement(userPreferences[customAngleSalah]);
      }}
      onWillDismiss={async () => {
        console.log("customAdjustmentSalah: ", customAngleSalah);
        // if (!customAdjustmentSalah) return;
        await updateUserPrefs(
          dbConnection,
          customAngleSalah,
          String(increment),
          setUserPreferences
        );
        setIncrement("0");
      }}
      onDidDismiss={() => {
        setShowCustomAnglesSheet(false);
      }}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>
            {customAngleSalah === "fajrAngle" ? "Fajr Angle" : "Isha Angle"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonPicker className="">
        <IonPickerColumn
          value={increment}
          onIonChange={({ detail }) => {
            setIncrement(String(detail.value));
          }}
        >
          {angleOptions.map((item) => {
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

export default BottomSheetCustomAngles;
