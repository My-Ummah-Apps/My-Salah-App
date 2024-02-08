import { useState } from "react";
import { salahTrackingEntryType } from "../../types/types";
import CalenderMonthly from "./CalenderMonthly";
import CalenderYearly from "./CalenderYearly";

import { add, sub, format, parse, startOfToday } from "date-fns";

import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";

const Calender = ({
  setSalahTrackingArray,
  salahTrackingArray,
  // setStartDate,
  //   startDate,
  modifySingleDaySalah,
  setCurrentStartDate,
  currentStartDate,
}: {
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;

  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
  modifySingleDaySalah: (date: Date) => void;
  setCurrentStartDate: React.Dispatch<React.SetStateAction<number>>;
  currentStartDate: number;
}) => {
  const today = startOfToday(); // Will return todays date details

  const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  const [showYearlyCalender, setShowYearlyCalender] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [currentYear, setCurrentYear] = useState(new Date());
  console.log(currentYear);
  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  ); // Jan-2024 (string)
  //   const [prevMonth, setPrevMonth] = useState("");
  //   const [nextMonth, setNextMonth] = useState("");
  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());
  //   const currentYear = "2024";

  const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 }); // Take the first day of the month, and substract one month from it, example: if firstDayOfMonth represents March 1st, 2023, this line of code would calculate February 1st, 2023.
    setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
    // setCurrentMonthHeading(format(firstDayOfMonth, "MMMM yyyy"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
    // setCurrentMonthHeading(format(firstDayOfMonth, "MMMM yyyy"));
  };

  //   console.log(
  //     setCurrentYear((prevYearValue) => sub(prevYearValue, { years: 1 }))
  //   );

  const calenderHeadings: string[] = [
    "Overall",
    "Zohar",
    "Asar",
    "Maghrib",
    "Isha",
  ];
  return (
    <div className="calender-page-wrap">
      <div className="flex justify-around mb-10">
        {" "}
        <IoChevronBackSharp
          className="w-6 h-6 cursor-pointer"
          onClick={
            showMonthlyCalender
              ? getPrevMonth
              : () =>
                  setCurrentYear((prevYearValue) =>
                    sub(prevYearValue, { years: 1 })
                  )
          }
        />
        <h1>
          {showMonthlyCalender ? currentMonth : format(currentYear, "yyyy")}
        </h1>
        <IoChevronForward
          className="w-6 h-6 cursor-pointer"
          onClick={
            showMonthlyCalender
              ? getNextMonth
              : () =>
                  setCurrentYear((prevYearValue) =>
                    add(prevYearValue, { years: 1 })
                  )
          }
        />
      </div>
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
          {calenderHeadings.map((heading) => (
            <CalenderMonthly
              currentMonth={currentMonth}
              salahName={heading}
              setSalahTrackingArray={setSalahTrackingArray}
              salahTrackingArray={salahTrackingArray}
              // setStartDate={setStartDate}
              startDate={startDate}
              setCurrentStartDate={setCurrentStartDate}
              currentStartDate={currentStartDate}
              modifySingleDaySalah={modifySingleDaySalah}
            />
          ))}
        </>
      ) : (
        showYearlyCalender && (
          <CalenderYearly
            setCurrentYear={setCurrentYear}
            currentYear={currentYear}
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

export default Calender;
