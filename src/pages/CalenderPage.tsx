import { useState, useEffect } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import CalenderMonthly from "../components/Calender/CalenderMonthly";
import CalenderYearly from "../components/Calender/CalenderYearly";

const CalenderPage = ({ salahObjects }) => {
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
        <CalenderYearly salahObjects={salahObjects} />
      )}
    </>
  );
};

export default CalenderPage;
