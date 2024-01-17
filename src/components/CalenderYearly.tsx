import { useState } from "react";
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
  startOfYear,
  startOfWeek,
  startOfISOWeek,
  startOfMonth,
  eachMonthOfInterval,
  endOfYear,
} from "date-fns";

const CalenderYearly = ({ salahObjects }) => {
  //   const today = startOfToday(); // Todays date, example: Wed Jan 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)
  const today = startOfYear(new Date());
  const formattedYear = format(today, "yyyy");
  //   console.log(today);

  const [currentYear, setCurrentYear] = useState();

  //   console.log(format(getMonthsForYear(2023), "MMM-yyyy"));

  //   setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"))

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const colStartClasses = [
    // "",
    // "col-start-2",
    // "col-start-3",
    // "col-start-4",
    // "col-start-5",
    // "col-start-6",
    // "col-start-7",
  ];

  let datesArray = [];
  const allDatesArray = salahObjects.reduce((value, salah) => {
    salah.completedDates.forEach((item) => {
      datesArray.push(Object.keys(item)[0]);
    });
    return datesArray;
  }, []);

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

    let dateColor: string;
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

  const getAllDatesInMonth = (monthString) => {
    // const monthDate = parse(monthString, "MMM-yyyy", new Date());
    const monthDate = new Date(monthString);
    // console.log(monthString);

    const startOfMonthDate = startOfMonth(monthDate);
    const endOfMonthDate = endOfMonth(monthDate);

    // Get all dates of the month
    const datesOfMonth = eachDayOfInterval({
      start: startOfMonthDate,
      end: endOfMonthDate,
    });
    // console.log(datesOfMonth);
  };
  //   const monthString = "Mar-2024";

  const getMonthsForYear = (year) => {
    // Get all months of the year
    const months = eachMonthOfInterval({
      start: startOfMonth(new Date(year, 0, 1)),
      end: endOfYear(new Date(year, 11, 31)),
    });
    const dates = eachDayOfInterval({
      start: startOfMonth(new Date(2023, 0, 1)),
      end: endOfYear(new Date(2023, 11, 31)),
    });
    console.log(months[6]);
    getAllDatesInMonth(months[6]);
    return { months, dates };
  };

  const { months, dates } = getMonthsForYear(2023);
  console.log(dates);

  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());

  //   console.log(dates);

  const daysInMonth = eachDayOfInterval({
    // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month
    end: endOfWeek(endOfMonth(firstDayOfMonth)), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
  }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
  console.log(daysInMonth);

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

  const CalenderYearly = ({ salahObjects }) => {
    const year = 2024; // Replace with the desired year
    const months = [];
  
    // Generate an array of 12 months
    for (let i = 0; i < 12; i++) {
      const currentMonth = addMonths(new Date(year, 0, 1), i);
      months.push(currentMonth);
    }

  return (
    <>
      <h1 className="pt-5 text-3xl">Yearly</h1>
      <div className="grid grid-cols-2 gap-4">
      {months.map((month, index) => {
        const monthString = format(month, 'MMM-yyyy');
        const datesOfMonth = getDatesOfMonth(monthString);

        return (
          <div key={index}>
            <h2 className="text-lg font-bold">{monthString}</h2>
            <CalenderMonthly dates={datesOfMonth} salahObjects={salahObjects} />
          </div>
        );
      })}
    </div>
    </>
  );
};

export default CalenderYearly;
