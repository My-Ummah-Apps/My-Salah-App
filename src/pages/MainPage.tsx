import { Link } from "react-router-dom";
import PrayerMainView from "../components/PrayerMainView/PrayerMainView";
import NextSalahTime from "../components/NextSalahTime";
import { MdCalendarMonth } from "react-icons/md";
import CalenderPage from "./CalenderPage";
import { parse, subDays } from "date-fns";

const MainPage = ({
  setSalahObjects: setSalahObjects,
  salahObjects: salahObjects,
  setCurrentStartDate,
  currentStartDate,
}) => {
  const today = new Date();
  const startDate = subDays(today, currentStartDate);
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
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
        setCurrentStartDate={setCurrentStartDate}
        currentStartDate={currentStartDate}
        startDate={startDate}
      />
    </div>
  );
};

export default MainPage;
