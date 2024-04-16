import PrayerMainView from "../components/PrayerMainView/PrayerMainView";
// import NextSalahTime from "../components/NextSalahTime";
import { salahTrackingEntryType } from "../types/types";
import { useEffect } from "react";

// import { subDays } from "date-fns";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

const HomePage = ({
  // title,
  setHeading,
  userStartDate,
  pageStyles,
  startDate,
  // setSalahObjects: setSalahObjects,
  setSalahTrackingArray,
  // salahTrackingArray: salahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  currentWeek,
}: {
  // title: React.ReactNode;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  userStartDate: string;
  pageStyles: string;
  startDate: Date;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
  // currentStartDate: number;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  // currentWeek: number;
}) => {
  useEffect(() => {
    setHeading("Home");
  }, []);

  // const today: Date = new Date();
  // const startDate = subDays(today, currentStartDate);

  return (
    <section className={`home-page-wrap ${pageStyles}`}>
      {/* <section className={`home-page-wrap`}> */}
      {/* {title} */}
      {/* <NextSalahTime /> */}
      <PrayerMainView
        userStartDate={userStartDate}
        setSalahTrackingArray={setSalahTrackingArray}
        salahTrackingArray={salahTrackingArray}
        setCurrentWeek={setCurrentWeek}
        currentWeek={currentWeek}
        startDate={startDate}
      />
    </section>
  );
};

export default HomePage;
