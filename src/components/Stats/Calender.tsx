import { useState } from "react";
import { salahTrackingEntryType } from "../../types/types";
import CalenderMonthly from "./CalenderMonthly";
import CalenderYearly from "./CalenderYearly";

import {
  add,
  sub,
  format,
  parse,
  startOfToday,
  startOfMonth,
  differenceInDays,
} from "date-fns";

import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";

const Calender = ({
  setSalahTrackingArray,
  salahTrackingArray,
  startDate,
  setCurrentWeek,
  currentWeek,
}: {
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;

  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
  //   modifySingleDaySalah: (date: Date) => void;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
}) => {
  console.log(salahTrackingArray);
  const [showMonthlyCalender, setShowMonthlyCalender] = useState(true);
  const [showYearlyCalender, setShowYearlyCalender] = useState(false);

  const [currentYear, setCurrentYear] = useState(new Date());

  const today = startOfToday(); // Will return todays date details
  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  ); // Jan-2024 (string)

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  function modifySingleDaySalah(date: Date) {
    const today: Date = new Date();
    setCurrentWeek(
      today > date
        ? differenceInDays(today, date)
        : differenceInDays(today, date) - 1
    );
    // setCurrentWeek(differenceInDays(today, date) - 1);
  }

  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const isDayInSpecificMonth = (dayToCheck: Date, currentMonth: string) => {
    const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 }); // Take the first day of the month, and substract one month from it, example: if firstDayOfMonth represents March 1st, 2023, this line of code would calculate February 1st, 2023.
    setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  };

  // const allDatesWithinSalahTrackingArray = salahTrackingArray.reduce<string[]>(
  //   (accumulatorArray, salah) => {
  //     salah.completedDates.forEach((item) => {
  //       accumulatorArray.push(Object.keys(item)[0]);
  //     });
  //     return accumulatorArray;
  //   },
  //   []
  // );
  // Need to modify the below so depending on the month being rendered, it either shows the overall statuses for each date for every salah or shows the status for the particular date for one salah only
  const countCompletedDates = (date: string, salahName?: string) => {
    const allDatesWithinSalahTrackingArray = salahTrackingArray.reduce<
      string[]
    >((accumulatorArray, salah) => {
      if (salah.salahName === salahName) {
        salah.completedDates.forEach((item) => {
          accumulatorArray.push(Object.keys(item)[0]);
        });
      } else if (!salahName) {
        salah.completedDates.forEach((item) => {
          accumulatorArray.push(Object.keys(item)[0]);
        });
      }
      return accumulatorArray;
    }, []);

    let sameDatesArray = allDatesWithinSalahTrackingArray.filter(
      (currentDate) => currentDate === date
    );

    let sameDatesArrayLength = sameDatesArray.length;

    let color;

    if (salahName) {
      if (sameDatesArrayLength === 0) {
        color = "transparent";
      } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
        color = "green";
      }
    } else if (!salahName) {
      if (sameDatesArrayLength === 0) {
        color = "transparent";
      } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
        color = "orange";
      } else if (sameDatesArrayLength === 5) {
        color = "green";
      }
    }

    sameDatesArray = [];
    return color;
  };

  return (
    <div className="calender-page-wrap">
      <div className="sticky flex justify-around mb-10 calender-component-header">
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
      <div className="text-center mb-9 monthly-yearly-btn-wrap">
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
      </div>
      {showMonthlyCalender ? (
        <>
          {salahTrackingArray.map((salah) => (
            <CalenderMonthly
              salahName={salah.salahName}
              days={days}
              currentMonth={currentMonth}
              isDayInSpecificMonth={isDayInSpecificMonth}
              // salahName={salah.salahName}
              countCompletedDates={countCompletedDates}
              setSalahTrackingArray={setSalahTrackingArray}
              salahTrackingArray={salahTrackingArray}
              startDate={startDate}
              setCurrentWeek={setCurrentWeek}
              currentWeek={currentWeek}
              modifySingleDaySalah={modifySingleDaySalah}
            />
          ))}
        </>
      ) : (
        showYearlyCalender && (
          <CalenderYearly
            days={days}
            isDayInSpecificMonth={isDayInSpecificMonth}
            currentYear={currentYear}
            countCompletedDates={countCompletedDates}
            salahName={"Overall"}
            setSalahTrackingArray={setSalahTrackingArray}
            salahTrackingArray={salahTrackingArray}
            setCurrentWeek={setCurrentWeek}
            currentWeek={currentWeek}
            startDate={startDate}
            modifySingleDaySalah={modifySingleDaySalah}
          />
        )
      )}
    </div>
  );
};

export default Calender;
