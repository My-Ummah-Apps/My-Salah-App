import { useState } from "react";
import { salahTrackingEntryType } from "../../types/types";
import CalenderMonthly from "./CalenderMonthly";
import Modal from "./Modal";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import {
  add,
  sub,
  format,
  parse,
  startOfToday,
  startOfMonth,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfYear,
  startOfWeek,
  eachMonthOfInterval,
  endOfYear,
} from "date-fns";

const CalenderYearly = ({
  // setShowCalenderOneMonth,
  showCalenderOneMonth,
  setSalahTrackingArray,
  salahTrackingArray,
  startDate,
  setCurrentWeek,
  currentWeek,
}: {
  // setShowCalenderOneMonth: React.Dispatch<React.SetStateAction<boolean>>;
  showCalenderOneMonth: boolean;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
  //   modifySingleDaySalah: (date: Date) => void;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
}) => {
  const [showMonthlyCalender, setShowMonthlyCalender] = useState(false);
  const [showYearlyCalender, setShowYearlyCalender] = useState(true);

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
    console.log("getPrevMonth triggered");
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 }); // Take the first day of the month, and substract one month from it, example: if firstDayOfMonth represents March 1st, 2023, this line of code would calculate February 1st, 2023.
    setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    console.log("getNextMonth triggered");
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

  const [showModal, setShowModal] = useState(false);
  console.log(currentYear);
  const monthsInYear = eachMonthOfInterval({
    start: startOfYear(currentYear),
    end: endOfYear(currentYear),
  });

  const monthStrings = monthsInYear.map((month) => format(month, "MMM-yyyy"));

  let firstDayOfMonth1;
  const yearlyMonthsData = (month: string) => {
    firstDayOfMonth1 = parse(month, "MMM-yyyy", new Date()); // Returns Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)
    //
    const daysInMonth = eachDayOfInterval({
      // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
      start: startOfWeek(firstDayOfMonth1, { weekStartsOn: 1 }), // Gives first day of month

      end: endOfWeek(endOfMonth(firstDayOfMonth1), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
    }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
    return daysInMonth;
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
      <>
        <div className="flex items-center justify-center calender-wrap">
          <div className="flex items-center justify-between chevrons-wrap"></div>
          <div className="flex w-full overflow-scroll months-wrap">
            {monthStrings.map((month) => (
              <div className="bg-[color:var(--card-bg-color)] flex-column card-wrap rounded-2xl box-shadow: 0 25px 50px -12px rgb(31, 35, 36) single-month-wrap p-2">
                <p className="py-4 font-semibold text-center">{month}</p>
                <div className="grid grid-cols-7 mb-3 place-items-center days-row-wrap">
                  {days.map((day, index) => {
                    return (
                      <div
                        key={index}
                        className="w-5 h-5 text-xs font-semibold individual-day"
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div
                  className="grid grid-cols-7 place-items-center month-dates-wrap"
                  key={month}
                >
                  {yearlyMonthsData(month).map((day, index) => (
                    <div
                      onClick={() => {
                        modifySingleDaySalah(day);
                        setShowModal(true);
                      }}
                      key={index}
                      className="individual-date"
                    >
                      <p
                        style={{
                          backgroundColor: countCompletedDates(
                            format(day, "dd.MM.yy")
                          ),
                        }}
                        className={`text-xs cursor-pointer flex items-center justify-center font-semibold h-5 w-5 rounded-md  hover:text-white  ${
                          isDayInSpecificMonth(day, month)
                            ? "text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {format(day, "d")}
                      </p>
                    </div>
                  ))}
                </div>
                <Modal
                  setShowModal={setShowModal}
                  showModal={showModal}
                  salahTrackingArray={salahTrackingArray}
                  setSalahTrackingArray={setSalahTrackingArray}
                  setCurrentWeek={setCurrentWeek}
                  currentWeek={currentWeek}
                  startDate={startDate}
                />
              </div>
            ))}
          </div>
        </div>
      </>
    </div>
  );
};

export default CalenderYearly;
