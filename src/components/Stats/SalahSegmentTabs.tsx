import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import { SalahNamesType } from "../../types/types";

interface SalahSegmentTabsProps {
  setStatsToShow: React.Dispatch<React.SetStateAction<SalahNamesType | "All">>;
  statsToShow: SalahNamesType | "All";
}

const SalahSegmentTabs = ({
  setStatsToShow,
  statsToShow,
}: SalahSegmentTabsProps) => {
  return (
    <IonSegment
      mode="ios"
      value={statsToShow}
      onIonChange={(e) => {
        setStatsToShow(e.detail.value as SalahNamesType | "All");
      }}
    >
      <IonSegmentButton value="All">
        <IonLabel>All</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="Fajr">
        <IonLabel>Fajr</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="Dhuhr">
        <IonLabel>Dhuhr</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="Asar">
        <IonLabel>Asr</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="Maghrib">
        <IonLabel>Maghrib</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="Isha">
        <IonLabel>Isha</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default SalahSegmentTabs;
