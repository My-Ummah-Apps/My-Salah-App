import { useState } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import HabitsView from "../PrayerMainView/PrayerMainView";
import Modal from "../Calender/Modal";
import ReactModal from "react-modal";

import {
  add,
  sub,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfYear,
  startOfWeek,
  startOfISOWeek,
  startOfMonth,
  eachMonthOfInterval,
  endOfYear,
  addMonths,
} from "date-fns";

const CalenderYearly = ({
  setSalahObjects,
  salahObjects,
  setCurrentStartDate,
  currentStartDate,
}) => {
  const today = startOfToday(); // Wed Jan 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  //   const days = [""];
  const colStartClasses = [
    // "",
    // "col-start-2",
    // "col-start-3",
    // "col-start-4",
    // "col-start-5",
    // "col-start-6",
    // "col-start-7",
  ];

  const [showModal, setShowModal] = useState(false);

  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  ); // Jan-2024 (string)

  const [currentYear, setCurrentYear] = useState(new Date()); // Returns current year in yyyy format
  console.log(currentYear);

  const monthsInYear = eachMonthOfInterval({
    start: startOfYear(currentYear),
    end: endOfYear(currentYear),
  });
  // let startDate;
  const [startDate, setStartDate] = useState();
  function modifySingleDaySalah(date) {
    setStartDate(date);
    console.log("startDate", startDate);
    setShowModal(true);
  }

  const monthStrings = monthsInYear.map((month) => format(month, "MMM-yyyy"));

  // console.log(monthStrings);

  let dateColor: string;

  let datesArray = [];
  const allDatesArray = salahObjects.reduce((value, salah) => {
    salah.completedDates.forEach((item) => {
      datesArray.push(Object.keys(item)[0]);
    });
    return datesArray;
  }, []);

  // console.log(allDatesArray);

  let dArray = [];

  const howManyDatesExist = (date: string) => {
    // allDatesArray.reduce((value, dateString) => {
    //   console.log(value);
    //   return value;
    // }, 0);

    let increment = 0;
    const sameDatesArray = allDatesArray.map((currentDate) => {
      if (currentDate === date) {
        dArray.push(date);
        increment = dArray.length;
      }

      return dArray;
    });

    let color;
    if (increment === 0) {
      // console.log("increment > 2");
      color = "red";
    } else if (increment > 0 && increment < 5) {
      // console.log("increment < 2");

      color = "orange";
    } else if (increment === 5) {
      // console.log("increment === 4");

      color = "green";
    } else {
      color = "yellow";
    }
    dArray = [];
    return color;
  };

  function doesDateExist(date) {
    return allDatesArray.includes(format(date, "dd.MM.yy"));
  }

  console.log("currentYear " + currentYear);
  console.log("currentMonth " + currentMonth);

  const isDayInSpecificMonth = (dayToCheck: any, currentMonth: any) => {
    const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  let firstDayOfMonth;
  const yearlyMonthsData = (month) => {
    // console.log(month);
    firstDayOfMonth = parse(month, "MMM-yyyy", new Date()); // Returns Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)
    //
    const daysInMonth = eachDayOfInterval({
      // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
      start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month

      end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
    }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
    return daysInMonth;
  };

  // console.log(yearlyMonthsData("Jun-2024"));

  return (
    <>
      <h1 className="pt-5 text-3xl yearly-text">Yearly</h1>
      <div className="flex items-center justify-center w-screen h-screen calender-wrap">
        <div className="w-[900px] h-[600px]">
          <div className="flex items-center justify-between chevrons-wrap">
            <div className="flex items-center gap-6 justify-evenly chevrons">
              <IoChevronBackSharp
                className="w-6 h-6 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentYear((prevYearValue) =>
                    sub(prevYearValue, { years: 1 })
                  );
                }}
              />
              <IoChevronForward
                className="w-6 h-6 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentYear((prevYearValue) =>
                    add(prevYearValue, { years: 1 })
                  );
                }}
              />
            </div>
          </div>
          <hr className="my-6" />

          <div>
            <div className="grid grid-cols-2 place-items-center dates-grid-wrap">
              {monthStrings.map((month) => (
                <div className="single-month-wrap">
                  <p className="mt-5 mb-2 text-xl font-semibold month-name-text">
                    {month}
                  </p>
                  <div
                    className="single-month-days-and-dates-wrap bg-[color:var(--card-bg-color)] p-2 rounded-lg shadow-md grid grid-cols-7 month-container"
                    key={month}
                  >
                    {days.map((day, index) => {
                      return (
                        <div
                          key={index}
                          className="font-semibold individual-day"
                        >
                          {day}
                        </div>
                      );
                    })}

                    {yearlyMonthsData(month).map((day, index) => (
                      <div
                        onClick={() => {
                          modifySingleDaySalah(day);
                        }}
                        key={index}
                        className="p-1 individual-date"
                      >
                        <p
                          style={{
                            backgroundColor: howManyDatesExist(
                              format(day, "dd.MM.yy")
                            ),
                          }}
                          className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-full hover:text-white ${
                            isDayInSpecificMonth(day, month)
                              ? "text-gray-900"
                              : "text-gray-400"
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
                    salahObjects={salahObjects}
                    setSalahObjects={setSalahObjects}
                    currentStartDate={currentStartDate}
                    startDate={startDate}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalenderYearly;
