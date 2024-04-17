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

  const inJamaahBoxColor = "var(--jamaah-status-color)";
  const onTimeMaleBoxColor = "var(--alone-male-status-color)";
  const lateBoxColor = "var(--late-status-color)";
  const missedBoxColor = "var(--missed-status-color)";
  //
  const inJamaahBoxStyling = {
    borderTopRightRadius: "0rem",
    borderTopLeftRadius: "2rem",
    borderBottomLeftRadius: "1.4rem",
    borderBottomRightRadius: "1.4rem",
    bgColor: "var(--jamaah-status-color)",
  };
  const onTimeBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "1.4rem",
    borderBottomLeftRadius: "1.4rem",
    borderBottomRightRadius: "0rem",
    bgColor: "var(--alone-male-status-color)",
  };
  const lateBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "0rem",
    borderBottomLeftRadius: "1.4rem",
    borderBottomRightRadius: "1.4rem",
    bgColor: "var(--late-status-color)",
  };
  const missedBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "1.4rem",
    borderBottomLeftRadius: "0rem",
    borderBottomRightRadius: "1.4rem",
    bgColor: "var(--missed-status-color)",
  };

  //   borderStyles: "rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl",

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
      <div className="grid grid-cols-2 mb-5">
        <StatCard
          statName={"In jamaah"}
          styles={inJamaahBoxStyling}
          stat={jamaahStat}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"On time"}
          stat={aloneStat}
          styles={onTimeBoxStyling}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Late"}
          stat={lateStat}
          styles={lateBoxStyling}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Missed"}
          stat={missedStat}
          styles={missedBoxStyling}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
      </div>
    </section>
  );
};

export default StatsPage;
