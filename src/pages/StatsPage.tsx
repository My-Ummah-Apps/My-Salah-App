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
  const salahFulfilledDates = salahTrackingArray.reduce<string[]>(
    (accumulatorArray, salah) => {
      for (let i = 0; i < salah.completedDates.length; i++) {
        accumulatorArray.push(Object.keys(salah.completedDates[i])[0]);
      }
      return accumulatorArray;
    },
    []
  );
  let salahInJamaahDatesOverall: string[] = [];
  salahTrackingArray.forEach((salah) => {
    for (let i = 0; i < salah.completedDates.length; i++) {
      if (Object.values(salah.completedDates[i])[0] === "group") {
        salahInJamaahDatesOverall.push(Object.keys(salah.completedDates[i])[0]);
      }
    }
  });
  let jamaahStat = 0;
  if (salahInJamaahDatesOverall.length > 0) {
    jamaahStat = Math.round(
      (salahInJamaahDatesOverall.length /
        (salahFulfilledDates.length + salahInJamaahDatesOverall.length)) *
        100
    );
  }

  console.log(salahInJamaahDatesOverall);
  console.log(salahFulfilledDates);

  return (
    <section className={`${pageStyles} settings-page-wrap`}>
      <StreakCount styles={{}} />
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
          stat={1}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Late"}
          stat={1}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Not Prayed"}
          stat={1}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
      </div>
    </section>
  );
};

export default StatsPage;
