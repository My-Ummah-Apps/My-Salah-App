import { useState, useEffect } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import CalenderMonthly from "../components/CalenderMonthly";
import CalenderYearly from "../components/CalenderYearly";

const CalenderPage = ({ salahObjects }) => {
  const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  const [showYearlyCalender, setShowYearlyCalender] = useState(false);

  return (
    <>
      <button
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
        <CalenderYearly />
      )}
    </>
  );
};

export default CalenderPage;
