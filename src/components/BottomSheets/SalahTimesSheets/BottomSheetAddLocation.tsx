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
  useIonLoading,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";

import { AndroidSettings } from "capacitor-native-settings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";

import { globeOutline, locationOutline, searchOutline } from "ionicons/icons";

import cities from "../../../assets/city_list.json";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  promptToOpenDeviceSettings,
} from "../../../utils/constants";
import { LocationsDataObjTypeArr } from "../../../types/types";
import { addUserLocation, fetchAllLocations } from "../../../utils/dbUtils";

const allCities = cities.map(
  (obj: { country: string; name: string; lat: number; lon: number }) => {
    return {
      country: obj.country,
      city: obj.name,
      latitude: obj.lat,
      longitude: obj.lon,
      search: obj.name.toLowerCase(),
    };
  }
);

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
  const [showLocationDetailsInput, setShowLocationDetailsInput] =
    useState<boolean>(false);
  const [locationName, setLocationName] = useState("");
  const [showEmptyLocationError, setShowEmptyLocationError] =
    useState<boolean>(false);
  const [showDuplicateLocationError, setShowDuplicateLocationError] =
    useState<boolean>(false);
  const [showEmptyLatitudeError, setShowEmptyLatitudeError] = useState(false);
  const [showEmptyLongitudeError, setShowEmptyLongitudeError] = useState(false);
  const [useManualCoordinates, setUseManualCoordinates] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [citySearchMode, setCitySearchMode] = useState(false);

  const clearLatLong = () => {
    setLatitude(null);
    setLongitude(null);
  };

  const handleInputPromptDismissed = () => {
    setShowLocationDetailsInput(false);
    setLocationName("");
    clearLatLong();
    setShowEmptyLocationError(false);
    setShowDuplicateLocationError(false);
    setUseManualCoordinates(false);
    setShowEmptyLatitudeError(false);
    setShowEmptyLongitudeError(false);
    setCitySearchMode(false);
  };

  const handleGrantedPermission = async () => {
    try {
      // throw new Error("ERROR THROWN");
      const location = await Geolocation.getCurrentPosition();

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      console.log(latitude, longitude);

      dismissLocationSpinner();
      setShowLocationDetailsInput(true);
    } catch (error) {
      console.log("Failed to obtain location");
      setShowLocationFailureToast(true);
      console.error(error);
    } finally {
      dismissLocationSpinner();
    }
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
      // style={{ "--height": "80vh" }}
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
        handleInputPromptDismissed();
      }}
    >
      <IonHeader>
        {/* <IonToolbar>
          <IonTitle>Location</IonTitle>
        </IonToolbar> */}
      </IonHeader>
      <IonContent>
        {showLocationDetailsInput && (
          <section className="flex flex-col items-center justify-center w-4/5 absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[color:var(--card-bg-color)] rounded-lg max-w-[300px]">
            <div className="pt-3 text-center">
              <IonInput
                className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                aria-label="Location name"
                type="text"
                placeholder="Location name"
                onIonInput={(e) => {
                  setLocationName(e.detail.value || "");
                  // ! Below is causing search mode to be turned on for all button clicks
                  if (citySearchMode === false) {
                    setCitySearchMode(true);
                  }
                  setShowDuplicateLocationError(false);
                  setShowEmptyLocationError(false);
                }}
                value={locationName}
              ></IonInput>
              {citySearchMode && locationName && (
                <ul>
                  {allCities
                    .filter((obj) =>
                      obj.search.startsWith(locationName.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((obj) => (
                      <li
                        key={obj.latitude + obj.longitude}
                        className="py-2 border-b border-stone-700"
                        onClick={() => {
                          setLocationName(obj.city);
                          setLatitude(obj.latitude);
                          setLongitude(obj.longitude);
                          setCitySearchMode(false);
                        }}
                      >
                        {obj.city}, {obj.country}
                      </li>
                    ))}
                </ul>
              )}
              <p
                className={`mb-1 text-xs text-red-500 ${
                  showEmptyLocationError || showDuplicateLocationError
                    ? "visible"
                    : "invisible"
                }`}
              >
                {showEmptyLocationError
                  ? "Please enter a location name"
                  : "Location already exists"}
              </p>

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

                  <p
                    className={`mb-1 text-xs text-red-500 ${
                      showEmptyLatitudeError ? "visible" : "invisible"
                    }`}
                  >
                    {"Please enter latitude"}
                  </p>
                  <IonInput
                    className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                    aria-label="Longitude"
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onIonInput={(e) => {
                      setLongitude(Number(e.detail.value) || null);
                    }}
                  ></IonInput>

                  <p
                    className={`mb-1 text-xs text-red-500 ${
                      showEmptyLongitudeError ? "visible" : "invisible"
                    }`}
                  >
                    {"Please enter longitude"}
                  </p>
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
                  setShowDuplicateLocationError(false);
                  setShowEmptyLocationError(false);
                  setShowEmptyLatitudeError(false);
                  setShowEmptyLongitudeError(false);
                  const locationNameTrimmed = locationName.trim();

                  console.log("locationNameTrimmed:", locationNameTrimmed);
                  if (locationNameTrimmed === "") {
                    setShowEmptyLocationError(true);
                    // return;
                  }

                  if (latitude === null) {
                    setShowEmptyLatitudeError(true);
                  }

                  if (longitude === null) {
                    setShowEmptyLongitudeError(true);
                  }

                  if (!userLocations) {
                    console.error("LocationNames state is undefined");
                    return;
                  }

                  const locationNames = userLocations.map((loc) =>
                    loc.locationName.toLowerCase()
                  );

                  // ! Need to tighten this further, make it so that duplication is detected when name + lat + long are all the same
                  if (
                    locationNames.includes(locationNameTrimmed.toLowerCase())
                  ) {
                    console.log("DUPLICATE LOCATION");

                    setShowEmptyLocationError(false);
                    setShowDuplicateLocationError(true);
                    return;
                  }

                  if (latitude && longitude && locationName) {
                    await addUserLocation(
                      dbConnection,
                      locationName,
                      latitude,
                      longitude
                    );

                    const { allLocations } = await fetchAllLocations(
                      dbConnection
                    );
                    console.log("Locations: ", allLocations);

                    if (allLocations) {
                      if (allLocations.length === 1) {
                        setShowSalahTimesSettingsSheet?.(true);
                      }
                      setShowAddLocationSheet(false);
                      setUserLocations(allLocations);
                      setShowLocationAddedToast(true);
                    } else {
                      console.error("Locations undefined");
                    }

                    console.log("RESETTING INPUT");

                    handleInputPromptDismissed();
                  } else {
                    console.error("lat / long undefined");
                    return;
                  }
                }}
              >
                Save
              </IonButton>
            </div>
          </section>
        )}
        <section className="px-2 mx-5 mt-10 text-sm text-center">
          <p>
            To calculate Salah times, the app requires your location, you can
            use one of the three methods below. <br></br>
            <br></br>For the most accurate results, Methods 1 & 2 (GPS and
            latitude/longitude) are recommended. Method 3 (City search) is less
            precise and may give less accurate Salah times.
          </p>
        </section>
        <IonCard>
          <IonCardHeader className="pt-0 pb-1">
            <IonCardTitle className="">GPS</IonCardTitle>
            <IonCardSubtitle>Method 1</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Automatically detects your current location using your device’s GPS.
            <div className="flex justify-end">
              <IonButton
                className="mt-5 text-sm"
                color="tertiary"
                onClick={async () => {
                  if (showLocationDetailsInput) return;
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
            <IonCardTitle>Enter Coordinates</IonCardTitle>
            <IonCardSubtitle>Method 2</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Manually enter a latitude and longitude if you already know the
            exact location.
            <div className="flex justify-end">
              <IonButton
                onClick={() => {
                  if (showLocationDetailsInput) return;
                  setUseManualCoordinates(true);
                  setShowLocationDetailsInput(true);
                }}
                className="mt-5 text-sm"
                color="tertiary"
              >
                <IonIcon className="mr-2" icon={globeOutline} />
                Enter Coordinates
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader className="pt-0 pb-1">
            <IonCardTitle>Search City</IonCardTitle>
            <IonCardSubtitle>Method 3</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Search for a city by name and select it from the results.{" "}
            <div className="flex justify-end">
              <IonButton
                onClick={() => {
                  if (showLocationDetailsInput) return;
                  setShowLocationDetailsInput(true);
                  setCitySearchMode(true);
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
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetAddLocation;
