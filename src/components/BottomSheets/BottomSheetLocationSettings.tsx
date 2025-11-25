import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonModal,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonLoading,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  promptToOpenDeviceSettings,
} from "../../utils/constants";
import { AndroidSettings } from "capacitor-native-settings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

import { Capacitor } from "@capacitor/core";
import { useRef, useState } from "react";
import Toast from "../Toast";
import { toggleDBConnection } from "../../utils/dbUtils";
import { LocationsDataObjTypeArr } from "../../types/types";

// import { Capacitor } from "@capacitor/core";

interface BottomSheetLocationSettingsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  // setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
}

const BottomSheetLocationSettings = ({
  triggerId,
  dbConnection,
  setUserLocations,
}: // setUserPreferences,
BottomSheetLocationSettingsProps) => {
  const [presentLocationSpinner, dismissLocationSpinner] = useIonLoading();
  const [showLocationNameInput, setShowLocationNameInput] =
    useState<boolean>(false);
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState(false);

  let latitude = useRef<number>();
  let longitude = useRef<number>();

  const addUserLocation = async (
    locationName: string,
    latitude: number,
    longitude: number
  ) => {
    try {
      await toggleDBConnection(dbConnection, "open");

      const stmnt = `INSERT INTO userLocationsTable (locationName, latitude, longitude, isSelected) 
        VALUES (?, ?, ?, ?);
        `;

      const params = [locationName, latitude, longitude, "0"];

      await dbConnection.current?.run(stmnt, params);

      const res = await dbConnection.current?.query(
        "SELECT * from userLocationsTable"
      );

      setUserLocations(res?.values);
    } catch (error) {
      console.error(error);
    } finally {
      toggleDBConnection(dbConnection, "close");
    }
  };

  const handleGrantedPermission = async () => {
    console.log("PERMISSION GRANTED");

    try {
      // throw new Error("ERROR THROWN");
      const location = await Geolocation.getCurrentPosition();
      latitude.current = location.coords.latitude;
      longitude.current = location.coords.longitude;
      console.log(latitude, longitude);

      dismissLocationSpinner();
      setShowLocationNameInput(true);
    } catch (error) {
      console.log("Failed to obtain location");
      setShowLocationFailureToast(true);
      console.error(error);
    } finally {
      dismissLocationSpinner();
    }
    // await updateUserPrefs(dbConnection, "latitude", "", setUserPreferences);
    // await updateUserPrefs(
    //   dbConnection,
    //   "longitude",
    //   latitude,
    //   setUserPreferences
    // );
    // await updateUserPrefs(
    //   dbConnection,
    //   "longitude",
    //   longitude,
    //   setUserPreferences
    // );

    // alert(location.coords.latitude + location.coords.longitude);
  };

  const handleLocationPermissions = async () => {
    const device = Capacitor.getPlatform();

    const { location: locationPermission } =
      await Geolocation.checkPermissions();
    console.log("Permission: ", locationPermission);

    if (locationPermission === "granted") {
      await handleGrantedPermission();
      return;
    }

    if (
      locationPermission === "prompt" ||
      locationPermission === "prompt-with-rationale"
    ) {
      try {
        if (device === "ios" || device === "android") {
          const permission = await Geolocation.requestPermissions();
          if (permission.location === "granted") {
            await handleGrantedPermission();
          }
          return;
        }

        if (device === "web") {
          const pos = await Geolocation.getCurrentPosition();
          if (pos.coords) {
            await handleGrantedPermission();
          }
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (locationPermission === "denied") {
      console.log("SYSTEM LOCATION PERMISSIONS DENIED");

      await promptToOpenDeviceSettings(
        "You currently have location turned off for this application, you can open Settings to re-enable it",
        AndroidSettings.Location
      );

      return;
    }
  };

  return (
    <IonModal
      mode="ios"
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onWillDismiss={() => {
        // setNewReasonInput("");
      }}
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Location</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAlert
          isOpen={showLocationNameInput}
          onDidDismiss={async ({ detail }) => {
            console.log(detail.data.values[0], detail.role);
            const inputValue = detail.data.values[0];

            if (detail.role === "confirm" && detail.data) {
              console.log("latitude: ", latitude.current);
              console.log("longitude: ", longitude.current);

              if (latitude.current && longitude.current) {
                await addUserLocation(
                  inputValue,
                  latitude.current,
                  longitude.current
                );
              } else {
                // TODO: Add error message?
              }

              try {
                await toggleDBConnection(dbConnection, "open");
                const res = await dbConnection.current?.query(
                  `SELECT * FROM userLocationsTable`
                );
                console.log("Locations: ", res?.values);
              } catch (error) {
                console.error(error);
              } finally {
                await toggleDBConnection(dbConnection, "close");
              }
            }

            setShowLocationNameInput(false);
          }}
          header="Location"
          message="Please enter a location name"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                console.log("Alert cancelled");
              },
            },
            {
              text: "Save",
              role: "confirm",

              handler: async (data) => {
                if (!data[0]) {
                  return false;
                }
              },
            },
          ]}
          inputs={[
            {
              placeholder: "Location",
            },
          ]}
        ></IonAlert>
        <section className="p-2 mx-5 mb-5 text-center">
          <p>
            To calculate Salah times, the app requires your location, you can
            use one of the three methods below.
          </p>
        </section>
        <section className="p-2 mx-5 my-5 text-center border rounded-lg">
          <h2 className="text-lg">Method 1</h2>
          <p>Use Device GPS</p>
          <IonButton
            expand="block"
            onClick={async () => {
              presentLocationSpinner({
                message: "Detecting location...",
                backdropDismiss: false,
              });
              try {
                await handleLocationPermissions();
              } catch (error) {
                console.error(error);
              } finally {
                await dismissLocationSpinner();
              }
            }}
          >
            Find My Location
          </IonButton>
        </section>
        <section className="p-2 mx-5 my-5 text-center border rounded-lg">
          <h2 className="text-lg">Method 2</h2>
          <p>Enter Location Manually</p>
          <IonInput
            aria-label="location"
            placeholder="location"
            className="bg-[var(--textarea-bg-color)] rounded-lg text-[var(--ion-text-color)] my-2"
          ></IonInput>
        </section>
        <section className="p-2 mx-5 my-5 text-center border rounded-lg">
          <h2 className="text-lg">Method 3</h2>
          <p>Enter Coordinates</p>
          <IonInput
            aria-label="latitude"
            placeholder="latitude"
            className="bg-[var(--textarea-bg-color)] text-[var(--ion-text-color)] rounded-lg my-2"
          ></IonInput>
          <IonInput
            aria-label="longitude"
            placeholder="longitude"
            className="bg-[var(--textarea-bg-color)] text-[var(--ion-text-color)] rounded-lg my-2"
          ></IonInput>
        </section>
        <Toast
          isOpen={showLocationFailureToast}
          message="Unable to retrieve location, please try again"
          setShow={setShowLocationFailureToast}
        />
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetLocationSettings;
