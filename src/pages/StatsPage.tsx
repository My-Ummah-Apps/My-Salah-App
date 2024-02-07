import { useState } from "react";
// import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { salahTrackingEntryType } from "../types/types";

import { format } from "date-fns";

import CalenderMonthly from "../components/Stats/CalenderMonthly";
import CalenderYearly from "../components/Stats/CalenderYearly";
import CalenderMonthlyPerPrayer from "../components/Stats/CalenderMonthly";

const StatsPage = ({
  setSalahTrackingArray,
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
  const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  const [showYearlyCalender, setShowYearlyCalender] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [currentMonthHeading, setcurrentMonthHeading] = useState<string>("");

  function modifySingleDaySalah(date: Date) {
    setStartDate(date);
  }

  return (
    <div className="calender-page-wrap">
      <button
        className="px-5"
        onClick={() => {
          setShowMonthlyCalender(true);
          setShowYearlyCalender(false);
        }}
      >
        Monthly
      </button>
      <button
        onClick={() => {
          setShowYearlyCalender(true);
          setShowMonthlyCalender(false);
        }}
      >
        Yearly
      </button>
      {showMonthlyCalender ? (
        <>
          {/* <CalenderMonthlyPerPrayer
            salahName={null}
            setSalahTrackingArray={setSalahTrackingArray}
            salahTrackingArray={salahTrackingArray}
            // setStartDate={setStartDate}
            startDate={startDate}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            modifySingleDaySalah={modifySingleDaySalah}
          /> */}
          <h1>{currentMonthHeading}</h1>
          <CalenderMonthlyPerPrayer
            salahName={"Fajr"}
            setSalahTrackingArray={setSalahTrackingArray}
            setcurrentMonthHeading={setcurrentMonthHeading}
            salahTrackingArray={salahTrackingArray}
            // setStartDate={setStartDate}
            startDate={startDate}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
          <CalenderMonthlyPerPrayer
            salahName={"Zohar"}
            setSalahTrackingArray={setSalahTrackingArray}
            setcurrentMonthHeading={setcurrentMonthHeading}
            salahTrackingArray={salahTrackingArray}
            // setStartDate={setStartDate}
            startDate={startDate}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
          <CalenderMonthlyPerPrayer
            salahName={"Asar"}
            setSalahTrackingArray={setSalahTrackingArray}
            setcurrentMonthHeading={setcurrentMonthHeading}
            salahTrackingArray={salahTrackingArray}
            // setStartDate={setStartDate}
            startDate={startDate}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
          <CalenderMonthlyPerPrayer
            salahName={"Maghrib"}
            setSalahTrackingArray={setSalahTrackingArray}
            setcurrentMonthHeading={setcurrentMonthHeading}
            salahTrackingArray={salahTrackingArray}
            // setStartDate={setStartDate}
            startDate={startDate}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
          <CalenderMonthlyPerPrayer
            salahName={"Isha"}
            setSalahTrackingArray={setSalahTrackingArray}
            setcurrentMonthHeading={setcurrentMonthHeading}
            salahTrackingArray={salahTrackingArray}
            // setStartDate={setStartDate}
            startDate={startDate}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
        </>
      ) : (
        showYearlyCalender && (
          <CalenderYearly
            setSalahTrackingArray={setSalahTrackingArray}
            salahTrackingArray={salahTrackingArray}
            setCurrentStartDate={setCurrentStartDate}
            currentStartDate={currentStartDate}
            // setStartDate={setStartDate}
            startDate={startDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
        )
      )}
    </div>
  );
};

export default StatsPage;
