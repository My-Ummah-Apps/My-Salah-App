// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { useEffect } from "react";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import Calendar from "../components/Stats/Calendar";

// import { eachDayOfInterval, parse } from "date-fns";
import { CalenderSalahArray, userGenderType } from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
// import { DBConnectionStateType } from "../types/types";
// import { SQLiteDBConnection } from "@capacitor-community/sqlite";
// import StreakCount from "../components/Stats/StreakCount";

const StatsPage = ({
  // dbConnection,
  userGender,
  // tableData,
  calenderData,

  // checkAndOpenOrCloseDBConnection,
  setHeading,
  userStartDate,
  pageStyles, // startDate,
}: {
  // dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  userGender: userGenderType;
  // tableData: any;
  calenderData: CalenderSalahArray;

  // checkAndOpenOrCloseDBConnection: (
  //   action: DBConnectionStateType
  // ) => Promise<void>;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  userStartDate: string;
  pageStyles: string;
  // startDate: Date;
}) => {
  useEffect(() => {
    setHeading("Stats");
  }, []);

  let salahInJamaahDatesOverall: string[] = [];
  let salahMaleAloneDatesOverall: string[] = [];
  let salahFemaleAloneDatesOverall: string[] = [];
  let salahExcusedDatesOverall: string[] = [];
  let salahLateDatesOverall: string[] = [];
  let salahMissedDatesOverall: string[] = [];

  console.log("calenderData: ", calenderData);

  // const [showDonutChart, setShowDonutChart] = useState(false);
  let showDonutChart;
  let salahStatusesOverallArr: string[] = [];

  const calculateOverallStats = () => {
    calenderData.forEach((item) => {
      Object.values(item).forEach((subArr) => {
        subArr.forEach((obj) => {
          salahStatusesOverallArr.push(obj.salahStatus);
        });
      });
    });
    // console.log("emptyArray: ", salahStatusesOverallArr);

    const filterSalahStatuses = (salahStatus: string) => {
      return salahStatusesOverallArr.filter((status) => status === salahStatus);
    };

    salahInJamaahDatesOverall = filterSalahStatuses("group");
    salahMaleAloneDatesOverall = filterSalahStatuses("male-alone");
    salahFemaleAloneDatesOverall = filterSalahStatuses("female-alone");
    salahExcusedDatesOverall = filterSalahStatuses("excused");
    salahLateDatesOverall = filterSalahStatuses("late");
    salahMissedDatesOverall = filterSalahStatuses("missed");
  };

  calculateOverallStats();

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
        calenderData={calenderData}
        // startDate={startDate}
        // checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        // setCurrentWeek={setCurrentWeek}
        // currentWeek={currentWeek}
      />{" "}
    </section>
  );
};

export default StatsPage;
