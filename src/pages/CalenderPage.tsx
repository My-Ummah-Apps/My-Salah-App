import { useState, useEffect } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import CalenderMonthly from "../components/Calender/CalenderMonthly";
import CalenderYearly from "../components/Calender/CalenderYearly";

const CalenderPage = ({
  setSalahObjects,
  salahObjects,
  setCurrentStartDate,
  currentStartDate,
}) => {
  const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  const [showYearlyCalender, setShowYearlyCalender] = useState(false);

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
        <CalenderMonthly salahObjects={salahObjects} />
      ) : (
        <CalenderYearly
          setSalahObjects={setSalahObjects}
          salahObjects={salahObjects}
          setCurrentStartDate={setCurrentStartDate}
          currentStartDate={currentStartDate}
        />
      )}
    </>
  );
};

export default CalenderPage;
