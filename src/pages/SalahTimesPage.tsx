import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { LocationsDataObjTypeArr, userPreferencesType } from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { chevronDownOutline } from "ionicons/icons";
import { FaChevronDown } from "react-icons/fa6";

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
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {userLocations?.length === 0 ? (
          <section className="flex flex-col items-center justify-center h-full text-center">
            <h1>Salah Times Not Set</h1>
            <IonButton id="open-salah-times-settings-sheet" className="w-1/2">
              Set up Salah Times
            </IonButton>
          </section>
        ) : (
          <section>
            <div>
              {userLocations?.map((location, index) => (
                <section key={index} className="flex">
                  <p>
                    {location.isSelected === 1 ? location.locationName : ""}
                  </p>
                </section>
              ))}{" "}
              <p>
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
              </p>
            </div>
          </section>
        )}
      </IonContent>
      <BottomSheetSalahTimesSettings
        triggerId={"open-salah-times-settings-sheet"}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
      />
    </IonPage>
  );
};

export default SalahTimesPage;
