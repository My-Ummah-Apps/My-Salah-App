import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { LocationsDataObjTypeArr, userPreferencesType } from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface SalahTimesPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
}

const SalahTimesPage = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
}: SalahTimesPageProps) => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {userPreferences.locationName === "" && (
          <section className="flex flex-col items-center justify-center h-full text-center">
            <h1>Salah Times Not Set</h1>
            <IonButton id="open-salah-times-settings-sheet" className="w-1/2">
              Set up Salah Times
            </IonButton>
          </section>
        )}
      </IonContent>
      <BottomSheetSalahTimesSettings
        triggerId={"open-salah-times-settings-sheet"}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        setUserLocations={setUserLocations}
      />
    </IonPage>
  );
};

export default SalahTimesPage;
