import PrayerTable from "../components/PrayerTable/PrayerTable";
import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
  DBResultDataObjType,
} from "../types/types";
import { useEffect } from "react";

interface HomePageProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  renderTable: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  handleSalahTrackingDataFromDB: (
    DBResultAllSalahData: DBResultDataObjType[]
  ) => Promise<void>;

  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  // setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  // reasonsArray: string[];
  // userGender: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  // userStartDate: string;
  pageStyles: string;
}

const HomePage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  renderTable,
  setFetchedSalahData,
  fetchedSalahData,
  handleSalahTrackingDataFromDB,
  setUserPreferences,
  userPreferences,
  setHeading,
  pageStyles,
}: HomePageProps) => {
  useEffect(() => {
    setHeading("Home");
  }, []);
  // TODO: The below conditional shouldn't be needed
  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}

      {renderTable ? (
        <PrayerTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          renderTable={renderTable}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
          handleSalahTrackingDataFromDB={handleSalahTrackingDataFromDB}
          setFetchedSalahData={setFetchedSalahData}
          fetchedSalahData={fetchedSalahData}
        />
      ) : (
        <div>Loading Data...</div>
      )}
      {/* )} */}
    </section>
  );
};

export default HomePage;
