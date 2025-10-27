import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface SalahTimesPageProps {
  //   dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
}

const SalahTimesPage = ({}: SalahTimesPageProps) => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default SalahTimesPage;
