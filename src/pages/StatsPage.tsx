import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { motion } from "framer-motion";

import Calendar from "../components/Stats/Calendar";
import {
  reasonsToShowType,
  SalahNamesType,
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
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  pageTransitionStyles,
  salahStatusColorsHexCodes,
} from "../utils/constants";

// import StreakCount from "../components/Stats/StreakCount";

interface StatsPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
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
  const [statsToShow, setStatsToShow] = useState<SalahNamesType | "All">("All");

  const salahStatusesOverallArr: SalahStatusType[] = [];
  console.log("fetchedSalahData: ", fetchedSalahData);

  const getAllSalahStatuses = () => {
    for (let i = 0; i < fetchedSalahData.length; i++) {
      if (statsToShow === "All") {
        Object.values(fetchedSalahData[i].salahs).forEach((status) => {
          if (status !== "" && typeof status === "string") {
            salahStatusesOverallArr.push(status as SalahStatusType);
          }
        });
      } else if (statsToShow === "Fajr") {
        if (fetchedSalahData[i].salahs.Fajr) {
          salahStatusesOverallArr.push(fetchedSalahData[i].salahs.Fajr);
        }
      } else if (statsToShow === "Dhuhr") {
        if (fetchedSalahData[i].salahs.Dhuhr) {
          salahStatusesOverallArr.push(fetchedSalahData[i].salahs.Dhuhr);
        }
      } else if (statsToShow === "Asar") {
        if (fetchedSalahData[i].salahs.Asar) {
          salahStatusesOverallArr.push(fetchedSalahData[i].salahs.Asar);
        }
      } else if (statsToShow === "Maghrib") {
        if (fetchedSalahData[i].salahs.Maghrib) {
          salahStatusesOverallArr.push(fetchedSalahData[i].salahs.Maghrib);
        }
      } else if (statsToShow === "Isha") {
        if (fetchedSalahData[i].salahs.Isha) {
          salahStatusesOverallArr.push(fetchedSalahData[i].salahs.Isha);
        }
      }
    }
  };

  getAllSalahStatuses();

  const filterSalahStatuses = (salahStatus: SalahStatusType) => {
    if (statsToShow === "Fajr") {
      return salahStatusesOverallArr.filter((status) => status === salahStatus);
    } else if (statsToShow === "Dhuhr") {
      return salahStatusesOverallArr.filter((status) => status === salahStatus);
    } else if (statsToShow === "Asar") {
      return salahStatusesOverallArr.filter((status) => status === salahStatus);
    } else if (statsToShow === "Maghrib") {
      return salahStatusesOverallArr.filter((status) => status === salahStatus);
    } else if (statsToShow === "Isha") {
      return salahStatusesOverallArr.filter((status) => status === salahStatus);
    }
    return salahStatusesOverallArr.filter((status) => status === salahStatus);
  };

  const salahStatusStatistics = {
    salahInGroupDatesOverall: filterSalahStatuses("group").length,
    salahMaleAloneDatesOverall: filterSalahStatuses("male-alone").length,
    salahFemaleAloneDatesOverall: filterSalahStatuses("female-alone").length,
    salahExcusedDatesOverall: filterSalahStatuses("excused").length,
    salahMissedDatesOverall: filterSalahStatuses("missed").length,
    salahLateDatesOverall: filterSalahStatuses("late").length,
  };

  // console.log("salahStatusesOverallArr: ", salahStatusesOverallArr);

  const donutPieChartData = [
    userPreferences.userGender === "male"
      ? {
          title: "In Jamaah",
          value: salahStatusStatistics.salahInGroupDatesOverall,
          color: salahStatusColorsHexCodes.group,
        }
      : {
          title: "Prayed",
          value: salahStatusStatistics.salahFemaleAloneDatesOverall,
          color: salahStatusColorsHexCodes["female-alone"],
        },
    userPreferences.userGender === "male"
      ? {
          title: "Alone",
          value: salahStatusStatistics.salahMaleAloneDatesOverall,
          color: salahStatusColorsHexCodes["male-alone"],
        }
      : {
          title: "Excused",
          value: salahStatusStatistics.salahExcusedDatesOverall,
          color: salahStatusColorsHexCodes.excused,
        },

    {
      title: "Late",
      value: salahStatusStatistics.salahLateDatesOverall,
      color: salahStatusColorsHexCodes.late,
    },
    {
      title: "Missed",
      value: salahStatusStatistics.salahMissedDatesOverall,
      color: salahStatusColorsHexCodes.missed,
    },
  ];

  useEffect(() => {
    const grabSalahDataFromDB = async () => {
      try {
        await checkAndOpenOrCloseDBConnection("open");
        let DBResultAllSalahData = await dbConnection.current!.query(
          `SELECT * FROM salahDataTable`
        );

        if (!DBResultAllSalahData.values) {
          throw new Error("DBResultAllSalahData.values are undefined");
        }

        const DBResultAllSalahDataValues = DBResultAllSalahData.values;

        let maleAloneReasonsArr: string[] = [];
        let lateReasonsArr: string[] = [];
        let missedReasonsArr: string[] = [];

        const salahStatusesWithoutReasons = [
          "group",
          "excused",
          "female-alone",
        ];

        for (let i = 0; i < DBResultAllSalahDataValues.length; i++) {
          if (
            !salahStatusesWithoutReasons.includes(
              DBResultAllSalahDataValues[i].salahStatus
            ) &&
            DBResultAllSalahDataValues[i].reasons !== ""
          ) {
            const reasons = DBResultAllSalahDataValues[i].reasons.split(", ");

            if (DBResultAllSalahDataValues[i].salahStatus === "male-alone") {
              maleAloneReasonsArr.push(reasons);
            } else if (DBResultAllSalahDataValues[i].salahStatus === "late") {
              lateReasonsArr.push(reasons);
            } else if (DBResultAllSalahDataValues[i].salahStatus === "missed") {
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

  console.log("statsToShow: ", statsToShow);

  return (
    <motion.section
      {...pageTransitionStyles}
      className={`${pageStyles} stats-page-wrap`}
    >
      <header className="stats-page-header">
        <p className="stats-page-header-p">Stats</p>
      </header>
      <section className="stats-page-components-wrap">
        <StreakCounter
          streakDatesObjectsArr={streakDatesObjectsArr}
          activeStreakCount={activeStreakCount}
          userGender={userPreferences.userGender}
        />
        <section className="flex justify-around">
          <button
            onClick={() => {
              setStatsToShow("All");
            }}
          >
            All
          </button>
          <button
            onClick={() => {
              setStatsToShow("Fajr");
            }}
          >
            Fajr
          </button>
          <button
            onClick={() => {
              setStatsToShow("Dhuhr");
            }}
          >
            Dhuhr
          </button>
          <button
            onClick={() => {
              setStatsToShow("Asar");
            }}
          >
            Asar
          </button>
          <button
            onClick={() => {
              setStatsToShow("Maghrib");
            }}
          >
            Maghrib
          </button>
          <button
            onClick={() => {
              setStatsToShow("Isha");
            }}
          >
            Isha
          </button>
        </section>
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
          setShowReasonsSheet={setShowReasonsSheet}
          showReasonsSheet={showReasonsSheet}
          salahReasonsOverallNumbers={salahReasonsOverallNumbers}
          status={reasonsToShow}
        />
      </section>
    </motion.section>
  );
};

export default StatsPage;
