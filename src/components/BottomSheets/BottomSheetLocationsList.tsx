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
  const [showDeleteLocationActionSheet, setShowDeleteLocationActionSheet] =
    useState(false);

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
                      setShowDeleteLocationActionSheet(true);
                      console.log("Delete button clicked");
                    }}
                  >
                    <IonIcon
                      data-testid="delete-location-btn"
                      icon={trashOutline}
                    ></IonIcon>
                  </IonButton>
                  <ActionSheet
                    setState={setShowDeleteLocationActionSheet}
                    isOpen={showDeleteLocationActionSheet}
                    header="Are you sure you want to delete this location?"
                    buttons={[
                      {
                        text: "Delete location?",
                        role: "destructive",
                        handler: async () => {
                          // if (counterId == null) {
                          //   console.error(
                          //     "CounterId does not exist within Reset Tasbeeh ActionSheet Buttons"
                          //   );
                          //   return;
                          // }
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
