// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { salahTrackingEntryType } from "../types/types";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";

// import CalenderYearly from "../components/Stats/CalenderYearly";
// import CalenderMonthly from "../components/Stats/CalenderMonthly";

import CalenderYearly from "../components/Stats/CalenderYearly";

const StatsPage = ({
  // title,
  setHeading,
  pageStyles,
  startDate,
  setSalahTrackingArray,
  salahTrackingArray,
  // setCurrentStartDate,
  // currentStartDate,
  setCurrentWeek,
  currentWeek,
}: {
  // title: React.ReactNode;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
  startDate: Date;
  // setCurrentStartDate: React.Dispatch<React.SetStateAction<number>>;
  // currentStartDate: number;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
}) => {
  console.log("STATS PAGE RENDERED");
  // const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  // const [showYearlyCalender, setShowYearlyCalender] = useState(false);
  // const [startDate, setStartDate] = useState<Date>(new Date());
  // const [currentMonthHeading, setCurrentMonthHeading] = useState<string>("");

  // function modifySingleDaySalah(date: Date) {
  //   setStartDate(date);
  // }
  setHeading("Stats");
  return (
    <section className={`${pageStyles} settings-page-wrap`}>
      {/* {title} */}
      <CalenderYearly
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        startDate={startDate}
        setCurrentWeek={setCurrentWeek}
        currentWeek={currentWeek}
      />{" "}
    </section>
  );
};

export default StatsPage;
