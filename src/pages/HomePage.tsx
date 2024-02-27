import PrayerMainView from "../components/PrayerMainView/PrayerMainView";
import NextSalahTime from "../components/NextSalahTime";
import { salahTrackingEntryType } from "../types/types";

// import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

const HomePage = ({
  title,
  pageStyles,
  startDate,
  // setSalahObjects: setSalahObjects,
  setSalahTrackingArray,
  // salahTrackingArray: salahTrackingArray,
  salahTrackingArray,
  setCurrentWeek, // currentWeek,
}: {
  title: React.ReactNode;
  pageStyles: string;
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
    <section className={`overflow-x-auto w-5/5 main-page-wrap ${pageStyles}`}>
      {title}
      <NextSalahTime />
      <PrayerMainView
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        setCurrentWeek={setCurrentWeek}
        startDate={startDate}
      />
    </section>
  );
};

export default HomePage;
