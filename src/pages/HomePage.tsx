import MissedSalahsListBottomSheet from "../components/BottomSheets/BottomSheetMissedSalahsList";
import { motion } from "framer-motion";
import SalahTable from "../components/SalahTable/SalahTable";
import MissedSalahCounter from "../components/Stats/MissedSalahCounter";
import wreathLeft from "../assets/images/wreath-left.png";
import wreathRight from "../assets/images/wreath-right.png";
import { Dialog } from "@capacitor/dialog";

import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
  SalahByDateObjType,
  PreferenceType,
} from "../types/types";
import { useEffect, useRef, useState } from "react";
import { getMissedSalahCount, pageTransitionStyles } from "../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface HomePageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
  showJoyRideEditIcon: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  userPreferences: userPreferencesType;
  pageStyles: string;
  setShowMissedSalahsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedSalahsSheet: boolean;
  setMissedSalahList: React.Dispatch<React.SetStateAction<SalahByDateObjType>>;
  missedSalahList: SalahByDateObjType;
  setIsMultiEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMultiEditMode: boolean;
  activeStreakCount: number;
  generateStreaks: (fetchedSalahData: SalahRecordsArrayType) => void;
}

const HomePage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  modifyDataInUserPreferencesTable,
  setShowJoyRideEditIcon,
  showJoyRideEditIcon,
  setFetchedSalahData,
  fetchedSalahData,
  userPreferences,
  pageStyles,
  setShowMissedSalahsSheet,
  showMissedSalahsSheet,
  missedSalahList,
  setIsMultiEditMode,
  isMultiEditMode,
  activeStreakCount,
  generateStreaks,
}: HomePageProps) => {
  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<SalahByDateObjType>({});
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [animateStreakCounter, setAnimateStreakCounter] =
    useState<boolean>(false);
  const prevActiveStreakCount = useRef<number | undefined>();

  const showStreakInfoHomePage = async () => {
    await Dialog.alert({
      title: "Streaks Explained",
      message: `Your current streak shows how many consecutive days you've completed all your Salah, starting from the first day where all Salah have been prayed. ${
        userPreferences.userGender === "male"
          ? "If you miss a Salah or are late, the streak will reset."
          : "If you're late, the streak will reset, selecting 'Excused' will pause the streak, but won't break it."
      }`,
    });
  };

  useEffect(() => {
    console.log("Active streak count: ", activeStreakCount);
    console.log("prevActiveStreakCount: ", prevActiveStreakCount.current);

    // if (!prevActiveStreakCount.current) return;

    if (activeStreakCount > prevActiveStreakCount.current) {
      setAnimateStreakCounter(true);
      console.log("ANIMATION SET TO TRUE");
    }
    prevActiveStreakCount.current = activeStreakCount;
  }, [activeStreakCount]);

  return (
    <motion.section
      {...pageTransitionStyles}
      className={`${pageStyles} home-page-wrap`}
    >
      <header className="home-page-header">
        <section className="header-wrapper">
          {getMissedSalahCount(missedSalahList) > 0 &&
          userPreferences.showMissedSalahCount === "1" ? (
            <MissedSalahCounter
              setShowMissedSalahsSheet={setShowMissedSalahsSheet}
              isMultiEditMode={isMultiEditMode}
              missedSalahList={missedSalahList}
              modifyDataInUserPreferencesTable={
                modifyDataInUserPreferencesTable
              }
              userPreferences={userPreferences}
            />
          ) : null}

          <p className="home-page-header-p">{"Home"}</p>
          <div
            onClick={showStreakInfoHomePage}
            className={`absolute top-1/2 right-[-7px] py-1 -translate-y-1/2 flex items-center`}
          >
            <div className="relative flex items-center justify-center py-10 wreath-and-text-wrap">
              <img
                style={{ width: "30px", height: "100%", marginRight: "-2rem" }}
                src={wreathLeft}
                alt=""
                srcSet=""
              />
              <div className="absolute -translate-x-1/2 -translate-y-[55%] top-[55%] left-1/2">
                <motion.p
                  initial={{ scale: 1 }}
                  {...(animateStreakCounter
                    ? {
                        animate: { scale: [1, 2, 1] },
                        transition: {
                          duration: 0.3,
                          delay: 0.3,
                          ease: "easeOut",
                        },
                      }
                    : {})}
                  className="mb-1 text-xs font-extrabold text-center"
                  onAnimationComplete={() => {
                    setAnimateStreakCounter(false);
                    // clonedSelectedSalahAndDate.current = {};
                  }}
                >
                  {activeStreakCount}
                </motion.p>
              </div>
              <img
                style={{ width: "30px", height: "100%", marginLeft: "2rem" }}
                src={wreathRight}
                alt=""
                srcSet=""
              />
            </div>
          </div>
          {/* <div
            className="missed-salah-counter absolute top-1/2 right-0 w-10 py-1 -translate-y-1/2 flex justify-between items-center bg-[#252525] rounded-lg"
            onClick={() => {}}
          >
            <div className={`w-[1.1rem] h-[1.1rem] rounded-md flex`}>
              {" "}
              <img
                style={{ width: "40px", height: "100%", marginRight: "0rem" }}
                src={wreathLeft}
                alt=""
                srcSet=""
              />
              <img
                style={{ width: "40px", height: "100%", marginLeft: "-0.5rem" }}
                src={wreathRight}
                alt=""
                srcSet=""
              />
            </div>
            <p className="text-xs">{getMissedSalahCount(missedSalahList)}</p>
          </div> */}
          {/* <StreakCount styles={{ backgroundColor: "grey" }} /> */}
        </section>
      </header>
      <section className="home-page-components-wrap">
        {/* <header className="home-page-header">
          <p>Home</p>
        </header> */}

        <SalahTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
          setShowJoyRideEditIcon={setShowJoyRideEditIcon}
          showJoyRideEditIcon={showJoyRideEditIcon}
          userPreferences={userPreferences}
          setFetchedSalahData={setFetchedSalahData}
          fetchedSalahData={fetchedSalahData}
          setSelectedSalahAndDate={setSelectedSalahAndDate}
          selectedSalahAndDate={selectedSalahAndDate}
          setIsMultiEditMode={setIsMultiEditMode}
          isMultiEditMode={isMultiEditMode}
          setShowUpdateStatusModal={setShowUpdateStatusModal}
          showUpdateStatusModal={showUpdateStatusModal}
          generateStreaks={generateStreaks}
        />

        <MissedSalahsListBottomSheet
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          setFetchedSalahData={setFetchedSalahData}
          fetchedSalahData={fetchedSalahData}
          setShowMissedSalahsSheet={setShowMissedSalahsSheet}
          showMissedSalahsSheet={showMissedSalahsSheet}
          missedSalahList={missedSalahList}
          // setSelectedSalahAndDate={setSelectedSalahAndDate}
          // setShowUpdateStatusModal={setShowUpdateStatusModal}
        />
      </section>
    </motion.section>
  );
};

export default HomePage;
