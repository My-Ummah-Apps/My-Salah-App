// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { useEffect } from "react";
import { salahTrackingEntryType } from "../types/types";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import Calendar from "../components/Stats/Calendar";
import StatCard from "../components/Stats/StatCard";
import { eachDayOfInterval, parse } from "date-fns";

// import StreakCount from "../components/Stats/StreakCount";

const StatsPage = ({
  userGender,
  setHeading,
  userStartDate,
  pageStyles,
  startDate,
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  currentWeek,
}: {
  userGender: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
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
  useEffect(() => {
    setHeading("Stats");
  }, []);
  let jamaahStat = 0;
  let aloneStat = 0;
  let lateStat = 0;
  let missedStat = 0;
  let excusedStat = 0;

  let salahInJamaahDatesOverall: string[] = [];
  let salahMaleAloneDatesOverall: string[] = [];
  let salahFemaleAloneDatesOverall: string[] = [];
  let salahExcusedDatesOverall: string[] = [];
  let salahLateDatesOverall: string[] = [];
  let salahMissedDatesOverall: string[] = [];

  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  let todaysDate = new Date();
  let amountOfDaysBetweenStartDateAndToday = eachDayOfInterval({
    start: userStartDateFormatted,
    end: todaysDate,
  });
  let totalPossibleSalah = amountOfDaysBetweenStartDateAndToday.length * 5;
  console.log(totalPossibleSalah);

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

    statToUpdate = Math.round(
      (salahFulfilledDates.length / totalPossibleSalah) * 100
    );

    console.log(totalPossibleSalah);
    // Below will potentially be useful when adding individual salah stats
    // if (array.length > 0) {
    //   statToUpdate = Math.round(
    //     (array.length / (salahFulfilledDates.length + array.length)) * 100
    //   );
    // }

    status === "group"
      ? (jamaahStat = statToUpdate)
      : status === "male-alone" || status === "female-alone"
      ? (aloneStat = statToUpdate)
      : status === "late"
      ? (lateStat = statToUpdate)
      : status === "missed"
      ? (missedStat = statToUpdate)
      : status === "excused"
      ? (excusedStat = statToUpdate)
      : null;
  }

  getSalahStatusDates("group", salahInJamaahDatesOverall);
  userGender === "male"
    ? getSalahStatusDates("male-alone", salahMaleAloneDatesOverall)
    : getSalahStatusDates("female-alone", salahFemaleAloneDatesOverall);
  getSalahStatusDates("late", salahLateDatesOverall);
  getSalahStatusDates("missed", salahMissedDatesOverall);
  getSalahStatusDates("excused", salahExcusedDatesOverall);

  const inJamaahBoxStyling = {
    borderTopRightRadius: "0rem",
    borderTopLeftRadius: "2rem",
    borderBottomLeftRadius: "1.4rem",
    borderBottomRightRadius: "1.4rem",
    iconBgColor: "var(--jamaah-status-color)",
    // bgColor: "var(--card-bg-color)",
    bgColor: "var(--jamaah-status-color)",
  };
  const onTimeBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "1.4rem",
    borderBottomLeftRadius: "1.4rem",
    borderBottomRightRadius: "0rem",
    iconBgColor: "var(--alone-male-status-color)",
    // bgColor: "var(--card-bg-color)",
    bgColor: "var(--alone-male-status-color)",
  };
  const lateBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "0rem",
    borderBottomLeftRadius: "1.4rem",
    borderBottomRightRadius: "1.4rem",
    iconBgColor: "var(--late-status-color)",
    // bgColor: "var(--card-bg-color)",
    bgColor: "var(--late-status-color)",
  };
  const missedBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "1.4rem",
    borderBottomLeftRadius: "0rem",
    borderBottomRightRadius: "1.4rem",
    iconBgColor: "var(--missed-status-color)",
    // bgColor: "var(--card-bg-color)",
    bgColor: "var(--missed-status-color)",
  };
  const excusedBoxStyling = {
    borderTopRightRadius: "1.4rem",
    borderTopLeftRadius: "1.4rem",
    borderBottomLeftRadius: "0rem",
    borderBottomRightRadius: "1.4rem",
    iconBgColor: "var(--excused-status-color)",
    // bgColor: "var(--card-bg-color)",
    bgColor: "var(--excused-status-color)",
  };

  //   borderStyles: "rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl",

  return (
    <section className={`${pageStyles} settings-page-wrap`}>
      {/* <StreakCount styles={{}} /> */}
      <Calendar
        userStartDate={userStartDate}
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        startDate={startDate}
        setCurrentWeek={setCurrentWeek}
        currentWeek={currentWeek}
      />{" "}
      <div className="grid grid-cols-2 mb-5">
        {userGender === "male" && (
          <StatCard
            statName={"In jamaah"}
            styles={inJamaahBoxStyling}
            stat={jamaahStat}
            amountTimesStat={salahInJamaahDatesOverall.length}
            salahFulfilledDates={salahFulfilledDates}
            salahTrackingArray={salahTrackingArray}
          />
        )}

        <StatCard
          statName={"On time"}
          styles={onTimeBoxStyling}
          stat={aloneStat}
          amountTimesStat={
            userGender === "male"
              ? salahMaleAloneDatesOverall.length
              : salahFemaleAloneDatesOverall.length
          }
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        {userGender === "female" && (
          <StatCard
            statName={"Excused"}
            styles={excusedBoxStyling}
            stat={excusedStat}
            amountTimesStat={salahExcusedDatesOverall.length}
            salahFulfilledDates={salahFulfilledDates}
            salahTrackingArray={salahTrackingArray}
          />
        )}
        <StatCard
          statName={"Late"}
          stat={lateStat}
          amountTimesStat={salahLateDatesOverall.length}
          styles={lateBoxStyling}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
        <StatCard
          statName={"Missed"}
          stat={missedStat}
          amountTimesStat={salahMissedDatesOverall.length}
          styles={missedBoxStyling}
          salahFulfilledDates={salahFulfilledDates}
          salahTrackingArray={salahTrackingArray}
        />
      </div>
    </section>
  );
};

export default StatsPage;
