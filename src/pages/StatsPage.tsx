import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";

import Calendar from "../components/Stats/Calendar";
import YearlyStats from "../components/Stats/YearlyStats";
import {
  reasonsToShowType,
  SalahNamesType,
  salahReasonsOverallNumbersType,
  SalahRecordsArrayType,
  SalahStatusType,
  userPreferencesType,
} from "../types/types";
import DonutPieChart from "../components/Stats/DonutPieChart";
import ReasonsCard from "../components/Stats/ReasonsCard";
import BottomSheetReasons from "../components/BottomSheets/BottomSheetReasons";
import StreakCounter from "../components/Stats/StreakCounter";
import { streakDatesObjType } from "../types/types";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  // pageTransitionStyles,
  salahStatusColorsHexCodes,
} from "../utils/constants";

import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import SalahSegmentTabs from "../components/Stats/SalahSegmentTabs";
import { toggleDBConnection } from "../utils/dbUtils";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { eachMonthOfInterval, format, parse } from "date-fns";

// import StreakCount from "../components/Stats/StreakCount";

interface StatsPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  userPreferences: userPreferencesType;
  fetchedSalahData: SalahRecordsArrayType;
  streakDatesObjectsArr: streakDatesObjType[];
  activeStreakCount: number;
}

type StatsPeriod = "overall" | "monthly" | "yearly";

