import { IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../../utils/constants";

import MadhabOptions from "../../MadhabOptions";

// import { CalculationMethod } from "adhan";

interface BottomSheetMadhabOptionsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const BottomSheetMadhabOptions = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  userPreferences,
}: BottomSheetMadhabOptionsProps) => {
  return (
    <IonModal
      className="modal-fit-content "
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>Madhab</IonTitle>
        </IonToolbar>
      </IonHeader>

      <MadhabOptions
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
      />
    </IonModal>
  );
};

export default BottomSheetMadhabOptions;
