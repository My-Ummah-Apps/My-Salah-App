import { useEffect } from "react";

import Calendar from "../components/Stats/Calendar";
import {
  salahReasonsOverallNumbersType,
  salahReasonsOverallStatsType,
  SalahRecordsArrayType,
  SalahStatusType,
  // userGenderType,
  userPreferencesType,
} from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
import { DBConnectionStateType } from "../types/types";
import ReasonsCard from "../components/Stats/ReasonsCard";

// import StreakCount from "../components/Stats/StreakCount";

interface StatsPageProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  // DBResultAllSalahData: DBSQLiteValues;
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  userPreferences: userPreferencesType;
  fetchedSalahData: SalahRecordsArrayType;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
}

const StatsPage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  // DBResultAllSalahData,
  salahReasonsOverallNumbers,
  userPreferences,
  fetchedSalahData,
  setHeading,
  pageStyles,
}: StatsPageProps) => {
  useEffect(() => {
    setHeading("Stats");
  }, []);

  // const [showDonutChart, setShowDonutChart] = useState(false);
  let salahStatusStatistics;
  let showDonutChart;
  let salahStatusesOverallArr: SalahStatusType[] = [];
  // TODO: Test the below code to ensure stats are being calculated correctly
  const getAllSalahStatuses = () => {
    for (let i = 0; i < fetchedSalahData.length; i++) {
      Object.values(fetchedSalahData[i].salahs).forEach((status) => {
        if (status !== "" && typeof status === "string") {
          salahStatusesOverallArr.push(status as SalahStatusType);
        }
      });
    }
  };

  // const getAllSalahReasons = () => {
  //   for (let i = 0; i < DBResultAllSalahData?.values.length; i++) {
  //     console.log(fetchedSalahData[i]);
  //   }
  // };

  // getAllSalahReasons();

  getAllSalahStatuses();

  const filterSalahStatuses = (salahStatus: SalahStatusType) => {
    return salahStatusesOverallArr.filter((status) => status === salahStatus);
  };

  //   borderStyles: "rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl",

  salahStatusStatistics = {
    salahInJamaahDatesOverall: filterSalahStatuses("group").length,
    salahMaleAloneDatesOverall: filterSalahStatuses("male-alone").length,
    salahFemaleAloneDatesOverall: filterSalahStatuses("female-alone").length,
    salahExcusedDatesOverall: filterSalahStatuses("excused").length,
    salahMissedDatesOverall: filterSalahStatuses("missed").length,
    salahLateDatesOverall: filterSalahStatuses("late").length,
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
      <ReasonsCard salahReasonsOverallNumbers={salahReasonsOverallNumbers} />
      <ReasonsCard salahReasonsOverallNumbers={salahReasonsOverallNumbers} />
      <ReasonsCard salahReasonsOverallNumbers={salahReasonsOverallNumbers} />
    </section>
  );
};

export default StatsPage;
