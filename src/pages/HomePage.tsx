import PrayerTable from "../components/PrayerTable/PrayerTable";
// import NextSalahTime from "../components/NextSalahTime";
import { SalahRecordsArray, DBConnectionStateType } from "../types/types";
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
  fetchCalendarData: () => Promise<void>;
  setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  reasonsArray: string[];
  datesFromStartToToday: string[];
  userGender: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  userStartDate: string;
  pageStyles: string;
}

const HomePage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  renderTable,
  setTableData,
  tableData,
  fetchCalendarData,
  setReasonsArray,
  reasonsArray,
  datesFromStartToToday,
  userGender,
  setHeading,
  pageStyles,
}: HomePageProps) => {
  useEffect(() => {
    setHeading("Home");
  }, []);

  // setHeading("Home");

  // const today: Date = new Date();
  // const startDate = subDays(today, currentStartDate);

  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}
      {/* <NextSalahTime /> */}
      <PrayerTable
        dbConnection={dbConnection}
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        renderTable={renderTable}
        setReasonsArray={setReasonsArray}
        reasonsArray={reasonsArray}
        datesFromStartToToday={datesFromStartToToday}
        setTableData={setTableData}
        tableData={tableData}
        fetchCalendarData={fetchCalendarData}
        userGender={userGender}
        // userStartDate={userStartDate}
        // startDate={startDate}
      />
    </section>
  );
};

export default HomePage;
