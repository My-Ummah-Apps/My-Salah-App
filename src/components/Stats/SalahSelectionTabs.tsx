import { SalahNamesType } from "../../types/types";

interface SalahSelectionTabsProps {
  setStatsToShow: React.Dispatch<React.SetStateAction<SalahNamesType | "All">>;
  statsToShow: SalahNamesType | "All";
}

const SalahSelectionTabs = ({
  setStatsToShow,
  statsToShow,
}: SalahSelectionTabsProps) => {
  return (
    <section className="flex justify-around">
      <button
        className="px-2 rounded-md"
        style={{
          backgroundColor: statsToShow === "All" ? "gray" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("All");
        }}
      >
        All
      </button>
      <button
        className="px-2 rounded-md"
        style={{
          backgroundColor: statsToShow === "Fajr" ? "gray" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Fajr");
        }}
      >
        Fajr
      </button>
      <button
        className="px-2 rounded-md"
        style={{
          backgroundColor: statsToShow === "Dhuhr" ? "gray" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Dhuhr");
        }}
      >
        Dhuhr
      </button>
      <button
        className="px-2 rounded-md"
        style={{
          backgroundColor: statsToShow === "Asar" ? "gray" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Asar");
        }}
      >
        Asar
      </button>
      <button
        className="px-2 rounded-md"
        style={{
          backgroundColor: statsToShow === "Maghrib" ? "gray" : "transparent",
        }}
        onClick={() => {
          setStatsToShow("Maghrib");
        }}
      >
        Maghrib
      </button>
      <button
        className="px-2 rounded-md"
        style={{
          backgroundColor: statsToShow === "Isha" ? "gray" : "transparent",
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
