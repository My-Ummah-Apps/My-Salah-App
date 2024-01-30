import { useState, useEffect } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import CalenderMonthly from "../components/Calender/CalenderMonthly";
import CalenderYearly from "../components/Calender/CalenderYearly";

const CalenderPage = ({
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentStartDate,
  currentStartDate,
}) => {
  const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  const [showYearlyCalender, setShowYearlyCalender] = useState(false);
  const [startDate, setStartDate] = useState();

  function modifySingleDaySalah(date) {
    setStartDate(date);
    console.log("startDate", startDate);
  }

  return (
    <>
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
        <CalenderMonthly
          setSalahTrackingArray={setSalahTrackingArray}
          salahTrackingArray={salahTrackingArray}
          setStartDate={setStartDate}
          startDate={startDate}
          setCurrentStartDate={setCurrentStartDate}
          currentStartDate={currentStartDate}
          modifySingleDaySalah={modifySingleDaySalah}
        />
      ) : (
        <CalenderYearly
          setSalahTrackingArray={setSalahTrackingArray}
          salahTrackingArray={salahTrackingArray}
          setCurrentStartDate={setCurrentStartDate}
          currentStartDate={currentStartDate}
          setStartDate={setStartDate}
          startDate={startDate}
          modifySingleDaySalah={modifySingleDaySalah}
        />
      )}
    </>
  );
};

export default CalenderPage;
