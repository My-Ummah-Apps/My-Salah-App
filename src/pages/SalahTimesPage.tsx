import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { userPreferencesType } from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/BottomSheetSalahTimesSettings";

interface SalahTimesPageProps {
  userPreferences: userPreferencesType;
}

const SalahTimesPage = ({ userPreferences }: SalahTimesPageProps) => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {userPreferences.location === "" && (
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
      />
    </IonPage>
  );
};

export default SalahTimesPage;
