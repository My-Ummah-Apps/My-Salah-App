import {
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";

import {
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../../utils/constants";

import { useState } from "react";

import CalculationMethodOptions from "../../CalculationMethodOptions";

interface BottomSheetCalculationMethodsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr;
}

const BottomSheetCalculationMethods = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  userPreferences,
  userLocations,
}: BottomSheetCalculationMethodsProps) => {
  const [segmentOption, setSegmentOption] = useState<"manual" | "country">(
    "country",
  );

  return (
    <IonModal
      style={{ "--height": "80vh" }}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonHeader>
        <IonToolbar
          style={{
            "--background": "transparent",
            "--border-width": "0",
          }}
        >
          <IonTitle>Calculation Methods</IonTitle>
        </IonToolbar>
      </IonHeader>

      <CalculationMethodOptions
        dbConnection={dbConnection}
        setSegmentOption={setSegmentOption}
        segmentOption={segmentOption}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        userLocations={userLocations}
      />
    </IonModal>
  );
};

export default BottomSheetCalculationMethods;
