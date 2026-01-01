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
import { LocationsDataObjTypeArr, userPreferencesType } from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  chevronDownOutline,
  notificationsOutline,
  settingsOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { getNextSalah } from "../utils/constants";
import BottomSheetLocationsList from "../components/BottomSheets/SalahTimesSheets/BottomSheetLocationsList";
import BottomSheetAddLocation from "../components/BottomSheets/SalahTimesSheets/BottomSheetAddLocation";

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
    hoursRemaining: 0,
    minsRemaining: 0,
  });

  useEffect(() => {
    const getNextSalahDetails = async () => {
      // const { currentSalah, nextSalah, hoursRemaining, minsRemaining } =
      //   await calculateActiveLocationSalahTimes();
      const { currentSalah, nextSalah, hoursRemaining, minsRemaining } =
        await getNextSalah(dbConnection, userPreferences);
      setNextSalahNameAndTime({
        currentSalah: currentSalah,
        nextSalah: nextSalah,
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
        <section className="p-4 m-5 rounded-2xl">
          <div>
            <p className="mb-1 text-lg text-center ">Upcoming Salah</p>
            <p className="mb-1 text-6xl font-bold text-center">
              {nextSalahNameAndTime.nextSalah.charAt(0).toUpperCase() +
                nextSalahNameAndTime.nextSalah.slice(1)}
            </p>
            {nextSalahNameAndTime.hoursRemaining > 0 && (
              <p className="mt-4 font-light text-center">
                {nextSalahNameAndTime.hoursRemaining} hours and{" "}
              </p>
            )}
            <p className="font-light text-center">
              {nextSalahNameAndTime.minsRemaining} minutes to go
            </p>
          </div>
          {/* <div className="h-full border-l-2 border-gray-300 border-solid">
            <p className="ml-4">Current Salah</p>
            <p className="ml-4">{nextSalahNameAndTime.currentSalah}</p>
          </div> */}
        </section>
        {userLocations?.length === 0 ? (
          <>
            <section
              className="text-center"
              // className="flex flex-col items-center justify-center h-full text-center"
            >
              <h4>Salah Times Not Set</h4>
              <IonButton
                size="small"
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
                onClick={() => {
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
        <section className="mx-2">
          {/* <IonList inset={true}> */}

          {Object.entries(salahTimes).map(([name, time]) => (
            <div
              className="flex items-center justify-between py-2 my-4 text-sm border rounded-lg border-stone-600"
              key={name + time}
            >
              <p className="ml-2">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </p>
              <div className="flex items-center">
                <p>{time === "Invalid Date" ? "--:--" : time}</p>
                <IonButton fill="clear" size="small">
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
        setUserLocations={setUserLocations}
        userLocations={userLocations}
        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
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
