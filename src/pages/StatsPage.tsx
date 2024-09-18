import { useEffect } from "react";

import Calendar from "../components/Stats/Calendar";
import {
  CalenderSalahArray,
  userGenderType,
  userPreferences,
} from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
import { DBConnectionStateType } from "../types/types";
// import StreakCount from "../components/Stats/StreakCount";

interface StatsPageProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  userPreferences: userPreferences;

  // userGender: userGenderType;
  // userStartDate: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
}

const StatsPage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  // userGender,
  // userStartDate,
  userPreferences,
  fetchedSalahData,
  setHeading,
  pageStyles,
}: StatsPageProps) => {
  useEffect(() => {
    setHeading("Stats");
  }, []);

  let salahInJamaahDatesOverall: string[] = [];
  let salahMaleAloneDatesOverall: string[] = [];
  let salahFemaleAloneDatesOverall: string[] = [];
  let salahExcusedDatesOverall: string[] = [];
  let salahLateDatesOverall: string[] = [];
  let salahMissedDatesOverall: string[] = [];

  // const [showDonutChart, setShowDonutChart] = useState(false);
  let showDonutChart;
  let salahStatusesOverallArr: string[] = [];
  // TODO: Test the below code to ensure stats are being calculated correctly
  const calculateOverallStats = () => {
    for (let i = 0; i < fetchedSalahData.length; i++) {
      Object.values(fetchedSalahData[i].salahs).forEach((status) => {
        if (status !== "") {
          salahStatusesOverallArr.push(status);
        }
      });
    }
    console.log(salahStatusesOverallArr);

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
          userGender={userPreferences.userGender}
          salahStatusStatistics={salahStatusStatistics}
        />
      ) : (
        ""
      )}
      <Calendar
        dbConnection={dbConnection}
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        userStartDate={userPreferences.userStartDate}
        fetchedSalahData={fetchedSalahData}
      />{" "}
    </section>
  );
};

export default StatsPage;
