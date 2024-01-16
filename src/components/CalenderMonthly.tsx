import { useState, useEffect } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  startOfISOWeek,
  startOfMonth,
} from "date-fns";

const CalenderMonthly = ({ salahObjects }) => {
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

  // console.log(howManyDatesExist("31.01.24"));

  function doesDateExist(date) {
    return allDatesArray.includes(format(date, "dd.MM.yy"));
  }

  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  ); // Jan-2024 (string)

  const isDayInSpecificMonth = (dayToCheck: any, currentMonth: any) => {
    const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date()); // Returns Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)

  const daysInMonth = eachDayOfInterval({
    // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month

    end: endOfWeek(endOfMonth(firstDayOfMonth)), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
  }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)

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

  return (
    <>
      <h1 className="pt-5 text-3xl">Monthly</h1>
      <div className="flex items-center justify-center w-screen h-screen p-8">
        <div className="w-[900px] h-[600px]">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">
              {format(firstDayOfMonth, "MMMM yyyy")}
            </p>
            <div className="flex items-center gap-6 justify-evenly sm:gap-12">
              <IoChevronBackSharp
                className="w-6 h-6 cursor-pointer"
                onClick={getPrevMonth}
              />
              <IoChevronForward
                className="w-6 h-6 cursor-pointer"
                onClick={getNextMonth}
              />
            </div>
          </div>
          <hr className="my-6" />
          <div className="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
            {days.map((day, index) => {
              return (
                <div key={index} className="font-semibold">
                  {/* {capitalizeFirstLetter(day)} */}
                  {day}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 gap-6 mt-8 sm:gap-12 place-items-center">
            {daysInMonth.map((day, index) => {
              return (
                <div key={index} className="">
                  <p
                    style={{
                      backgroundColor: howManyDatesExist(
                        format(day, "dd.MM.yy")
                      ),
                    }}
                    className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-full  hover:text-white ${
                      // isSameMonth(day, today) ? "text-gray-900" : "text-gray-400"

                      isDayInSpecificMonth(day, currentMonth)
                        ? "text-gray-900"
                        : "text-gray-400"
                    } 

                    `}
                  >
                    {format(day, "d")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalenderMonthly;

//   ${isToday(day) && "bg-red-500 text-white"}
// ${!isToday(day) && "hover:bg-blue-500"}
