import PrayerMainView from "../components/PrayerMainView/PrayerMainView";
import NextSalahTime from "../components/NextSalahTime";
import { salahTrackingEntryType } from "../types/types";

// import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

const HomePage = ({
  // title,
  setHeading,
  pageStyles,
  startDate,
  // setSalahObjects: setSalahObjects,
  setSalahTrackingArray,
  // salahTrackingArray: salahTrackingArray,
  salahTrackingArray,
  setCurrentWeek, // currentWeek,
}: {
  // title: React.ReactNode;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
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
  setHeading("Home");
  // const today: Date = new Date();
  // const startDate = subDays(today, currentStartDate);

  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}
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
