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

const CalenderPage = () => {
  const today = startOfToday(); // Wed Jan 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (this is an object)
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

  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  ); // Jan-2024 (this is a string)

  //   console.log(parsedCurrentMonth);

  const isDayInSpecificMonth = (dayToCheck: any, currentMonth: any) => {
    const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date()); // Returns Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (this is an object)

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
              //   <div key={index} className={colStartClasses[getDay(day)]}>
              <div key={index} className="">
                <p
                  className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-full  hover:text-white ${
                    // isSameMonth(day, today) ? "text-gray-900" : "text-gray-400"

                    isDayInSpecificMonth(day, currentMonth)
                      ? "text-gray-900"
                      : "text-gray-400"
                  } ${!isToday(day) && "hover:bg-blue-500"} ${
                    isToday(day) && "bg-red-500 text-white"
                  }`}
                >
                  {format(day, "d")}
                  {/* {format(day, "dd.MM.yy")} */}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalenderPage;
