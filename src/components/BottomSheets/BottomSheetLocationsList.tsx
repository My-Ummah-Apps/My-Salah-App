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
import { useState } from "react";
import ActionSheet from "../ActionSheet";
import {
  deleteUserLocation,
  fetchAllLocations,
  updateActiveLocation,
} from "../../utils/dbUtils";
import Toast from "../Toast";
import BottomSheetAddLocation from "./BottomSheetAddLocation";
import { MdCheck } from "react-icons/md";

interface BottomSheetSalahTimesSettingsProps {
  // triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  //   setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  setShowLocationsListSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showLocationsListSheet: boolean;
  userLocations: LocationsDataObjTypeArr | undefined;
  setShowAddLocationSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showAddLocationSheet: boolean;
  setShowLocationFailureToast: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLocationAddedToast: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomSheetLocationsList = ({
  // triggerId,
  dbConnection,
  //   setUserPreferences,
  setUserLocations,
  setShowLocationsListSheet,
  showLocationsListSheet,
  userLocations,
  setShowAddLocationSheet,
  showAddLocationSheet,
  setShowLocationFailureToast,
  setShowLocationAddedToast,
}: BottomSheetSalahTimesSettingsProps) => {
  const [showDeleteLocationActionSheet, setShowDeleteLocationActionSheet] =
    useState(false);
  const [showEditLocationActionSheet, setShowEditLocationActionSheet] =
    useState(false);

  const [locationToDeleteId, setLocationToDeleteId] = useState<null | number>(
    null
  );
  const [showDeleteLocationToast, setShowDeleteLocationToast] = useState(false);

  return (
    <IonModal
      isOpen={showLocationsListSheet}
      mode="ios"
      // trigger={triggerId}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onDidDismiss={() => {
        setShowLocationsListSheet(false);
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
                key={location.id}
                onClick={async () => {
                  await updateActiveLocation(dbConnection, location.id);
                  const locations = await fetchAllLocations(dbConnection);
                  setUserLocations(locations);
                }}
                className="flex items-center justify-between border-b"
              >
                <div className="flex items-center mx-2">
                  {location.isSelected === 1 && <MdCheck />}
                  <IonItem data-testid="list-item" lines="none">
                    {location.locationName}
                  </IonItem>
                </div>

                <div className="flex items-center">
                  {/* <IonButton
                    data-testid="edit-location-btn"
                    fill="clear"
                    aria-label="edit location"
                  >
                    <IonIcon icon={pencilOutline}></IonIcon>
                  </IonButton> */}
                  <IonButton
                    className="text-[var(--ion-text-color)]"
                    fill="clear"
                    aria-label="delete location"
                    onClick={() => {
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
                </div>
              </section>
            ))}
          </IonList>
          <IonFab
            onClick={() => {
              setShowAddLocationSheet(true);
            }}
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            data-testid="add-location-btn"
          >
            <IonFabButton
              id="open-location-settings-sheet"
              aria-label="add location"
            >
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>

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
              const locations = await fetchAllLocations(dbConnection);
              setUserLocations(locations);
              setLocationToDeleteId(null);
              // setShowResetToast(true);
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
      <Toast
        isOpen={showDeleteLocationToast}
        message="Location deleted"
        setShow={setShowDeleteLocationToast}
        testId={"location-deletion-toast"}
      />
      <BottomSheetAddLocation
        setShowAddLocationSheet={setShowAddLocationSheet}
        showAddLocationSheet={showAddLocationSheet}
        dbConnection={dbConnection}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
        setShowLocationFailureToast={setShowLocationFailureToast}
        setShowLocationAddedToast={setShowLocationAddedToast}
      />
    </IonModal>
  );
};

export default BottomSheetLocationsList;
