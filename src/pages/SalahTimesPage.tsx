import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { LocationsDataObjTypeArr, userPreferencesType } from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  chevronDownOutline,
  notificationsOutline,
  settingsOutline,
} from "ionicons/icons";

import BottomSheetLocationsList from "../components/BottomSheets/BottomSheetLocationsList";
import BottomSheetAddLocation from "../components/BottomSheets/BottomSheetAddLocation";
import { useState } from "react";
import Toast from "../components/Toast";

interface SalahTimesPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
  salahTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  calculateActiveLocationSalahTimes: () => Promise<void>;
}

const SalahTimesPage = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
  salahTimes,
  calculateActiveLocationSalahTimes,
}: SalahTimesPageProps) => {
  const salahNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const [showAddLocationSheet, setShowAddLocationSheet] = useState(false);
  const [showSalahTimesSettingsSheet, setShowSalahTimesSettingsSheet] =
    useState(false);
  const [showLocationsListSheet, setShowLocationsListSheet] = useState(false);
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState<boolean>(false);
  const [showLocationAddedToast, setShowLocationAddedToast] =
    useState<boolean>(false);

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
        <section className="flex">
          <IonCard color="primary">
            <IonCardHeader>
              <IonCardTitle>Card Title</IonCardTitle>
              <IonCardSubtitle>Current Salah</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>Time Remaining:</IonCardContent>
          </IonCard>
          <IonCard color="primary">
            <IonCardHeader>
              <IonCardTitle>Card Title</IonCardTitle>
              <IonCardSubtitle>Next Salah</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>Time Remaining:</IonCardContent>
          </IonCard>
        </section>
        <section className="">
          <IonList inset={true}>
            {Object.entries(salahTimes).map(([name, time]) => (
              <IonItem key={name + time}>
                <IonLabel>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </IonLabel>
                <div className="flex items-center" slot="end">
                  <p>{time === "Invalid Date" ? "--:--" : time}</p>
                  <IonButton slot="end" fill="clear">
                    <IonIcon
                      className="text-[var(--ion-text-color)] text-lg"
                      icon={notificationsOutline}
                    />
                  </IonButton>
                </div>
              </IonItem>
            ))}
          </IonList>
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
            <section className="flex items-center justify-center text-lg">
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
                className={`text-[var(--ion-text-color)] px-0`}
                aria-label="show all locations"
                fill="clear"
                // size="small"
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
        calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
      />
      <BottomSheetSalahTimesSettings
        setShowSalahTimesSettingsSheet={setShowSalahTimesSettingsSheet}
        showSalahTimesSettingsSheet={showSalahTimesSettingsSheet}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
        calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
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
