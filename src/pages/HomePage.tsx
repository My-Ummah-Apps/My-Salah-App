import PrayerTable from "../components/PrayerTable/PrayerTable";
import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
  MissedSalahObjType,
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
  setMissedSalahList: React.Dispatch<React.SetStateAction<MissedSalahObjType>>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
}

const HomePage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  renderTable,
  setFetchedSalahData,
  fetchedSalahData,
  setUserPreferences,
  userPreferences,
  setMissedSalahList,
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
          setMissedSalahList={setMissedSalahList}
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
