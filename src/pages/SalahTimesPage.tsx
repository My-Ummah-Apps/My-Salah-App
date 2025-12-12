import {
  IonButton,
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
  alarmOutline,
  chevronDownOutline,
  pencilOutline,
} from "ionicons/icons";
import { FaChevronDown } from "react-icons/fa6";
import BottomSheetLocationsList from "../components/BottomSheets/BottomSheetLocationsList";
import BottomSheetAddLocation from "../components/BottomSheets/BottomSheetAddLocation";
import { useState } from "react";

interface SalahTimesPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
}

const SalahTimesPage = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
}: SalahTimesPageProps) => {
  const salahNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const [showAddLocationSheet, setShowAddLocationSheet] = useState(false);
  const [showSalahTimesSettingsSheet, setShowSalahTimesSettingsSheet] =
    useState(false);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {userLocations?.length === 0 ? (
          <>
            <IonList>
              {salahNames.map((salahName, i) => (
                <IonItem key={salahName + i}>
                  <IonLabel>{salahName}</IonLabel>
                  <div className="flex items-center" slot="end">
                    <p>--:--</p>
                    <IonButton slot="end" fill="clear">
                      <IonIcon icon={alarmOutline} />
                    </IonButton>
                  </div>
                </IonItem>
              ))}
            </IonList>
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
                // setUserPreferences={setUserPreferences}
              />
            </section>
          </>
        ) : (
          <section>
            <div>
              {userLocations?.map((location) => (
                <section key={location.id} className="flex">
                  <p>
                    {location.isSelected === 1 ? location.locationName : ""}
                  </p>
                </section>
              ))}{" "}
              <IonButton id="open-locations-sheet">
                {" "}
                <IonIcon
                  icon={chevronDownOutline}
                  aria-label="Show all locations"
                  data-testid="locations-chevron"
                />
                {/* <FaChevronDown
                      aria-label="Show all locations"
                      data-testid="locations-chevron"
                    /> */}
              </IonButton>
            </div>
          </section>
        )}
      </IonContent>
      <BottomSheetLocationsList
        triggerId={"open-locations-sheet"}
        dbConnection={dbConnection}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
      />
      <BottomSheetSalahTimesSettings
        setShowSalahTimesSettingsSheet={setShowSalahTimesSettingsSheet}
        showSalahTimesSettingsSheet={showSalahTimesSettingsSheet}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
      />
    </IonPage>
  );
};

export default SalahTimesPage;
