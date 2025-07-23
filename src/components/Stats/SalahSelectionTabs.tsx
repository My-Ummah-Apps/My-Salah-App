// import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import { SalahNamesType } from "../../types/types";

interface SalahSelectionTabsProps {
  setStatsToShow: React.Dispatch<React.SetStateAction<SalahNamesType | "All">>;
  statsToShow: SalahNamesType | "All";
}

const buttonStyles = `px-2 py-[0.3rem] rounded-md h-full`;

const SalahSelectionTabs = ({
  setStatsToShow,
  statsToShow,
}: SalahSelectionTabsProps) => {
  return (
    <section className="sticky top-[-1px] z-30 flex justify-around rounded-md bg-[#292929]">
      <button
        className={buttonStyles}
        style={{
          backgroundColor:
            statsToShow === "All" ? "rgb(87, 87, 87)" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("All");
        }}
      >
        All
      </button>
      <button
        className={buttonStyles}
        style={{
          backgroundColor:
            statsToShow === "Fajr" ? "rgb(87, 87, 87)" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Fajr");
        }}
      >
        Fajr
      </button>
      <button
        className={buttonStyles}
        style={{
          backgroundColor:
            statsToShow === "Dhuhr" ? "rgb(87, 87, 87)" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Dhuhr");
        }}
      >
        Dhuhr
      </button>
      <button
        className={buttonStyles}
        style={{
          backgroundColor:
            statsToShow === "Asar" ? "rgb(87, 87, 87)" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Asar");
        }}
      >
        Asar
      </button>
      <button
        className={buttonStyles}
        style={{
          backgroundColor:
            statsToShow === "Maghrib" ? "rgb(87, 87, 87)" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Maghrib");
        }}
      >
        Maghrib
      </button>
      <button
        className={buttonStyles}
        style={{
          backgroundColor:
            statsToShow === "Isha" ? "rgb(87, 87, 87)" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Isha");
        }}
      >
        Isha
      </button>
    </section>
  );
};

export default SalahSelectionTabs;

// <>
//     <IonSegment className="bg-stone-800" mode="ios" value="default">
//       <IonSegmentButton mode="ios" value="default">
//         <IonLabel>All</IonLabel>
//       </IonSegmentButton>
//       <IonSegmentButton mode="ios" value="segment">
//         <IonLabel>Fajr</IonLabel>
//       </IonSegmentButton>
//       <IonSegmentButton mode="ios" value="segment">
//         <IonLabel>Dhuhr</IonLabel>
//       </IonSegmentButton>
//       <IonSegmentButton mode="ios" value="segment">
//         <IonLabel>Asar</IonLabel>
//       </IonSegmentButton>
//       <IonSegmentButton mode="ios" value="segment">
//         <IonLabel>Maghrib</IonLabel>
//       </IonSegmentButton>
//       <IonSegmentButton mode="ios" value="segment">
//         <IonLabel>Isha</IonLabel>
//       </IonSegmentButton>
//     </IonSegment>
//   </>
