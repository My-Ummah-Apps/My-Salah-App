// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { salahTrackingEntryType } from "../types/types";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";

// import CalenderYearly from "../components/Stats/CalenderYearly";
// import CalenderMonthly from "../components/Stats/CalenderMonthly";
import Calender from "../components/Stats/Calender";

const StatsPage = ({
  title,
  startDate,
  setSalahTrackingArray,
  salahTrackingArray,
  // setCurrentStartDate,
  // currentStartDate,
  setCurrentWeek,
  currentWeek,
}: {
  title: React.ReactNode;
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

  return (
    <>
      <h1>{title}</h1>
      <Calender
        // setCurrentMonthHeading={setCurrentMonthHeading}
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        // setStartDate={setStartDate}
        startDate={startDate}
        setCurrentWeek={setCurrentWeek}
        currentWeek={currentWeek}
        // modifySingleDaySalah={modifySingleDaySalah}
      />{" "}
    </>
  );
};

export default StatsPage;
