// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { useEffect } from "react";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import Calendar from "../components/Stats/Calendar";

// import { eachDayOfInterval, parse } from "date-fns";
import { userGenderType } from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
import { DBConnectionStateType } from "../types/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
// import StreakCount from "../components/Stats/StreakCount";

const StatsPage = ({
  dbConnection,
  userGender,
  salahData,
  calenderData,

  checkAndOpenOrCloseDBConnection,
  setHeading,
  userStartDate,
  pageStyles,
  startDate,
}: {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  userGender: userGenderType;
  salahData: any;
  calenderData: any;

  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  userStartDate: string;
  pageStyles: string;
  startDate: Date;
}) => {
  useEffect(() => {
    setHeading("Stats");
  }, []);

  // let jamaahStat = 0;
  // let aloneStat = 0;
  // let lateStat = 0;
  // let missedStat = 0;
  // let excusedStat = 0;

  // const [showDonutChart, setShowDonutChart] = useState(false);
  let showDonutChart;

  let salahInJamaahDatesOverall: string[] = [];
  let salahMaleAloneDatesOverall: string[] = [];
  let salahFemaleAloneDatesOverall: string[] = [];
  let salahExcusedDatesOverall: string[] = [];
  let salahLateDatesOverall: string[] = [];
  let salahMissedDatesOverall: string[] = [];

  // const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  // let todaysDate = new Date();
  // let amountOfDaysBetweenStartDateAndToday = eachDayOfInterval({
  //   start: userStartDateFormatted,
  //   end: todaysDate,
  // });
  // let totalPossibleSalah = amountOfDaysBetweenStartDateAndToday.length * 5;
  // console.log(totalPossibleSalah);

  // const salahFulfilledDates = salahTrackingArray.reduce<string[]>(
  //   (accumulatorArray, salah) => {
  //     for (let i = 0; i < salah.completedDates.length; i++) {
  //       accumulatorArray.push(Object.keys(salah.completedDates[i])[0]);
  //     }
  //     return accumulatorArray;
  //   },
  //   []
  // );

  function getSalahStatusDates(status: string, array: string[]) {
    // let statToUpdate = 0;
    // salahTrackingArray.forEach((salah) => {
    //   for (let i = 0; i < salah.completedDates.length; i++) {
    //     if (Object.values(salah.completedDates[i])[0].status === status) {
    //       array.push(Object.keys(salah.completedDates[i])[0]);
    //     }
    //   }
    // });
    // statToUpdate = Math.round(
    //   (salahFulfilledDates.length / totalPossibleSalah) * 100
    // );
    // console.log(totalPossibleSalah);
    // Below will potentially be useful when adding individual salah stats
    // if (array.length > 0) {
    //   statToUpdate = Math.round(
    //     (array.length / (salahFulfilledDates.length + array.length)) * 100
    //   );
    // }
    // status === "group"
    //   ? (jamaahStat = statToUpdate)
    //   : status === "male-alone" || status === "female-alone"
    //   ? (aloneStat = statToUpdate)
    //   : status === "late"
    //   ? (lateStat = statToUpdate)
    //   : status === "missed"
    //   ? (missedStat = statToUpdate)
    //   : status === "excused"
    //   ? (excusedStat = statToUpdate)
    //   : null;
  }

  getSalahStatusDates("group", salahInJamaahDatesOverall);
  userGender === "male"
    ? getSalahStatusDates("male-alone", salahMaleAloneDatesOverall)
    : getSalahStatusDates("female-alone", salahFemaleAloneDatesOverall);
  getSalahStatusDates("late", salahLateDatesOverall);
  getSalahStatusDates("missed", salahMissedDatesOverall);
  getSalahStatusDates("excused", salahExcusedDatesOverall);

  //   borderStyles: "rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl",

  const salahStatusStatistics = {
    salahInJamaahDatesOverall: salahInJamaahDatesOverall.length,
    salahMaleAloneDatesOverall: salahMaleAloneDatesOverall.length,
    salahFemaleAloneDatesOverall: salahFemaleAloneDatesOverall.length,
    salahExcusedDatesOverall: salahExcusedDatesOverall.length,
    salahMissedDatesOverall: salahMissedDatesOverall.length,
    salahLateDatesOverall: salahLateDatesOverall.length,
  };

  // console.log(
  //   Object.values(salahStatusStatistics).some((num) => num > 0)
  // );
  // console.log(Object.values(salahStatusStatistics));

  for (let key in salahStatusStatistics) {
    // console.log(
    //   salahStatusStatistics[key as keyof typeof salahStatusStatistics]
    // );
    if (salahStatusStatistics[key as keyof typeof salahStatusStatistics] > 0) {
      showDonutChart = true;
      break;
    }
  }

  // const salahStatusStatisticsLengthCheck = Object.values(
  //   salahStatusStatistics
  // ).some((length) => length > 0);

  // setShowDonutChart(salahStatusStatisticsLengthCheck);

  return (
    <section className={`${pageStyles} settings-page-wrap`}>
      {/* <StreakCount styles={{}} /> */}
      {showDonutChart === true ? (
        <DonutPieChart
          userGender={userGender}
          salahStatusStatistics={salahStatusStatistics}
        />
      ) : (
        ""
      )}
      <Calendar
        userStartDate={userStartDate}
        salahData={salahData}
        calenderData={calenderData}
        startDate={startDate}
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        // setCurrentWeek={setCurrentWeek}
        // currentWeek={currentWeek}
      />{" "}
    </section>
  );
};

export default StatsPage;
