import { SalahNamesType } from "../../types/types";

interface SalahSelectionTabsProps {
  setStatsToShow: React.Dispatch<React.SetStateAction<SalahNamesType | "All">>;
  statsToShow: SalahNamesType | "All";
}

const buttonStyles = `px-3 py-[0.3rem] rounded-md h-full`;

const SalahSelectionTabs = ({
  setStatsToShow,
  statsToShow,
}: SalahSelectionTabsProps) => {
  return (
    <section className="sticky top-0 z-30 flex justify-around rounded-md bg-[#292929]">
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
