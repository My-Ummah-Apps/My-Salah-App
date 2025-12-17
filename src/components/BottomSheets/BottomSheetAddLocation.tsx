import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonTitle,
  IonToolbar,
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
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import { addUserLocation, fetchAllLocations } from "../../utils/dbUtils";
import { LocationsDataObjTypeArr } from "../../types/types";
import { globeOutline, locationOutline, searchOutline } from "ionicons/icons";

interface BottomSheetAddLocationProps {
  setShowAddLocationSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showAddLocationSheet?: boolean;
  setShowSalahTimesSettingsSheet?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
  setShowLocationFailureToast: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLocationAddedToast: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomSheetAddLocation = ({
  setShowAddLocationSheet,
  showAddLocationSheet,
  setShowSalahTimesSettingsSheet,
  dbConnection,
  setUserLocations,
  userLocations,
  setShowLocationFailureToast,
  setShowLocationAddedToast,
}: BottomSheetAddLocationProps) => {
  const [presentLocationSpinner, dismissLocationSpinner] = useIonLoading();
  const [showLocationNameInput, setShowLocationNameInput] =
    useState<boolean>(false);
  const [locationName, setLocationName] = useState("");
  const [showEmptyLocationError, setShowEmptyLocationError] =
    useState<boolean>(false);
  const [showDuplicateLocationError, setShowDuplicateLocationError] =
    useState<boolean>(false);
  const [useManualCoordinates, setUseManualCoordinates] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // let latitude = useRef<number | null>(null);
  // let longitude = useRef<number | null>(null);

  const clearLatLong = () => {
    // latitude.current = null;
    // longitude.current = null;
    setLatitude(null);
    setLongitude(null);
  };

  const handleInputPromptDismissed = () => {
    setShowLocationNameInput(false);
    setLocationName("");
    clearLatLong();
    setShowEmptyLocationError(false);
    setShowDuplicateLocationError(false);
    setUseManualCoordinates(false);
  };

  const handleGrantedPermission = async () => {
    try {
      // throw new Error("ERROR THROWN");
      const location = await Geolocation.getCurrentPosition();
      // latitude.current = location.coords.latitude;
      // longitude.current = location.coords.longitude;
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
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
      // className="modal-fit-content"
      mode="ios"
      isOpen={showAddLocationSheet}
      // trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      onDidDismiss={() => {
        setShowAddLocationSheet(false);
      }}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Location</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {showLocationNameInput && (
          <section className="flex flex-col items-center justify-center w-4/5 absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[color:var(--card-bg-color)] rounded-lg max-w-[300px]">
            <div className="py-3 text-center">
              {/* <h5>Enter location name</h5> */}
              <IonInput
                className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                aria-label="Location name"
                type="text"
                placeholder="Location name (e.g. Home)"
                onIonInput={(e) => setLocationName(e.detail.value || "")}
              ></IonInput>
              {showEmptyLocationError && (
                <p className={`mb-1 text-xs text-red-500`}>
                  {"Please enter a location name"}
                </p>
              )}
              {showDuplicateLocationError && (
                <p className={`mb-1 text-xs text-red-500`}>
                  {"Location already exists"}
                </p>
              )}
              {useManualCoordinates && (
                <>
                  <IonInput
                    className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                    aria-label="Latitude"
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onIonInput={(e) =>
                      setLatitude(Number(e.detail.value) || null)
                    }
                  ></IonInput>
                  <IonInput
                    className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                    aria-label="Longitude"
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onIonInput={(e) =>
                      setLongitude(Number(e.detail.value) || null)
                    }
                  ></IonInput>
                </>
              )}
            </div>
            <div className="flex justify-end w-full">
              <IonButton
                className="p-0 text-base text-[var(--ion-text-color)]"
                size="small"
                fill="clear"
                onClick={() => {
                  handleInputPromptDismissed();
                }}
              >
                Cancel
              </IonButton>
              <IonButton
                className="text-base text-[var(--ion-text-color)]"
                size="small"
                fill="clear"
                onClick={async () => {
                  const locationNameTrimmed = locationName.trim();
                  console.log("locationNameTrimmed:", locationNameTrimmed);
                  if (locationNameTrimmed === "") {
                    setShowDuplicateLocationError(false);
                    setShowEmptyLocationError(true);
                    return;
                  }

                  if (!userLocations) {
                    console.error("LocationNames state is undefined");
                    return;
                  }

                  const locationNames = userLocations.map((loc) =>
                    loc.locationName.toLowerCase()
                  );
                  console.log("Locations: ", locationNames);

                  if (
                    locationNames.includes(locationNameTrimmed.toLowerCase())
                  ) {
                    console.log("DUPLICATE LOCATION");

                    setShowEmptyLocationError(false);
                    setShowDuplicateLocationError(true);
                    return;
                  }

                  if (latitude && longitude) {
                    await addUserLocation(
                      dbConnection,
                      locationName,
                      latitude,
                      longitude
                    );

                    const locations = await fetchAllLocations(dbConnection);
                    console.log("Locations: ", locations);

                    if (locations) {
                      console.log("LOCATIONS: ", locations.length);

                      if (locations.length === 1) {
                        setShowSalahTimesSettingsSheet?.(true);
                      }
                      setShowAddLocationSheet(false);
                      setUserLocations(locations);
                      setShowLocationAddedToast(true);
                    } else {
                      console.error("Locations undefined");
                    }

                    console.log("RESETTING INPUT");

                    handleInputPromptDismissed();
                  } else {
                    console.error("lat / long undefined");
                  }
                }}
              >
                Save
              </IonButton>
            </div>
          </section>
        )}
        <section className="px-2 mx-5 mt-2 text-center">
          <p>
            To calculate Salah times, the app requires your location, you can
            use one of the three methods below.
          </p>
        </section>
        <IonCard>
          <IonCardHeader className="pt-0 pb-1">
            <IonCardTitle>GPS</IonCardTitle>
            <IonCardSubtitle>Method 1</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Automatically detects your current location using your device’s GPS.
            <div className="flex justify-end">
              <IonButton
                className="mt-5 text-sm"
                color="tertiary"
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
                <IonIcon className="mr-2" icon={locationOutline} />
                Use Device GPS
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader className="pt-0 pb-1">
            <IonCardTitle>Search City</IonCardTitle>
            <IonCardSubtitle>Method 2</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Search for a city by name and select it from the results.{" "}
            <div className="flex justify-end">
              <IonButton
                onClick={() => {
                  setShowLocationNameInput(true);
                }}
                className="mt-5 text-sm"
                color="tertiary"
              >
                <IonIcon className="mr-2" icon={searchOutline} />
                Search Manually
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader className="pt-0 pb-1">
            <IonCardTitle>Enter Coordinates</IonCardTitle>
            <IonCardSubtitle>Method 3</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Manually enter a latitude and longitude if you already know the
            exact location.
            <div className="flex justify-end">
              <IonButton
                onClick={() => {
                  setUseManualCoordinates(true);
                  setShowLocationNameInput(true);
                }}
                className="mt-5 text-sm"
                color="tertiary"
              >
                <IonIcon className="mr-2" icon={globeOutline} />
                Enter Coordinates
              </IonButton>
            </div>
          </IonCardContent>
          {/* <IonInput
            aria-label="latitude"
            placeholder="latitude"
            className="bg-[var(--textarea-bg-color)] text-[var(--ion-text-color)] rounded-lg my-2"
          ></IonInput>
          <IonInput
            aria-label="longitude"
            placeholder="longitude"
            className="bg-[var(--textarea-bg-color)] text-[var(--ion-text-color)] rounded-lg my-2"
          ></IonInput> */}
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetAddLocation;
