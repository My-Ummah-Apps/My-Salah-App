import PrayerTable from "../components/PrayerTable/PrayerTable";
// import NextSalahTime from "../components/NextSalahTime";
import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
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
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
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
  setUserPreferences,
  userPreferences,
  // setReasonsArray,
  // reasonsArray,
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

      {renderTable ? (
        <PrayerTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          renderTable={renderTable}
          setUserPreferences={setUserPreferences}
          userPreferences={userPreferences}
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
