import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";

// import "swiper/swiper-bundle.min.css";
// // import "swiper/swiper.min.css";

import Calendar from "../components/Stats/Calendar";
import {
  reasonsToShowType,
  salahReasonsOverallNumbersType,
  SalahRecordsArrayType,
  SalahStatusType,
  userPreferencesType,
} from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
import { DBConnectionStateType } from "../types/types";
import ReasonsCard from "../components/Stats/ReasonsCard";
import BottomSheetReasons from "../components/BottomSheets/BottomSheetReasons";
import StreakCounter from "../components/Stats/StreakCounter";
import { streakDatesObjType } from "../types/types";

// import StreakCount from "../components/Stats/StreakCount";

interface StatsPageProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  userPreferences: userPreferencesType;
  fetchedSalahData: SalahRecordsArrayType;
  pageStyles: string;
  streakDatesObjectsArr: streakDatesObjType[];
  activeStreakCount: number;
}

const StatsPage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  userPreferences,
  fetchedSalahData,
  pageStyles,
  streakDatesObjectsArr,
  activeStreakCount,
}: StatsPageProps) => {
  const [salahReasonsOverallNumbers, setSalahReasonsOverallNumbers] =
    useState<salahReasonsOverallNumbersType>({
      "male-alone": {},
      late: {},
      missed: {},
    });
  const [showReasonsSheet, setShowReasonsSheet] = useState(false);
  const [reasonsToShow, setReasonsToShow] = useState<reasonsToShowType>();

  const salahStatusesOverallArr: SalahStatusType[] = [];
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

  getAllSalahStatuses();

  const filterSalahStatuses = (salahStatus: SalahStatusType) => {
    return salahStatusesOverallArr.filter((status) => status === salahStatus);
  };

  const salahStatusStatistics = {
    salahInJamaahDatesOverall: filterSalahStatuses("group").length,
    salahMaleAloneDatesOverall: filterSalahStatuses("male-alone").length,
    salahFemaleAloneDatesOverall: filterSalahStatuses("female-alone").length,
    salahExcusedDatesOverall: filterSalahStatuses("excused").length,
    salahMissedDatesOverall: filterSalahStatuses("missed").length,
    salahLateDatesOverall: filterSalahStatuses("late").length,
  };

  const donutPieChartData = [
    userPreferences.userGender === "male"
      ? {
          name: "In Jamaah",
          value: salahStatusStatistics.salahInJamaahDatesOverall,
        }
      : {
          name: "Prayed",
          value: salahStatusStatistics.salahFemaleAloneDatesOverall,
        },
    userPreferences.userGender === "male"
      ? {
          name: "Alone",
          value: salahStatusStatistics.salahMaleAloneDatesOverall,
        }
      : {
          name: "Excused",
          value: salahStatusStatistics.salahExcusedDatesOverall,
        },

    { name: "Late", value: salahStatusStatistics.salahLateDatesOverall },
    { name: "Missed", value: salahStatusStatistics.salahMissedDatesOverall },
  ];
  console.log(Object.values(donutPieChartData).some((obj) => obj.value));
  console.log(
    "Object.entries(donutPieChartData): ",
    Object.values(donutPieChartData)
  );

  useEffect(() => {
    const grabSalahDataFromDB = async () => {
      try {
        await checkAndOpenOrCloseDBConnection("open");
        let DBResultAllSalahData = await dbConnection.current.query(
          `SELECT * FROM salahDataTable`
        );

        DBResultAllSalahData = DBResultAllSalahData.values;

        let maleAloneReasonsArr: any[] = [];
        let lateReasonsArr: any[] = [];
        let missedReasonsArr: any[] = [];

        const salahStatusesWithoutReasons = [
          "group",
          "excused",
          "female-alone",
        ];

        for (let i = 0; i < DBResultAllSalahData.length; i++) {
          if (
            !salahStatusesWithoutReasons.includes(
              DBResultAllSalahData[i].salahStatus
            ) &&
            DBResultAllSalahData[i].reasons !== ""
          ) {
            const reasons = DBResultAllSalahData[i].reasons.split(", ");

            if (DBResultAllSalahData[i].salahStatus === "male-alone") {
              maleAloneReasonsArr.push(reasons);
            } else if (DBResultAllSalahData[i].salahStatus === "late") {
              lateReasonsArr.push(reasons);
            } else if (DBResultAllSalahData[i].salahStatus === "missed") {
              missedReasonsArr.push(reasons);
            }
          }
        }

        const populateReasonsArrays = (
          arr: string[],
          status: keyof salahReasonsOverallNumbersType
        ) => {
          arr.forEach((item: string) => {
            if (item === "") return;

            salahReasonsOverallNumbers[status][item] =
              salahReasonsOverallNumbers[status][item]
                ? (salahReasonsOverallNumbers[status][item] += 1)
                : 1;
          });

          const sortedObj = Object.entries(salahReasonsOverallNumbers[status])
            .sort((a, b) => a[1] - b[1])
            .reverse();

          salahReasonsOverallNumbers[status] = Object.fromEntries(sortedObj);
        };

        populateReasonsArrays(maleAloneReasonsArr.flat(), "male-alone");
        populateReasonsArrays(lateReasonsArr.flat(), "late");
        populateReasonsArrays(missedReasonsArr.flat(), "missed");

        setSalahReasonsOverallNumbers({
          ...salahReasonsOverallNumbers,
        });
      } catch (error) {
        console.error(error);
      } finally {
        await checkAndOpenOrCloseDBConnection("close");
      }
    };
    grabSalahDataFromDB();
  }, []);

  //   borderStyles: "rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl",

  return (
    // <section className={`${pageStyles}`}>
    <section className={`${pageStyles} stats-page-wrap`}>
      {/* <StreakCount styles={{}} /> */}
      <header className="stats-page-header">
        <p className="stats-page-header-p">Stats</p>
      </header>
      <section className="stats-page-components-wrap">
        <StreakCounter
          streakDatesObjectsArr={streakDatesObjectsArr}
          activeStreakCount={activeStreakCount}
          userGender={userPreferences.userGender}
        />
        {Object.values(donutPieChartData).some((obj) => obj.value) && (
          <DonutPieChart
            donutPieChartData={donutPieChartData}
            userGender={userPreferences.userGender}
            salahStatusStatistics={salahStatusStatistics}
          />
        )}
        <Calendar
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          userStartDate={userPreferences.userStartDate}
          fetchedSalahData={fetchedSalahData}
        />{" "}
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          modules={[Pagination]}
          pagination={{ clickable: true }}
        >
          {userPreferences.userGender === "male" &&
            salahStatusStatistics.salahMaleAloneDatesOverall > 0 && (
              <SwiperSlide>
                <ReasonsCard
                  setReasonsToShow={setReasonsToShow}
                  setShowReasonsSheet={setShowReasonsSheet}
                  salahReasonsOverallNumbers={salahReasonsOverallNumbers}
                  status={"male-alone"}
                />
              </SwiperSlide>
            )}
          {salahStatusStatistics.salahLateDatesOverall > 0 && (
            <SwiperSlide>
              <ReasonsCard
                setReasonsToShow={setReasonsToShow}
                setShowReasonsSheet={setShowReasonsSheet}
                salahReasonsOverallNumbers={salahReasonsOverallNumbers}
                status={"late"}
              />
            </SwiperSlide>
          )}
          {salahStatusStatistics.salahMissedDatesOverall > 0 && (
            <SwiperSlide>
              <ReasonsCard
                setReasonsToShow={setReasonsToShow}
                setShowReasonsSheet={setShowReasonsSheet}
                salahReasonsOverallNumbers={salahReasonsOverallNumbers}
                status={"missed"}
              />
            </SwiperSlide>
          )}
        </Swiper>
        <BottomSheetReasons
          // setReasonsToShow={setReasonsToShow}
          setShowReasonsSheet={setShowReasonsSheet}
          showReasonsSheet={showReasonsSheet}
          salahReasonsOverallNumbers={salahReasonsOverallNumbers}
          status={reasonsToShow}
        />
      </section>
    </section>
  );
};

export default StatsPage;
