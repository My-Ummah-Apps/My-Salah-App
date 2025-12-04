import {
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
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import { addUserLocation, fetchAllLocations } from "../../utils/dbUtils";
import { LocationsDataObjTypeArr } from "../../types/types";

interface BottomSheetLocationSettingsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
}

const BottomSheetLocationSettings = ({
  triggerId,
  dbConnection,
  setUserLocations,
  userLocations,
}: BottomSheetLocationSettingsProps) => {
  const [presentLocationSpinner, dismissLocationSpinner] = useIonLoading();
  const [showLocationNameInput, setShowLocationNameInput] =
    useState<boolean>(false);
  const [locationName, setLocationName] = useState("");
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState<boolean>(false);
  const [showLocationAddedToast, setShowLocationAddedToast] =
    useState<boolean>(false);
  const [showEmptyLocationError, setShowEmptyLocationError] =
    useState<boolean>(false);
  const [showDuplicateLocationError, setShowDuplicateLocationError] =
    useState<boolean>(false);

  let latitude = useRef<number>();
  let longitude = useRef<number>();

  const resetLocationInput = () => {
    setShowLocationNameInput(false);
    setLocationName("");
    setShowEmptyLocationError(false);
    setShowDuplicateLocationError(false);
  };

  const handleGrantedPermission = async () => {
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

  useEffect(() => {
    console.log("showDuplicateLocationError: ", showDuplicateLocationError);
  }, [showDuplicateLocationError]);

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
        {showLocationNameInput && (
          <section className="flex flex-col items-center justify-center w-4/5 absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[color:var(--card-bg-color)] rounded-lg max-w-[300px]">
            <div className="px-5 text-center">
              <h5>Enter location name</h5>
              <input
                className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                aria-label="Location name"
                type="text"
                placeholder="e.g. Home"
                onChange={(e) => setLocationName(e.target.value)}
              ></input>
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
            </div>
            <div className="flex justify-end w-full">
              <IonButton
                className="p-0 text-base text-white"
                size="small"
                fill="clear"
                onClick={() => {
                  resetLocationInput();
                }}
              >
                Cancel
              </IonButton>
              <IonButton
                className="text-base text-white"
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

                  if (latitude.current && longitude.current) {
                    // ! Replace below, grab locations from DB and then compare against what the DB returns as opposed to state
                    const isSelected = userLocations.length === 0 ? 1 : 0;
                    await addUserLocation(
                      dbConnection,
                      locationName,
                      latitude.current,
                      longitude.current,
                      isSelected
                    );

                    const locations = await fetchAllLocations(dbConnection);
                    console.log("Locations: ", locations);

                    if (locations) {
                      setUserLocations(locations);
                      setShowLocationAddedToast(true);
                    }

                    console.log("RESETTING INPUT");

                    resetLocationInput();
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
        <section className="p-2 mx-5 mb-5 text-center">
          <p>
            To calculate Salah times, the app requires your location, you can
            use one of the three methods below.
          </p>
        </section>
        <section className="p-2 mx-5 my-5 text-center border rounded-lg">
          <h2 className="text-lg">Method 1</h2>
          {/* <p>Use Device GPS</p> */}
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
            Use Device GPS
          </IonButton>
        </section>
        <section className="p-2 mx-5 my-5 text-center border rounded-lg">
          <h2 className="text-lg">Method 2</h2>
          <IonButton expand="block">Enter Location Manually</IonButton>
          {/* <IonInput
            aria-label="location"
            placeholder="location"
            className="bg-[var(--textarea-bg-color)] rounded-lg text-[var(--ion-text-color)] my-2"
          ></IonInput> */}
        </section>
        <section className="p-2 mx-5 my-5 text-center border rounded-lg">
          <h2 className="text-lg">Method 3</h2>
          <IonButton expand="block">Enter Coordinates</IonButton>
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
        </section>
        <Toast
          isOpen={showLocationFailureToast}
          message="Unable to retrieve location, please try again"
          setShow={setShowLocationFailureToast}
          testId={"location-fail-toast"}
        />
        <Toast
          isOpen={showLocationAddedToast}
          message="Location added successfully"
          setShow={setShowLocationAddedToast}
          testId={"location-successfully-added-toast"}
        />
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetLocationSettings;
