import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  LocationsDataObjTypeArr,
  SalahNamesType,
  userPreferencesType,
} from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  chevronDownOutline,
  notificationsOutline,
  settingsOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import {
  checkNotificationPermissions,
  getNextSalah,
  promptToOpenDeviceSettings,
  updateUserPrefs,
} from "../utils/constants";
import BottomSheetLocationsList from "../components/BottomSheets/SalahTimesSheets/BottomSheetLocationsList";
import BottomSheetAddLocation from "../components/BottomSheets/SalahTimesSheets/BottomSheetAddLocation";
import BottomSheetSalahNotifications from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahNotifications";
import { AndroidSettings } from "capacitor-native-settings";
import { LocalNotifications } from "@capacitor/local-notifications";

interface SalahTimesPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
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
  salahTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  // calculateActiveLocationSalahTimes: () => Promise<{
  //   nextSalah: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  //   // | "sunrise"
  //   // | "none";
  //   currentSalah: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  //   // | "sunrise"
  //   // | "none";
  //   hoursRemaining: number;
  //   minsRemaining: number;
  // }>;
}

const SalahTimesPage = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
  setSalahtimes,
  salahTimes,
}: // calculateActiveLocationSalahTimes,
SalahTimesPageProps) => {
  const [showAddLocationSheet, setShowAddLocationSheet] = useState(false);
  const [showSalahTimesSettingsSheet, setShowSalahTimesSettingsSheet] =
    useState(false);
  const [showLocationsListSheet, setShowLocationsListSheet] = useState(false);
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState<boolean>(false);
  const [showLocationAddedToast, setShowLocationAddedToast] =
    useState<boolean>(false);

  const [nextSalahNameAndTime, setNextSalahNameAndTime] = useState({
    currentSalah: "",
    nextSalah: "",
    nextSalahTime: 0,
    hoursRemaining: 0,
    minsRemaining: 0,
  });

  const [selectedSalah, setSelectedSalah] = useState<SalahNamesType>("fajr");
  const [showSalahNotificationsSheet, setShowSalahNotificationsSheet] =
    useState(false);

  useEffect(() => {
    const getNextSalahDetails = async () => {
      // const { currentSalah, nextSalah, hoursRemaining, minsRemaining } =
      //   await calculateActiveLocationSalahTimes();
      const {
        currentSalah,
        nextSalah,
        nextSalahTime,
        hoursRemaining,
        minsRemaining,
      } = await getNextSalah(dbConnection, userPreferences);
      setNextSalahNameAndTime({
        currentSalah: currentSalah,
        nextSalah: nextSalah,
        nextSalahTime: nextSalahTime,
        hoursRemaining: hoursRemaining,
        minsRemaining: minsRemaining,
      });
    };

    getNextSalahDetails();

    const interval = setInterval(() => {
      getNextSalahDetails();
    }, 60000);

    return () => clearInterval(interval);
  }, [userLocations]);

  const handleNotificationPermissions = async () => {
    const userNotificationPermission = await checkNotificationPermissions();

    if (userNotificationPermission === "denied") {
      await promptToOpenDeviceSettings(
        `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
        AndroidSettings.AppNotification
      );
      return "denied";
    } else if (userNotificationPermission === "granted") {
      return "granted";
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      const requestPermission = await LocalNotifications.requestPermissions();

      if (requestPermission.display === "granted") {
        return "granted";
      } else if (requestPermission.display === "denied") {
        return "denied";
      }
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => setShowSalahTimesSettingsSheet(true)}
              style={{
                "--padding-end": "12px",
                "--ripple-color": "transparent",
              }}
            >
              <IonIcon
                className="text-[var(--ion-text-color)] text-lg"
                icon={settingsOutline}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* bg-[color:var(--card-bg-color)]  */}
        {userPreferences.prayerCalculationMethod !== "" &&
          userLocations?.length !== 0 && (
            <section className="p-4 my-5 mx-2 rounded-lg bg-[color:var(--card-bg-color)] ">
              <p className="mb-1 text-lg text-center font-extralight">
                Current Salah
              </p>
              {nextSalahNameAndTime.currentSalah !== "sunrise" &&
                nextSalahNameAndTime.currentSalah !== "none" && (
                  <p className="mb-5 text-6xl font-bold text-center">
                    {nextSalahNameAndTime.currentSalah.charAt(0).toUpperCase() +
                      nextSalahNameAndTime.currentSalah.slice(1)}
                  </p>
                )}
              <p className="text-4xl text-center">
                {/* {format(nextSalahNameAndTime.nextSalahTime, "HH:mm")} */}
              </p>
              {nextSalahNameAndTime.hoursRemaining > 0 && (
                <p className="mt-2 font-light text-center">
                  {nextSalahNameAndTime.hoursRemaining} hours and{" "}
                </p>
              )}
              <p className="font-light text-center">
                {nextSalahNameAndTime.minsRemaining} minutes to go until
              </p>
              <p className="mt-2 mb-5 text-2xl font-bold text-center">
                {nextSalahNameAndTime.nextSalah.charAt(0).toUpperCase() +
                  nextSalahNameAndTime.nextSalah.slice(1)}
              </p>
            </section>
          )}
        {userLocations?.length === 0 ? (
          <>
            <section
              className="text-center"
              // className="flex flex-col items-center justify-center h-full text-center"
            >
              <h4>Salah Times Not Set</h4>
              <IonButton
                onClick={() => {
                  setShowAddLocationSheet(true);
                }}
                className="w-1/2"
              >
                Add Location
              </IonButton>
              <BottomSheetAddLocation
                setShowAddLocationSheet={setShowAddLocationSheet}
                showAddLocationSheet={showAddLocationSheet}
                setShowSalahTimesSettingsSheet={setShowSalahTimesSettingsSheet}
                dbConnection={dbConnection}
                setUserLocations={setUserLocations}
                userLocations={userLocations}
                setShowLocationFailureToast={setShowLocationFailureToast}
                setShowLocationAddedToast={setShowLocationAddedToast}
                // setUserPreferences={setUserPreferences}
              />
            </section>
          </>
        ) : (
          <section className="mx-5">
            <section className="flex items-center justify-center">
              {userLocations?.map((location) => (
                <section key={location.id}>
                  <p>
                    {location.isSelected === 1 ? location.locationName : ""}
                  </p>
                </section>
              ))}{" "}
              <IonButton
                onClick={async () => {
                  setShowLocationsListSheet(true);
                }}
                style={{
                  "--padding-start": "3px",
                  "--padding-end": "0",
                  "--padding-top": "0",
                  "--padding-bottom": "0",
                }}
                className={`text-[var(--ion-text-color)] p-0`}
                aria-label="show all locations"
                fill="clear"
                size="small"
              >
                {" "}
                <IonIcon
                  icon={chevronDownOutline}
                  aria-hidden="false"
                  data-testid="locations-chevron"
                />
              </IonButton>
            </section>
          </section>
        )}

        <section
          className={`mx-2 rounded-lg   ${
            userLocations?.length === 0 ||
            userPreferences.prayerCalculationMethod === ""
              ? "opacity-50"
              : "opacity-100"
          }`}
        >
          {/* <IonList inset={true}> */}

          {Object.entries(salahTimes).map(([name, time]) => (
            <div
              // && name !== "sunrise"
              className={`bg-[color:var(--card-bg-color)] flex items-center justify-between py-1 text-sm border-[var(--app-border-color)] rounded-lg ${
                name === nextSalahNameAndTime.currentSalah
                  ? "my-2 rounded-lg shadow-md scale-102"
                  : ""
              }`}
              key={name + time}
            >
              <p className="ml-2">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </p>
              <div className="flex items-center">
                <p>{time === "Invalid Date" ? "--:--" : time}</p>
                <IonButton
                  className={name === "sunrise" ? "opacity-0" : "opacity-100"}
                  onClick={async () => {
                    if (name === "sunrise") return;

                    if (
                      userPreferences.prayerCalculationMethod === null ||
                      userPreferences.prayerCalculationMethod === "" ||
                      userLocations?.length === 0
                    ) {
                      return;
                    }

                    const notificationPermission =
                      await handleNotificationPermissions();

                    if (notificationPermission === "granted") {
                      setSelectedSalah(name);
                      setShowSalahNotificationsSheet(true);
                    }
                  }}
                  fill="clear"
                  size="small"
                >
                  <IonIcon
                    className="text-[var(--ion-text-color)]"
                    icon={notificationsOutline}
                  />
                </IonButton>
              </div>
            </div>
          ))}
          {/* </IonList> */}
        </section>
        {userPreferences.prayerCalculationMethod !== "" &&
          userLocations?.length !== 0 && (
            <p className="mx-10 my-5 text-xs text-center">
              {`Note: These times have been calculated using the
            ${userPreferences.prayerCalculationMethod} method and may differ from
            your local Mosque times`}
            </p>
          )}
      </IonContent>
      <BottomSheetLocationsList
        setShowLocationsListSheet={setShowLocationsListSheet}
        showLocationsListSheet={showLocationsListSheet}
        dbConnection={dbConnection}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
        setShowAddLocationSheet={setShowAddLocationSheet}
        showAddLocationSheet={showAddLocationSheet}
        setShowLocationFailureToast={setShowLocationFailureToast}
        setShowLocationAddedToast={setShowLocationAddedToast}
        setSalahtimes={setSalahtimes}
        userPreferences={userPreferences}
        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
      />
      <BottomSheetSalahTimesSettings
        setShowSalahTimesSettingsSheet={setShowSalahTimesSettingsSheet}
        showSalahTimesSettingsSheet={showSalahTimesSettingsSheet}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
      />
      <BottomSheetSalahNotifications
        setShowSalahNotificationsSheet={setShowSalahNotificationsSheet}
        showSalahNotificationsSheet={showSalahNotificationsSheet}
        dbConnection={dbConnection}
        selectedSalah={selectedSalah}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
      />
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
    </IonPage>
  );
};

export default SalahTimesPage;
