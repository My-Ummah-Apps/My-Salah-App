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
  IonList,
  IonItem,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { LocationsDataObjTypeArr } from "../../types/types";
import {
  add,
  addOutline,
  pencilOutline,
  trashBinOutline,
  trashOutline,
} from "ionicons/icons";
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
          <IonList>
            {userLocations?.map((location) => (
              <section
                className="flex items-center justify-between border-b"
                key={location.id}
              >
                <IonItem lines="none">{location.locationName}</IonItem>
                <section className="flex items-center">
                  <IonButton
                    data-testid="edit-location-btn"
                    fill="clear"
                    aria-label="edit location"
                  >
                    <IonIcon icon={pencilOutline}></IonIcon>
                  </IonButton>
                  <IonButton fill="clear" aria-label="delete location">
                    <IonIcon
                      data-testid="delete-location-btn"
                      icon={trashOutline}
                    ></IonIcon>
                  </IonButton>
                </section>
              </section>
            ))}
          </IonList>
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
      // ! replace bottom sheet trigger method to set state as opposed to
      triggerId
      {/* <BottomSheetLocationSettings
        triggerId={"open-location-settings-sheet"}
        dbConnection={dbConnection}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
      /> */}
    </IonModal>
  );
};

export default BottomSheetLocationsList;
