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

  const handleLocationPermissions = async () => {
    const device = Capacitor.getPlatform();
    // ! This if statement is only here for manual testing purposes in the browser, can be removed later
    if (Capacitor.getPlatform() === "web") {
      try {
        const location = await Geolocation.getCurrentPosition();
        const latitude = location.coords.latitude.toString();
        const longitude = location.coords.longitude.toString();
        console.log(latitude, longitude);

        dismissLocationSpinner();
        setShowLocationNameInput(true);
      } catch (error) {
        setShowLocationFailureToast(true);
        console.error(error);
      } finally {
        await dismissLocationSpinner();
      }
      // await updateUserPrefs(dbConnection, "latitude", "", setUserPreferences);
      // await updateUserPrefs(dbConnection, "longitude", "", setUserPreferences);
      // await updateUserPrefs(
      //   dbConnection,
      //   "latitude",
      //   latitude,
      //   setUserPreferences
      // );
      // await updateUserPrefs(
      //   dbConnection,
      //   "longitude",
      //   longitude,
      //   setUserPreferences
      // );
      return;
    }

    if (device === "ios" || device === "android") {
      const { location } = await Geolocation.checkPermissions();

      if (location === "granted") {
        try {
          // const position = await Geolocation.getCurrentPosition();
          // const latitude = position.coords.latitude.toString();
          // const longitude = position.coords.longitude.toString();
        } catch (error) {
          await dismissLocationSpinner();
          console.error(error);
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
      } else if (
        location === "prompt" ||
        location === "prompt-with-rationale"
      ) {
        try {
          const locationPermissions = await Geolocation.requestPermissions();
          // console.log(permissionStatus);

          if (locationPermissions.location === "granted") {
            // const location = await Geolocation.getCurrentPosition();
            // Update state and DB here
          }
        } catch (error) {
          console.error(error);
        }
        // console.log(await Geolocation.requestPermissions());

        // // const { location } = await Geolocation.requestPermissions();
      } else if (location === "denied") {
        console.log("SYSTEM LOCATION PERMISSIONS DENIED");

        await promptToOpenDeviceSettings(
          "You currently have location turned off for this application, you can open Settings to re-enable it",
          AndroidSettings.Location
        );
      }
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
