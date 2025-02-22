import BottomSheetMissedPrayersList from "../components/BottomSheets/BottomSheetMissedPrayersList";
import PrayerTable from "../components/PrayerTable/PrayerTable";
import MissedSalahCounter from "../components/Stats/MissedSalahCounter";
import wreathLeft from "/src/assets/icons/wreath-left.png";
import wreathRight from "/src/assets/icons/wreath-right.png";
import { Dialog } from "@capacitor/dialog";

import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
  MissedSalahObjType,
  SelectedSalahAndDateObjType,
  PreferenceType,
} from "../types/types";
import { useState } from "react";
import { getMissedSalahCount } from "../utils/constants";

interface HomePageProps {
  dbConnection: any;
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
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  pageStyles: string;
  setShowMissedPrayersSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedPrayersSheet: boolean;
  setMissedSalahList: React.Dispatch<React.SetStateAction<MissedSalahObjType>>;
  missedSalahList: MissedSalahObjType;
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
  setUserPreferences,
  userPreferences,
  pageStyles,
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  setMissedSalahList,
  missedSalahList,
  setIsMultiEditMode,
  isMultiEditMode,
  activeStreakCount,
  generateStreaks,
}: HomePageProps) => {
  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<SelectedSalahAndDateObjType>({});
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const showStreakInfoHomePage = async () => {
    await Dialog.alert({
      title: "Streaks Explained",
      message: `Your current streak shows how many consecutive days you've completed all your Salah, starting from the first day where all Salah have been prayed. ${
        userPreferences.userGender === "male"
          ? "If you miss a prayer or are late, the streak resets."
          : "If you're late, the streak will reset, selecting 'Excused' will pause the streak, but won't break it."
      }`,
    });
  };

  return (
    <section className={`${pageStyles} home-page-wrap`}>
      <header className="home-page-header">
        <section className="header-wrapper">
          {getMissedSalahCount(missedSalahList) > 0 &&
          userPreferences.showMissedSalahCount === "1" ? (
            <MissedSalahCounter
              setShowMissedPrayersSheet={setShowMissedPrayersSheet}
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
                <h1 className="mb-1 text-xs font-extrabold text-center">
                  {activeStreakCount}
                </h1>
              </div>
              <img
                style={{ width: "30px", height: "100%", marginLeft: "2rem" }}
                src={wreathRight}
                alt=""
                srcSet=""
              />
            </div>
          </div>
          {/* <StreakCount styles={{ backgroundColor: "grey" }} /> */}
        </section>
      </header>
      <section className="home-page-components-wrap">
        {/* <header className="home-page-header">
          <p>Home</p>
        </header> */}

        <PrayerTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
          setShowJoyRideEditIcon={setShowJoyRideEditIcon}
          showJoyRideEditIcon={showJoyRideEditIcon}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
          setMissedSalahList={setMissedSalahList}
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

        <BottomSheetMissedPrayersList
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          setFetchedSalahData={setFetchedSalahData}
          fetchedSalahData={fetchedSalahData}
          setShowMissedPrayersSheet={setShowMissedPrayersSheet}
          showMissedPrayersSheet={showMissedPrayersSheet}
          missedSalahList={missedSalahList}
          // setSelectedSalahAndDate={setSelectedSalahAndDate}
          // setShowUpdateStatusModal={setShowUpdateStatusModal}
        />
      </section>
    </section>
  );
};

export default HomePage;
