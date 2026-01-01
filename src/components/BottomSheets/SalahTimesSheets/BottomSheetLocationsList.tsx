import {
  IonContent,
  IonHeader,
  IonModal,
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";

import { add, pencilOutline, trashOutline } from "ionicons/icons";
import { useState } from "react";

import { MdCheck } from "react-icons/md";
import {
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../../types/types";
import {
  getSalahTimes,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../../utils/constants";
import {
  fetchAllLocations,
  updateActiveLocation,
} from "../../../utils/dbUtils";
import ActionSheet from "../../ActionSheet";
import Toast from "../../Toast";
import BottomSheetAddLocation from "./BottomSheetAddLocation";

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
  // calculateActiveLocationSalahTimes: () => Promise<void>;
  userPreferences: userPreferencesType;
  setSalahtimes: React.Dispatch<
    React.SetStateAction<{
      fajr: string;
      sunrise: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    }>
  >;
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
  // calculateActiveLocationSalahTimes,
  userPreferences,
  setSalahtimes,
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
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
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
                  const { allLocations } = await fetchAllLocations(
                    dbConnection
                  );
                  setUserLocations(allLocations);
                  // await calculateActiveLocationSalahTimes();
                  await getSalahTimes(
                    dbConnection,
                    userPreferences,
                    setSalahtimes
                  );
                }}
                className="flex items-center justify-between border-b"
              >
                <div className="flex items-center justify-between mx-2">
                  {/* {location.isSelected === 1 && <MdCheck />} */}
                  <MdCheck
                    className={
                      location.isSelected === 1 ? "opacity-10" : "opacity-0"
                    }
                  />
                  <IonItem
                    style={{ "--border-color": "red" }}
                    data-testid="list-item"
                    lines="none"
                  >
                    {location.locationName}
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
                        size="small"
                        aria-label="delete location"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocationToDeleteId(location.id);
                          setShowDeleteLocationActionSheet(true);
                        }}
                      >
                        <IonIcon
                          data-testid="delete-location-btn"
                          icon={trashOutline}
                        ></IonIcon>
                      </IonButton>
                    </div>
                  </IonItem>
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
              if (!userLocations) return;

              if (locationToDeleteId === null) {
                console.error(
                  "locationToDeleteId does not exist within delete location ActionSheet handler"
                );
                return;
              }

              await deleteUserLocation(dbConnection, locationToDeleteId);
              setLocationToDeleteId(null);
              const { allLocations, activeLocation } = await fetchAllLocations(
                dbConnection
              );
              setUserLocations(allLocations);

              if (!allLocations || allLocations.length === 0) return;

              // const activeLocation = allLocations.find(
              //   (location) => location.isSelected === 1
              // );

              if (!activeLocation) {
                await updateActiveLocation(dbConnection, allLocations[0].id);
                const { allLocations: updatedLocations } =
                  await fetchAllLocations(dbConnection);
                setUserLocations(updatedLocations);
              }

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
