// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { salahTrackingEntryType } from "../types/types";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import CalenderYearly from "../components/Stats/CalenderYearly";
import StatCard from "../components/Stats/StatCard";
import StreakCount from "../components/Stats/StreakCount";

const StatsPage = ({
  // setHeading,
  userStartDate,
  pageStyles,
  startDate,
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  currentWeek,
}: {
  // setHeading: React.Dispatch<React.SetStateAction<string>>;
  userStartDate: string;
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
  let jamaahStat = 0;
  let aloneStat = 0;
  let lateStat = 0;
  let missedStat = 0;

  let salahInJamaahDatesOverall: string[] = [];
  let salahAloneDatesOverall: string[] = [];
  let salahLateDatesOverall: string[] = [];
  let salahMissedDatesOverall: string[] = [];

  const salahFulfilledDates = salahTrackingArray.reduce<string[]>(
    (accumulatorArray, salah) => {
      for (let i = 0; i < salah.completedDates.length; i++) {
        accumulatorArray.push(Object.keys(salah.completedDates[i])[0]);
      }
      return accumulatorArray;
    },
    []
  );

  function getSalahStatusDates(status: string, array: string[]) {
    let statToUpdate = 0;
    salahTrackingArray.forEach((salah) => {
      for (let i = 0; i < salah.completedDates.length; i++) {
        if (Object.values(salah.completedDates[i])[0] === status) {
          array.push(Object.keys(salah.completedDates[i])[0]);
        }
      }
    });
    if (array.length > 0) {
      statToUpdate = Math.round(
        (array.length / (salahFulfilledDates.length + array.length)) * 100
      );
    }
    status === "group"
      ? (jamaahStat = statToUpdate)
      : status === "alone"
      ? (aloneStat = statToUpdate)
      : status === "late"
      ? (lateStat = statToUpdate)
      : status === "missed"
      ? (missedStat = statToUpdate)
      : null;
  }

  getSalahStatusDates("group", salahInJamaahDatesOverall);
  getSalahStatusDates("alone", salahAloneDatesOverall);
  getSalahStatusDates("late", salahLateDatesOverall);
  getSalahStatusDates("missed", salahMissedDatesOverall);

  return (
    <section className={`${pageStyles} settings-page-wrap`}>
      {/* <StreakCount styles={{}} /> */}
      <CalenderYearly
        userStartDate={userStartDate}
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        startDate={startDate}
        setCurrentWeek={setCurrentWeek}
        currentWeek={currentWeek}
      />{" "}
      <div className="grid grid-cols-2">
        <StatCard
          statName={"In jamaah"}
          stat={jamaahStat}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"On time"}
          stat={aloneStat}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Late"}
          stat={lateStat}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Missed"}
          stat={missedStat}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
      </div>
    </section>
  );
};

export default StatsPage;
