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

import {
  countryOptionsType,
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../../types/types";
import {
  calculationMethodsDetails,
  countryOptions,
  countryToMethod,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  prayerCalculationMethodLabels,
  setAdhanLibraryDefaults,
  updateUserPrefs,
} from "../../../utils/constants";

import { useState } from "react";
import { checkmarkCircle } from "ionicons/icons";
import CalculationMethodOptions from "../../CalculationMethodOptions";

interface BottomSheetCalculationMethodsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr | undefined;
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
        <CalculationMethodOptions
          dbConnection={dbConnection}
          setSegmentOption={setSegmentOption}
          segmentOption={segmentOption}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
          userLocations={userLocations}
        />
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetCalculationMethods;
