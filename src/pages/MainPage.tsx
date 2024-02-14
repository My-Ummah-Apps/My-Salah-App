import PrayerMainView from "../components/PrayerMainView/PrayerMainView";
import NextSalahTime from "../components/NextSalahTime";
import { salahTrackingEntryType } from "../types/types";

// import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

const MainPage = ({
  startDate,
  // setSalahObjects: setSalahObjects,
  setSalahTrackingArray,
  // salahTrackingArray: salahTrackingArray,
  salahTrackingArray,
  setCurrentWeek, // currentWeek,
}: {
  startDate: Date;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  // currentStartDate: number;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  // currentWeek: number;
}) => {
  // const today: Date = new Date();
  // const startDate = subDays(today, currentStartDate);

  return (
    <div className="overflow-x-auto w-5/5 main-page-wrap">
      <NextSalahTime />
      <PrayerMainView
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        setCurrentWeek={setCurrentWeek}
        startDate={startDate}
      />
    </div>
  );
};

export default MainPage;
