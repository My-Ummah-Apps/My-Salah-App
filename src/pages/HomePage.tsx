import BottomSheetMissedPrayersList from "../components/BottomSheets/BottomSheetMissedPrayersList";
import PrayerTable from "../components/PrayerTable/PrayerTable";
import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
  MissedSalahObjType,
  SelectedSalahAndDateObjType,
  PreferenceType,
} from "../types/types";
import { useEffect, useState } from "react";

interface HomePageProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  modifyDataInUserPreferencesTable: (
    value: string,
    preference: PreferenceType
  ) => Promise<void>;
  renderTable: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
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
  renderTable,
  setFetchedSalahData,
  fetchedSalahData,
  setUserPreferences,
  userPreferences,
  setHeading,
  pageStyles,
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  setMissedSalahList,
  missedSalahList,
  setIsMultiEditMode,
  isMultiEditMode,
}: HomePageProps) => {
  useEffect(() => {
    setHeading("Home");
  }, []);

  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<SelectedSalahAndDateObjType>({});
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  // TODO: The below conditional shouldn't be needed
  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}

      {renderTable ? (
        <PrayerTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
          renderTable={renderTable}
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
      ) : (
        <div>Loading Data...</div>
      )}
      {/* )} */}
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
  );
};

export default HomePage;
