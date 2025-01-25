import BottomSheetMissedPrayersList from "../components/BottomSheets/BottomSheetMissedPrayersList";
import PrayerTable from "../components/PrayerTable/PrayerTable";
import MissedSalahCounter from "../components/Stats/MissedSalahCounter";

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
}: HomePageProps) => {
  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<SelectedSalahAndDateObjType>({});
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

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
          {/* <div className={`w-[1.1rem] h-[1.1rem] rounded-md mr-2`}></div> */}
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
