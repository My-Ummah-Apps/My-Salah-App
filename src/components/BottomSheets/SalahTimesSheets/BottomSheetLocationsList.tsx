import {
  IonContent,
  IonHeader,
  IonModal,
  IonButton,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  isPlatform,
} from "@ionic/react";

import { SQLiteDBConnection } from "@capacitor-community/sqlite";

import { add, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

import { MdCheck } from "react-icons/md";
import {
  LocationsDataObjTypeArr,
  salahTimesObjType,
  userPreferencesType,
} from "../../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../../utils/constants";
import { fetchAllLocations, toggleDBConnection } from "../../../utils/dbUtils";
import ActionSheet from "../../ActionSheet";
import Toast from "../../Toast";
import BottomSheetAddLocation from "./BottomSheetAddLocation";
import {
  cancelSalahReminderNotifications,
  getActiveLocation,
} from "../../../utils/helpers";

interface BottomSheetSalahTimesSettingsProps {
  // triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  //   setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr>
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
  setSalahtimes: React.Dispatch<React.SetStateAction<salahTimesObjType>>;
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
}: // calculateActiveLocationSalahTimes,
// userPreferences,
// setSalahtimes,
BottomSheetSalahTimesSettingsProps) => {
  const [showDeleteLocationActionSheet, setShowDeleteLocationActionSheet] =
    useState(false);
  // const [showEditLocationActionSheet, setShowEditLocationActionSheet] =
  //   useState(false);

  const [locationToDeleteId, setLocationToDeleteId] = useState<null | number>(
    null,
  );
  const [showDeleteLocationToast, setShowDeleteLocationToast] = useState(false);

  const updateActiveLocation = async (id: number) => {
    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    await dbConnection.current.run(
      `UPDATE userLocationsTable SET isSelected = 0`,
    );

    await dbConnection.current.run(
      `UPDATE userlocationsTable SET isSelected = 1 WHERE id = ?`,
      [id],
    );
  };

  const deleteUserLocation = async (
    dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
    id: number,
  ) => {
    const stmnt = `DELETE FROM userLocationsTable WHERE id = ?`;
    const params = [id];

    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    await dbConnection.current.run(stmnt, params);
  };

  useEffect(() => {
    const cancelAllSalahNotifications = async () => {
      if (userLocations?.length === 0) {
        await cancelSalahReminderNotifications("fajr");
        await cancelSalahReminderNotifications("dhuhr");
        await cancelSalahReminderNotifications("asr");
        await cancelSalahReminderNotifications("maghrib");
        await cancelSalahReminderNotifications("isha");
      }
    };

    cancelAllSalahNotifications();
  }, [userLocations]);

  return (
    <IonModal
      isOpen={showLocationsListSheet}
      mode="ios"
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
      {/* <IonPage> */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Locations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ul>
          {userLocations?.map((location) => (
            <li
              key={location.id}
              className="flex items-center justify-between mx-4 bg-[var(--card-bg-color)] border-b border-[var(--app-border-color)]"
              onClick={async () => {
                try {
                  await toggleDBConnection(dbConnection, "open");

                  await updateActiveLocation(location.id);

                  const { allLocations } =
                    await fetchAllLocations(dbConnection);

                  setUserLocations(allLocations);
                } catch (error) {
                  console.error(error);
                } finally {
                  await toggleDBConnection(dbConnection, "close");
                }
              }}
            >
              <div className="flex items-center">
                <MdCheck
                  className={`mx-2
                    ${location.isSelected === 1 ? "opacity-100" : "opacity-0"}
                 `}
                />
                <p>{location.locationName}</p>
              </div>

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
            </li>
          ))}
        </ul>
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
      {/* </IonPage> */}

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
                  "locationToDeleteId does not exist within delete location ActionSheet handler",
                );
                return;
              }

              try {
                await toggleDBConnection(dbConnection, "open");

                await deleteUserLocation(dbConnection, locationToDeleteId);

                setLocationToDeleteId(null);

                const { allLocations } = await fetchAllLocations(dbConnection);
                // console.log(
                //   "FETCH ALL LOCATIONS CALLE FROM LOCATIONS LIST SHEET 2: ",
                //   allLocations
                // );
                // if (!allLocations || allLocations.length === 0) {
                //   throw new Error("Error obtaining all locations");
                // }

                const activeLocation = getActiveLocation(allLocations);

                if (!activeLocation && allLocations.length > 0) {
                  await updateActiveLocation(allLocations[0].id);

                  const amendedLocations = allLocations.map((item, i) => ({
                    ...item,
                    isSelected: i === 0 ? 1 : 0,
                  }));
                  setUserLocations(amendedLocations);
                } else {
                  setUserLocations(allLocations);
                }
              } catch (error) {
                console.error(error);
              } finally {
                await toggleDBConnection(dbConnection, "close");
              }
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
