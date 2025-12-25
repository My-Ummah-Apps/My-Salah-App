import {
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
} from "@ionic/react";

import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  updateUserPrefs,
} from "../../utils/constants";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../../types/types";

import { useState } from "react";

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

  const angleOptions = Array.from({ length: 20 }, (_, i) =>
    (9 + i / 2).toString()
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
      <IonPicker className="my-5">
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
