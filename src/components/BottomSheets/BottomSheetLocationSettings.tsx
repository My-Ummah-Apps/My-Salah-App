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
import { userPreferencesType } from "../../types/types";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import Toast from "../Toast";

// import { Capacitor } from "@capacitor/core";

interface BottomSheetLocationSettingsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
}

const BottomSheetLocationSettings = ({
  triggerId,
}: BottomSheetLocationSettingsProps) => {
  const [presentLocationSpinner, dismissLocationSpinner] = useIonLoading();
  const [showLocationNameInput, setShowLocationNameInput] =
    useState<boolean>(false);
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState(false);

  const handleGrantedPermission = async () => {
    console.log("PERMISSION GRANTED");

    try {
      // throw new Error("ERROR THROWN");
      const location = await Geolocation.getCurrentPosition();
      // const latitude = location.coords.latitude.toString();
      // const longitude = location.coords.longitude.toString();
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
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
          onDidDismiss={() => {
            setShowLocationNameInput(false);
          }}
          header="Location"
          message="Please enter a location name"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                console.log("Alert canceled");
              },
            },
            {
              text: "Save",
              role: "confirm",
              handler: () => {
                console.log("Alert confirmed");
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
