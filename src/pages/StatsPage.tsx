import { useEffect } from "react";

import Calendar from "../components/Stats/Calendar";
import { CalenderSalahArray, userGenderType } from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
// import StreakCount from "../components/Stats/StreakCount";

const StatsPage = ({
  userGender,
  userStartDate,
  tableData,
  calenderData,
  setHeading,
  pageStyles,
}: {
  userGender: userGenderType;
  userStartDate: string;
  tableData: any;
  calenderData: CalenderSalahArray;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
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

  for (let key in salahStatusStatistics) {
    if (salahStatusStatistics[key as keyof typeof salahStatusStatistics] > 0) {
      showDonutChart = true;
      break;
    }
  }

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
        tableData={tableData}
      />{" "}
    </section>
  );
};

export default StatsPage;
