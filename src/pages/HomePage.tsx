import PrayerTable from "../components/PrayerTable/PrayerTable";
// import NextSalahTime from "../components/NextSalahTime";
import { salahTrackingEntryType } from "../types/types";
import { useEffect } from "react";

// import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

const HomePage = ({
  dbConnection,
  renderTable,
  setData,
  data,
  datesFormatted,
  // title,
  fetchSalahTrackingDataFromDB,
  userGender,
  setHeading,
  userStartDate,
  pageStyles,
  startDate,
  // setSalahObjects: setSalahObjects,
  setSalahTrackingArray,
  // salahTrackingArray: salahTrackingArray,
  salahTrackingArray, // setCurrentWeek,
} // currentWeek,
: {
  dbConnection: any;
  renderTable: boolean;
  setData: React.Dispatch<any>;
  data: any;
  datesFormatted: string[];
  fetchSalahTrackingDataFromDB: (
    startIndex: number,
    endIndex: number
  ) => Promise<any>;
  // title: React.ReactNode;
  userGender: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  userStartDate: string;
  pageStyles: string;
  startDate: Date;

  // currentStartDate: number;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
}) => {
  useEffect(() => {
    setHeading("Home");
  }, []);

  console.log("USERGENDER: ", userGender);

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
        renderTable={renderTable}
        fetchSalahTrackingDataFromDB={fetchSalahTrackingDataFromDB}
        datesFormatted={datesFormatted}
        setData={setData}
        data={data}
        userGender={userGender}
        userStartDate={userStartDate}
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        // setCurrentWeek={setCurrentWeek}
        // currentWeek={currentWeek}
        startDate={startDate}
      />
    </section>
  );
};

export default HomePage;
