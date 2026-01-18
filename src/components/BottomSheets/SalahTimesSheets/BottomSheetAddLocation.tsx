import {
  IonButton,
  IonCheckbox,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { AnimatePresence, motion } from "framer-motion";
import { Geolocation } from "@capacitor/geolocation";

import { AndroidSettings } from "capacitor-native-settings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";

import { locate, locationOutline, searchOutline } from "ionicons/icons";

import cities from "../../../assets/city_list.json";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  promptToOpenDeviceSettings,
} from "../../../utils/constants";
import { LocationsDataObjTypeArr } from "../../../types/types";
import { fetchAllLocations, toggleDBConnection } from "../../../utils/dbUtils";

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
    React.SetStateAction<LocationsDataObjTypeArr>
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
  const [isGpsBtnClicked, setIsGpsBtnClicked] = useState(false);
  const [
    isDefaultLocationCheckBoxChecked,
    setIsDefaultLocationCheckBoxChecked,
  ] = useState(false);

  const addUserLocation = async (
    dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>,
    locationName: string,
    latitude: number,
    longitude: number,
    isSelected: number
  ) => {
    const stmnt = `INSERT INTO userLocationsTable (locationName, latitude, longitude, isSelected) 
        VALUES (?, ?, ?, ?);
        `;

    if (!dbConnection || !dbConnection.current) {
      throw new Error("dbConnection / dbconnection.current does not exist");
    }

    console.log(
      "isDefaultLocationCheckBoxChecked: ",
      isDefaultLocationCheckBoxChecked,
      "isSelected: ",
      isSelected
    );

    if (isDefaultLocationCheckBoxChecked && isSelected === 1) {
      await dbConnection.current.run(
        `UPDATE userLocationsTable SET isSelected = 0`
      );
    }

    const params = [locationName, latitude, longitude, isSelected];
    const lastId = await dbConnection.current.run(stmnt, params);
    return lastId;
  };

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
    setIsGpsBtnClicked(false);
    setIsDefaultLocationCheckBoxChecked(false);
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
        `Location permission off`,
        "You currently have location turned off for this application, you can open Settings to re-enable it",
        AndroidSettings.Location
      );

      return;
    }
  };

  return (
    <IonModal
      className="modal-fit-content"
      // style={{ "--height": "80vh" }}
      mode="ios"
      isOpen={showAddLocationSheet}
      // trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
      // className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // expandToScroll={false}
      onDidDismiss={() => {
        setShowAddLocationSheet(false);
        handleInputPromptDismissed();
      }}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
          }}
        >
          <IonTitle>Add Location</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AnimatePresence>
        {showLocationDetailsInput && (
          <motion.section
            initial={{ x: "50%", opacity: 0 }}
            animate={{ x: "-50%", opacity: 1 }}
            exit={{ x: "50%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1/4 left-1/2 w-4/5 max-w-[300px] z-10 rounded-lg
             flex flex-col items-center justify-center -translate-y-1/2 bg-[var(--card-bg-color)]"
          >
            <div className="pt-3 text-center">
              {isGpsBtnClicked && <p className="text-xs">Name this location</p>}
              <IonInput
                className="w-full min-w-0 px-2 py-2 mt-2 rounded-lg"
                aria-label="Location name"
                type="text"
                placeholder={
                  isGpsBtnClicked
                    ? "e.g. Home, Work, London"
                    : "Enter Location Name"
                }
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
            {userLocations && userLocations.length > 0 && (
              <IonCheckbox
                className="mb-4 text-xs"
                labelPlacement="end"
                checked={isDefaultLocationCheckBoxChecked}
                onIonChange={(e) =>
                  setIsDefaultLocationCheckBoxChecked(e.detail.checked)
                }
              >
                Make this the default location
              </IonCheckbox>
            )}
            <div className="flex justify-center w-full gap-4">
              <IonButton
                className="p-0 text-base text-[var(--ion-text-color)]"
                size="small"
                color="dark"
                fill="solid"
                onClick={() => {
                  handleInputPromptDismissed();
                }}
              >
                Cancel
              </IonButton>
              <IonButton
                className="text-base text-[var(--ion-text-color)]"
                size="small"
                // fill="clear"
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
                    try {
                      const isSelected =
                        userLocations.length === 0 ||
                        isDefaultLocationCheckBoxChecked
                          ? 1
                          : 0;
                      // const isSelected = userLocations.length === 0 ? 1 : 0;

                      await toggleDBConnection(dbConnection, "open");

                      const result = await addUserLocation(
                        dbConnection,
                        locationName,
                        latitude,
                        longitude,
                        isSelected
                      );

                      if (!result?.changes?.lastId) {
                        throw new Error(
                          "Failed to insert location: no ID returned"
                        );
                      }

                      const { allLocations } = await fetchAllLocations(
                        dbConnection
                      );
                      console.log(
                        "FETCH ALL LOCATIONS CALLE FROM ADD LOCATION SHEET: ",
                        allLocations
                      );

                      if (allLocations) {
                        if (allLocations.length === 1) {
                          setShowSalahTimesSettingsSheet?.(true);
                        }
                        setShowAddLocationSheet(false);
                        setUserLocations(allLocations);
                        setShowLocationAddedToast(true);
                        // setUserLocations([
                        //   ...userLocations,
                        //   {
                        //     id: result.changes.lastId,
                        //     locationName: locationName,
                        //     latitude: latitude,
                        //     longitude: longitude,
                        //     isSelected: userLocations.length === 0 ? 1 : 0,
                        //   },
                        // ]);
                        setUserLocations(allLocations);
                      } else {
                        console.error("Locations undefined");
                      }

                      handleInputPromptDismissed();
                    } catch (error) {
                    } finally {
                      await toggleDBConnection(dbConnection, "close");
                    }
                  } else {
                    console.error("lat / long undefined");
                    return;
                  }
                }}
              >
                Save
              </IonButton>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.section
        animate={{ opacity: showLocationDetailsInput ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        // className={`${showLocationDetailsInput ? "opacity-0" : "opacity-100"}`}
      >
        <div className="px-2 mx-5 mb-4 text-sm text-center">
          <p>
            To calculate Salah times, the app requires your location, you can
            use one of the three methods below. <br></br>
            <br></br>For the most accurate results, the first two options are
            recommended. The third method (City search) is less precise and may
            provide less accurate Salah times.
          </p>
        </div>
        <section className="mx-4">
          <div
            className="border-transparent p-2 mb-5 items-center rounded-lg flex bg-[var(--sheet-option-bg)]"
            onClick={async () => {
              if (showLocationDetailsInput) return;
              setIsGpsBtnClicked(true);
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
            <div className="mr-2">
              <IonIcon className="text-lg" icon={locationOutline} />{" "}
            </div>
            <div>
              <p className="mt-0">Use Device GPS</p>
              <p className="text-xs font-light">
                Determine Location Automatically
              </p>
            </div>
          </div>

          <div
            className="border-transparent p-2 mb-5 items-center rounded-lg flex bg-[var(--sheet-option-bg)]"
            onClick={() => {
              if (showLocationDetailsInput) return;
              setUseManualCoordinates(true);
              setShowLocationDetailsInput(true);
            }}
          >
            <div className="mr-2">
              <IonIcon className="text-lg" icon={locate} />{" "}
            </div>
            <div>
              <p className="mt-0">Enter Coordinates</p>
              <p className="text-xs font-light">
                {" "}
                Manually enter a latitude and longitude if you already know the
                exact location
              </p>
            </div>
          </div>
          <div
            className="border-transparent p-2 mb-5 items-center rounded-lg flex bg-[var(--sheet-option-bg)]"
            onClick={() => {
              if (showLocationDetailsInput) return;
              setShowLocationDetailsInput(true);
              setCitySearchMode(true);
            }}
          >
            <div className="mr-2">
              <IonIcon className="text-lg" icon={searchOutline} />{" "}
            </div>
            <div>
              <p className="mt-0">Search Manually</p>
              <p className="text-xs font-light">
                {" "}
                Search for a city by name and select it from the results
              </p>
            </div>
          </div>
        </section>
      </motion.section>
    </IonModal>
  );
};

export default BottomSheetAddLocation;
