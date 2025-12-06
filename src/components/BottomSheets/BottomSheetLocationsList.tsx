import {
  IonContent,
  IonHeader,
  IonModal,
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { LocationsDataObjTypeArr } from "../../types/types";
import { add } from "ionicons/icons";
import BottomSheetSalahTimesSettings from "./BottomSheetSalahTimesSettings";
import BottomSheetLocationSettings from "./BottomSheetLocationSettings";

interface BottomSheetSalahTimesSettingsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  //   setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
}

const BottomSheetLocationsList = ({
  triggerId,
  dbConnection,
  //   setUserPreferences,
  setUserLocations,
  userLocations,
}: BottomSheetSalahTimesSettingsProps) => {
  return (
    <IonModal
      mode="ios"
      trigger={triggerId}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onWillDismiss={() => {
        // setNewReasonInput("");
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Locations</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <ul>
            {userLocations?.map((location) => (
              <li key={location.id}>{location.locationName}</li>
            ))}
          </ul>
          <IonFab
            aria-label="add new location"
            slot="fixed"
            vertical="bottom"
            horizontal="end"
          >
            <IonFabButton id="open-location-settings-sheet">
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
      <BottomSheetLocationSettings
        triggerId={"open-location-settings-sheet"}
        dbConnection={dbConnection}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
      />
    </IonModal>
  );
};

export default BottomSheetLocationsList;