const StatsPage = ({
  dbConnection,
  userPreferences,
  fetchedSalahData,
  streakDatesObjectsArr,
  activeStreakCount,
}: StatsPageProps) => {
  const location = useLocation();
  const isStatsPage = location.pathname === "/StatsPage";

  const [salahReasonsOverallNumbers, setSalahReasonsOverallNumbers] =
    useState<salahReasonsOverallNumbersType>({
      "male-alone": {},
      late: {},
      missed: {},
    });
  const [showReasonsSheet, setShowReasonsSheet] = useState(false);
  const [reasonsToShow, setReasonsToShow] = useState<reasonsToShowType>();
  const [statsToShow, setStatsToShow] = useState<
    Exclude<SalahNamesType, "Asar"> | "All"
  >("All");
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>("monthly");

  const salahStatusesOverallArr: SalahStatusType[] = [];

  const [clickedDate, setClickedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const userStartDateParsed = parse(
    userPreferences.userStartDate,
    "yyyy-MM-dd",
    new Date(),
  );
  const todaysDate = new Date();
  const earliestYear = userStartDateParsed.getFullYear();
  const currentYear = todaysDate.getFullYear();

  const monthsBetween = eachMonthOfInterval({
    start: userStartDateParsed,
    end: todaysDate,
  });

  const formattedMonths = monthsBetween.map((month) =>
    format(month, "MMMM yyyy"),
  );
  formattedMonths.reverse();

  console.log(formattedMonths[currentMonth]);
  // ! formattedMonths and currentMonth seem to be key, both the piechart and reasons components are having stats passed down to them from this page it seems

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
      } else if (statsToShow === "Asr") {
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

  const filterSalahStatuses = (salahStatus: SalahStatusType) =>
    salahStatusesOverallArr.filter((status) => status === salahStatus);

  const salahStatusStatistics = {
    salahInGroupDatesOverall: filterSalahStatuses("group").length,
    salahMaleAloneDatesOverall: filterSalahStatuses("male-alone").length,
    salahFemaleAloneDatesOverall: filterSalahStatuses("female-alone").length,
    salahExcusedDatesOverall: filterSalahStatuses("excused").length,
    salahMissedDatesOverall: filterSalahStatuses("missed").length,
    salahLateDatesOverall: filterSalahStatuses("late").length,
  };

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

  const fetchSalahDataFromDB = async () => {
    try {
      await toggleDBConnection(dbConnection, "open");
      // let DBResultAllSalahData = await dbConnection.current!.query(
      //   `SELECT * FROM salahDataTable`,
      // );

      let DBResultAllSalahData = await dbConnection.current!.query(
        `SELECT date, salahName, salahStatus, reasons, notes
          FROM salahDataTable`,
      );

      if (!DBResultAllSalahData.values) {
        throw new Error("DBResultAllSalahData.values are undefined");
      }

      const DBResultAllSalahDataValues = DBResultAllSalahData.values;

      const maleAloneReasonsArr: string[] = [];
      const lateReasonsArr: string[] = [];
      const missedReasonsArr: string[] = [];

      const salahStatusesWithoutReasons = ["group", "excused", "female-alone"];

      const populateReasonsArrays = (i: number) => {
        const reasons = DBResultAllSalahDataValues[i].reasons.split(", ");
        const salahStatus = DBResultAllSalahDataValues[i].salahStatus;

        if (salahStatus === "male-alone") {
          maleAloneReasonsArr.push(reasons);
        } else if (salahStatus === "late") {
          lateReasonsArr.push(reasons);
        } else if (salahStatus === "missed") {
          missedReasonsArr.push(reasons);
        }
      };

      for (let i = 0; i < DBResultAllSalahDataValues.length; i++) {
        if (
          !salahStatusesWithoutReasons.includes(
            DBResultAllSalahDataValues[i].salahStatus,
          ) &&
          DBResultAllSalahDataValues[i].reasons !== ""
        ) {
          const salahName: SalahNamesType =
            DBResultAllSalahDataValues[i].salahName;

          if (statsToShow === "All") {
            populateReasonsArrays(i);
          } else if (statsToShow === "Fajr" && salahName === "Fajr") {
            populateReasonsArrays(i);
          } else if (statsToShow === "Dhuhr" && salahName === "Dhuhr") {
            populateReasonsArrays(i);
          } else if (statsToShow === "Asr" && salahName === "Asar") {
            populateReasonsArrays(i);
          } else if (statsToShow === "Maghrib" && salahName === "Maghrib") {
            populateReasonsArrays(i);
          } else if (statsToShow === "Isha" && salahName === "Isha") {
            populateReasonsArrays(i);
          }
        }
      }
      // const obj = { ...salahReasonsOverallNumbers };
      const obj: salahReasonsOverallNumbersType = {
        "male-alone": {},
        late: {},
        missed: {},
      };

      const calculateReasonAmounts = (
        arr: string[],
        status: keyof salahReasonsOverallNumbersType,
      ) => {
        arr.forEach((reason: string) => {
          if (reason === "") return;

          if (obj[status][reason]) {
            obj[status][reason] += 1;
          } else {
            obj[status][reason] = 1;
          }
        });

        const sortedObj = Object.entries(obj[status])
          .sort((a, b) => a[1] - b[1])
          .reverse();

        obj[status] = Object.fromEntries(sortedObj);
      };

      calculateReasonAmounts(maleAloneReasonsArr.flat(), "male-alone");
      calculateReasonAmounts(lateReasonsArr.flat(), "late");
      calculateReasonAmounts(missedReasonsArr.flat(), "missed");

      setSalahReasonsOverallNumbers(obj);
    } catch (error) {
      console.error(error);
    } finally {
      await toggleDBConnection(dbConnection, "close");
    }
  };

  useEffect(() => {
    if (isStatsPage) {
      fetchSalahDataFromDB();
    }
  }, [fetchedSalahData, statsToShow, location.pathname]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-header-toolbar">
          <IonTitle>Stats</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <motion.section
          // {...pageTransitionStyles}
          className={`stats-page-wrap`}
        >
          <section className="stats-page-components-wrap">
            <StreakCounter
              streakDatesObjectsArr={streakDatesObjectsArr}
              activeStreakCount={activeStreakCount}
              userGender={userPreferences.userGender}
            />
            {/* <div className="sticky z-10 top-[56px] bg-white dark:bg-[#121212]"> */}

            <SalahSegmentTabs
              setStatsToShow={setStatsToShow}
              statsToShow={statsToShow}
            />

            <IonSegment
              className="mt-5"
              mode="ios"
              value={statsPeriod}
              onIonChange={(e) => {
                setStatsPeriod(e.detail.value as StatsPeriod);
              }}
            >
              <IonSegmentButton value="monthly">
                <IonLabel>Monthly</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="yearly">
                <IonLabel>Yearly</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="overall">
                <IonLabel>Overall</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {statsPeriod === "monthly" && <div className="bg-[var(--sheet-option-bg)] rounded-md flex items-center justify-center my-5">
              <button
                type="button"
                aria-label="Previous year"
                disabled={currentMonth + 1 > formattedMonths.length - 1}
                className="px-2 border-r border-[var(--app-border-color)] border-solid"
                onClick={() => {
                  setCurrentMonth((prev) => {
                    if (prev + 12 > formattedMonths.length - 1) {
                      return formattedMonths.length - 1;
                    }
                    return prev + 12;
                  });
                }}
              >
                <HiOutlineChevronDoubleLeft />
              </button>
              <button
                type="button"
                aria-label="Previous month"
                disabled={currentMonth === formattedMonths.length - 1}
                onClick={() => {
                  setCurrentMonth((prev) => {
                    if (prev === formattedMonths.length - 1) {
                      return prev;
                    }
                    return prev + 1;
                  });
                }}
                className="px-2 border-r border-[var(--app-border-color)] border-solid"
              >
                <HiOutlineChevronLeft />
              </button>
              {formattedMonths[currentMonth]}
              <button
                type="button"
                aria-label="Next month"
                disabled={currentMonth === 0}
                onClick={() => {
                  setCurrentMonth((prev) => {
                    if (prev === 0) {
                      return prev;
                    }
                    return prev - 1;
                  });
                }}
                className="px-2 border-r border-[var(--app-border-color)] border-solid"
              >
                <HiOutlineChevronRight />
              </button>
              <button
                type="button"
                aria-label="Next year"
                disabled={currentMonth === 0}
                onClick={() => {
                  setCurrentMonth((prev) => {
                    if (prev - 12 <= 0) {
                      return 0;
                    }
                    return prev - 12;
                  });
                }}
                className="p-2 m-1"
              >
                <HiOutlineChevronDoubleRight />
              </button>
            </div>}

            {statsPeriod === "yearly" && (
              <div className="flex items-center justify-between px-6 py-2 my-5">
                <button
                  type="button"
                  aria-label="Previous year"
                  disabled={selectedYear <= earliestYear}
                  onClick={() =>
                    setSelectedYear((previousYear) =>
                      Math.max(previousYear - 1, earliestYear),
                    )
                  }
                  className="flex items-center justify-center w-10 h-10 text-2xl disabled:opacity-30"
                >
                  <HiOutlineChevronLeft />
                </button>
                <span className="text-xl font-semibold tracking-wide">
                  {selectedYear}
                </span>
                <button
                  type="button"
                  aria-label="Next year"
                  disabled={selectedYear >= currentYear}
                  onClick={() =>
                    setSelectedYear((previousYear) =>
                      Math.min(previousYear + 1, currentYear),
                    )
                  }
                  className="flex items-center justify-center w-10 h-10 text-2xl disabled:opacity-30"
                >
                  <HiOutlineChevronRight />
                </button>
              </div>
            )}

            {/* </div> */}
            <AnimatePresence mode="wait">
              <motion.section
                key={statsToShow}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {Object.values(donutPieChartData).some((obj) => obj.value) && (
                  <DonutPieChart
                    donutPieChartData={donutPieChartData}
                    userGender={userPreferences.userGender}
                    salahStatusStatistics={salahStatusStatistics}
                  />
                )}
                {statsPeriod === "monthly" && <Calendar
                  dbConnection={dbConnection}
                  fetchedSalahData={fetchedSalahData}
                  statsToShow={statsToShow}
                  setClickedDate={setClickedDate}
                  clickedDate={clickedDate}
                  currentMonth={currentMonth}
                  userStartDateParsed={userStartDateParsed}
                  todaysDate={todaysDate}
                  formattedMonths={formattedMonths}
                />}
                {statsPeriod === "yearly" && (
                  <YearlyStats selectedYear={selectedYear} />
                )}
                {statsPeriod === "overall" && (
                  <section className="mt-5 text-center">
                    <p>Overall statistics will appear here.</p>
                  </section>
                )}
                <Swiper
                  className="mt-5"
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
                          salahReasonsOverallNumbers={
                            salahReasonsOverallNumbers
                          }
                          status={"male-alone"}
                          statsToShow={statsToShow}
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
                        statsToShow={statsToShow}
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
                        statsToShow={statsToShow}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
              </motion.section>
            </AnimatePresence>
            <BottomSheetReasons
              // triggerId="open-reasons-sheet"
              setShowReasonsSheet={setShowReasonsSheet}
              showReasonsSheet={showReasonsSheet}
              salahReasonsOverallNumbers={salahReasonsOverallNumbers}
              status={reasonsToShow}
            />
          </section>
        </motion.section>
      </IonContent>
    </IonPage>
  );
};

export default StatsPage;
