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
import { useEffect, useState } from "react";
import { userPreferencesType } from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../../utils/constants";
import { formatNumberWithSign, updateUserPrefs } from "../../../utils/helpers";

interface BottomSheetSalahTimeCustomAdjustmentsProps {
  getDefaultAdjustments: () => {
    fajrAdjustment: number;
    dhuhrAdjustment: number;
    asrAdjustment: number;
    maghribAdjustment: number;
    ishaAdjustment: number;
  };
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
  getDefaultAdjustments,
  showCustomAdjustmentsSheet,
  dbConnection,
  setUserPreferences,
  userPreferences,
  setShowCustomAdjustmentsSheet,
  customAdjustmentSalah,
}: BottomSheetSalahTimeCustomAdjustmentsProps) => {
  const [totalAdjustedValue, setTotalAdjustedValue] = useState("0");
  const [userAdjustedValue, setUserAdjustedValue] = useState<null | number>(
    null,
  );

  const salahMap = {
    fajrAdjustment: "Fajr Adjustment",
    dhuhrAdjustment: "Dhuhr Adjustment",
    asrAdjustment: "Asr Adjustment",
    maghribAdjustment: "Maghrib Adjustment",
    ishaAdjustment: "Isha Adjustment",
  };

  const customAdjustmentsArr = [];
  for (let i = -60; i <= 60; i++) {
    customAdjustmentsArr.push(String(i));
  }

  useEffect(() => {
    console.log("Default + User adjustment is equal to: ", totalAdjustedValue);
  });

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      isOpen={showCustomAdjustmentsSheet}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      onWillPresent={() => {
        console.log(
          "default adjustment: ",
          getDefaultAdjustments()[customAdjustmentSalah],
        );

        console.log(
          "user adjustment: ",
          userPreferences[customAdjustmentSalah],
        );

        setTotalAdjustedValue(
          String(
            Number(userPreferences[customAdjustmentSalah]) +
              getDefaultAdjustments()[customAdjustmentSalah],
          ),
        );
      }}
      onWillDismiss={async () => {
        // console.log("customAdjustmentSalah: ", customAdjustmentSalah);
        // if (!customAdjustmentSalah) return;

        if (userAdjustedValue !== null) {
          await updateUserPrefs(
            dbConnection,
            customAdjustmentSalah,
            String(userAdjustedValue),
            setUserPreferences,
          );
        }
        setTotalAdjustedValue("0");
        setUserAdjustedValue(null);
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
          value={totalAdjustedValue}
          onIonChange={({ detail }) => {
            const userAdjustedValue =
              Number(detail.value) -
              getDefaultAdjustments()[customAdjustmentSalah];

            console.log("USER ADJUSTED VALUE: ", userAdjustedValue);

            setTotalAdjustedValue(
              String(
                userAdjustedValue +
                  getDefaultAdjustments()[customAdjustmentSalah],
              ),
            );

            setUserAdjustedValue(userAdjustedValue);
          }}
        >
          {customAdjustmentsArr.map((item) => {
            return (
              <IonPickerColumnOption key={item} value={item}>
                {formatNumberWithSign(Number(item))}
              </IonPickerColumnOption>
            );
          })}
        </IonPickerColumn>
      </IonPicker>
    </IonModal>
  );
};

export default BottomSheetSalahTimeCustomAdjustments;
