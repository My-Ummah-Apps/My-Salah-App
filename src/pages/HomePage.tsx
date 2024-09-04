import PrayerTable from "../components/PrayerTable/PrayerTable";
// import NextSalahTime from "../components/NextSalahTime";
import {
  SalahRecordsArray,
  DBConnectionStateType,
  userPreferences,
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
  setTableData: React.Dispatch<React.SetStateAction<SalahRecordsArray>>;
  tableData: any;
  handleCalendarData: () => Promise<void>;
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
  setTableData,
  tableData,
  handleCalendarData,
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
  console.log("HOMEPAGE Component has rendered...");
  // setHeading("Home");

  // const today: Date = new Date();
  // const startDate = subDays(today, currentStartDate);

  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}

      {/* {tableData.length > 0 && ( */}
      {/* <div>Loading Data...</div> */}
      {/* {tableData.length > 0 && ( */}
      {tableData.length > 0 && (
        <PrayerTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          renderTable={renderTable}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
          // setReasonsArray={setReasonsArray}
          // reasonsArray={reasonsArray}
          datesFromStartToToday={datesFromStartToToday}
          setTableData={setTableData}
          tableData={tableData}
          handleCalendarData={handleCalendarData}
          // userGender={userGender}
          // userStartDate={userStartDate}
          // startDate={startDate}
        />
      )}

      {/* )} */}
    </section>
  );
};

export default HomePage;
