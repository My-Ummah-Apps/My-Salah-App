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
import { add, pencilOutline, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import ActionSheet from "../ActionSheet";
import { deleteUserLocation } from "../../utils/dbUtils";

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
  console.log("BOTTOMSHEET LOCATIONS LIST RENDERED");

  const [showDeleteLocationActionSheet, setShowDeleteLocationActionSheet] =
    useState(false);
  const [showEditLocationActionSheet, setShowEditLocationActionSheet] =
    useState(false);

  const [locationToDeleteId, setLocationToDeleteId] = useState<null | number>(
    null
  );

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
                <IonItem data-testid="list-item" lines="none">
                  {location.locationName}
                </IonItem>
                <section className="flex items-center">
                  <IonButton
                    data-testid="edit-location-btn"
                    fill="clear"
                    aria-label="edit location"
                  >
                    <IonIcon icon={pencilOutline}></IonIcon>
                  </IonButton>
                  <IonButton
                    fill="clear"
                    aria-label="delete location"
                    onClick={() => {
                      // setShowDeleteLocationActionSheet(false);
                      setLocationToDeleteId(location.id);
                      setShowDeleteLocationActionSheet(true);
                      console.log("Delete button clicked");
                    }}
                  >
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
      <ActionSheet
        // trigger="open-delete-location-action-sheet"
        setState={setShowDeleteLocationActionSheet}
        isOpen={showDeleteLocationActionSheet}
        // isOpen={!!locationToDelete}
        header="Are you sure you want to delete this location?"
        buttons={[
          {
            text: "Delete location?",
            role: "destructive",
            handler: async () => {
              if (locationToDeleteId === null) {
                console.error(
                  "locationToDeleteId does not exist within delete location ActionSheet handler"
                );
                return;
              }
              await deleteUserLocation(dbConnection, locationToDeleteId);
              // await resetSingleCounter(counterId);
              // closeSlidingItems();
              // setShowResetToast(true);
              // setCounterId(null);
              // setShowDeleteLocationActionSheet(false);
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: async () => {
              // setShowDeleteLocationActionSheet(false);
              // setCounterId(null);
            },
          },
        ]}
      />
    </IonModal>
  );
};

export default BottomSheetLocationsList;
