// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { salahTrackingEntryType } from "../types/types";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import CalenderYearly from "../components/Stats/CalenderYearly";
import StatCard from "../components/Stats/StatCard";
import StreakCount from "../components/Stats/StreakCount";

const StatsPage = ({
  // setHeading,
  pageStyles,
  startDate,
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  currentWeek,
}: {
  // setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
  startDate: Date;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
}) => {
  // setHeading("Overall Stats");
  return (
    <section className={`${pageStyles} settings-page-wrap`}>
      <StreakCount />
      <CalenderYearly
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        startDate={startDate}
        setCurrentWeek={setCurrentWeek}
        currentWeek={currentWeek}
      />{" "}
      <div className="grid grid-cols-2">
        <StatCard statName={"In jamaah"} />
        <StatCard statName={"On time"} />
        <StatCard statName={"Late"} />
        <StatCard statName={"Not Prayed"} />
      </div>
    </section>
  );
};

export default StatsPage;
