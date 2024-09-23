import PrayerTable from "../components/PrayerTable/PrayerTable";
// import NextSalahTime from "../components/NextSalahTime";
import {
  SalahRecordsArray,
  DBConnectionStateType,
  userPreferences,
  CalenderSalahArray,
} from "../types/types";
import { useEffect } from "react";

// import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

interface HomePageProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  renderTable: boolean;
  setFetchedSalahData: React.Dispatch<React.SetStateAction<SalahRecordsArray>>;
  setCalendarData: React.Dispatch<React.SetStateAction<CalenderSalahArray>>;
  fetchedSalahData: any;
  handleSalahTrackingDataFromDB: (DBResultAllSalahData) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferences>>;
  userPreferences: userPreferences;
  // setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  // reasonsArray: string[];
  datesFromStartToToday: string[];
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
  setCalendarData,
  fetchedSalahData,
  handleSalahTrackingDataFromDB,
  setUserPreferences,
  userPreferences,
  // setReasonsArray,
  // reasonsArray,
  datesFromStartToToday,
  // userGender,
  setHeading,
  pageStyles,
}: HomePageProps) => {
  useEffect(() => {
    setHeading("Home");
  }, []);
  // console.log(
  //   "HOMEPAGE Component has rendered..., fetchedSalahData is: ",
  //   fetchedSalahData
  // );
  // setHeading("Home");

  // const today: Date = new Date();
  // const startDate = subDays(today, currentStartDate);

  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}

      {/* {fetchedSalahData.length > 0 && ( */}
      {/* <div>Loading Data...</div> */}
      {/* {renderTable && ( */}
      {/* {fetchedSalahData.length > 0 && ( */}
      <PrayerTable
        dbConnection={dbConnection}
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        renderTable={renderTable}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        datesFromStartToToday={datesFromStartToToday}
        setFetchedSalahData={setFetchedSalahData}
        fetchedSalahData={fetchedSalahData}
        setCalendarData={setCalendarData}
        handleSalahTrackingDataFromDB={handleSalahTrackingDataFromDB}
      />
      {/* // )} */}

      {/* )} */}
    </section>
  );
};

export default HomePage;
