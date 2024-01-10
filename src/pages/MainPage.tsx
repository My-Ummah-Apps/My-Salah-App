import { Link } from "react-router-dom";
import HabitsView from "../components/HabitsView";
import NextSalahTime from "../components/NextSalahTime";
import { MdCalendarMonth } from "react-icons/md";
import CalenderPage from "./CalenderPage";

const MainPage = ({
  setSalahObjects: setSalahObjects,
  salahObjects: salahObjects,
}) => {
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
      <HabitsView
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
      />
    </div>
  );
};

export default MainPage;
