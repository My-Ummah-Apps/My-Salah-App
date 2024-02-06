import { Link } from "react-router-dom";
import PrayerMainView from "../components/PrayerMainView/PrayerMainView";
import NextSalahTime from "../components/NextSalahTime";
import { salahTrackingEntryType } from "../types/types";

import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

const MainPage = ({
  // setSalahObjects: setSalahObjects,
  setSalahTrackingArray,
  // salahTrackingArray: salahTrackingArray,
  salahTrackingArray,
  setCurrentStartDate,
  currentStartDate,
}: {
  setCurrentStartDate: React.Dispatch<React.SetStateAction<number>>;
  currentStartDate: number;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
}) => {
  console.log(currentStartDate);
  const today: Date = new Date();
  const startDate = subDays(today, currentStartDate);
  console.log(startDate);
  return (
    <div className="overflow-x-auto w-5/5 main-page-wrap">
      <Link to="/CalenderPage">Calender</Link>
      {/* <Link
        onClick={() => {
          //   setActivePage("counters");
        }}
        className="nav-link px-3 py-1.5 pt-0.5"
        to="/CalenderPage"
      >
        <MdCalendarMonth
          className="text-2xl nav-icon"
          //   color={activePage == "counters" ? activeBackgroundColor : "grey"}
        />
      </Link> */}
      <NextSalahTime />
      <PrayerMainView
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        setCurrentStartDate={setCurrentStartDate}
        // currentStartDate={currentStartDate}
        startDate={startDate}
      />
    </div>
  );
};

export default MainPage;
