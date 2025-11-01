import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";

interface LocationSettingsPageProps {
  nav: HTMLIonNavElement;
}

const LocationSettingsPage = ({ nav }: LocationSettingsPageProps) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => nav.pop()}>Back</IonButton>
          </IonButtons>
          <IonTitle>Location</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="flex justify-center gap-2">
          <IonButton
            onClick={async () => {
              const location = await Geolocation.getCurrentPosition();
              console.log(location.coords.latitude);
              console.log(location.coords.longitude);
              alert(location.coords.latitude + location.coords.longitude);
            }}
          >
            Auto-Detect
          </IonButton>
          <IonButton>Select Manually</IonButton>
        </section>
      </IonContent>
    </>
  );
};

export default LocationSettingsPage;
