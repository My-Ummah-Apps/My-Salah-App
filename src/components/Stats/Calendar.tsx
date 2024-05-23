import { useState, useRef, useEffect } from "react";
import { salahTrackingEntryType } from "../../types/types";
import { CSSProperties } from "react";

// import { List, Grid } from "react-virtualized";
// import CalendarMonthly from "./CalendarMonthly";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import Modal from "./Modal";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import {
  format,
  parse,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  eachMonthOfInterval,
  // setMonth,
} from "date-fns";

const Calendar = ({
  // setShowCalendarOneMonth,
  // showCalendarOneMonth,
  userStartDate,
  setSalahTrackingArray,
  salahTrackingArray,
  startDate,
  setCurrentWeek,
  currentWeek,
}: {
  // setShowCalendarOneMonth: React.Dispatch<React.SetStateAction<boolean>>;
  // showCalendarOneMonth: boolean;
  userStartDate: string;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
  //   modifySingleDaySalah: (date: Date) => void;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
}) => {
  const calenderSingleMonthHeightRef = useRef<HTMLDivElement>(null);
  // const [singleMonthDivHeight, setSingleMonthDivHeight] = useState(0);
  useEffect(() => {
    // console.log(calenderSingleMonthHeightRef.current);
    // if (calenderSingleMonthHeightRef.current) {
    //   // console.log(calenderSingleMonthHeightRef.current.clientHeight);
    //   setSingleMonthDivHeight(
    //     calenderSingleMonthHeightRef.current.clientHeight
    //   );
    // }
  });

  // const getSingleMonthDivHeight = () => {
  //   // setSingleMonthDivHeight(e.target.clientHeight);
  //   console.log("hi");
  //   console.log(singleMonthDivHeight);
  // };

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  // function modifySingleDaySalah(date: Date) {
  //   const today: Date = new Date();
  //   setCurrentWeek(
  //     today > date
  //       ? differenceInDays(today, date)
  //       : differenceInDays(today, date) - 1
  //   );
  //   // setCurrentWeek(differenceInDays(today, date) - 1);
  // }

  // let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const isDayInSpecificMonth = (dayToCheck: Date, currentMonth: string) => {
    // console.log(currentMonth);
    const parsedCurrentMonth = parse(currentMonth, "MMMM yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
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

  let fajrColor = "green";
  let zoharColor = "blue";
  let asarColor = "red";
  let maghribColor = "yellow";
  let ishaColor = "orange";

  // const countCompletedDates = (date: string, salahName?: string) => {
  //   const allDatesWithinSalahTrackingArray = salahTrackingArray.reduce<
  //     string[]
  //   >((accumulatorArray, salah) => {
  //     if (salah.salahName === salahName) {
  //       salah.completedDates.forEach((item) => {
  //         accumulatorArray.push(Object.keys(item)[0]);
  //       });
  //     } else if (!salahName) {
  //       salah.completedDates.forEach((item) => {
  //         accumulatorArray.push(Object.keys(item)[0]);
  //       });
  //     }
  //     return accumulatorArray;
  //   }, []);

  //   // let sameDatesArray = allDatesWithinSalahTrackingArray.filter(
  //   //   (currentDate) => currentDate === date
  //   // );

  //   // let sameDatesArrayLength = sameDatesArray.length;

  //   let color;

  //   // if (salahName) {
  //   //   if (sameDatesArrayLength === 0) {
  //   //     color = "transparent";
  //   //   } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
  //   //     color = { fajrColor };
  //   //   }
  //   // } else if (!salahName) {
  //   //   if (sameDatesArrayLength === 0) {
  //   //     color = { asarColor };
  //   //   } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
  //   //     color = { zoharColor };
  //   //   } else if (sameDatesArrayLength === 5) {
  //   //     color = { ishaColor };
  //   //   }
  //   // }

  //   // sameDatesArray = [];
  //   return color;
  // };

  const [showModal, setShowModal] = useState(false);

  let todaysDate = new Date();
  // userStartDate = "17.01.11";

  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());

  const endDate = new Date();

  // Generate an array of all the months between the start and end dates
  const monthsBetween = eachMonthOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });

  // Format the months
  const formattedMonths = monthsBetween.map((month) =>
    format(month, "MMMM yyyy")
  );
  formattedMonths.reverse();

  // if (currentYear.getFullYear === userStartDateFormatted.getFullYear) {
  //   // userStartDateFormatted.setMonth(userStartDateFormatted.getMonth() - 1);
  //   monthsInYear = monthsInYear.filter(
  //     // (month) => month < userStartDateFormatted
  //      isAfter(month, p)
  //   );
  // }

  // const monthStrings = monthsInYear.map((month) => format(month, "MMM-yyyy"));
  // console.log(monthStrings);
  let firstDayOfMonth;
  const monthlyDates = (month: string) => {
    firstDayOfMonth = parse(month, "MMMM yyyy", new Date()); // Returns the following type of object: Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time)

    const daysInMonth = eachDayOfInterval({
      // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
      start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month

      end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
    }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
    return daysInMonth;
  };

  function generateRadialColor(status: { [date: string]: string }) {
    return Object.values(status)[0] === "male-alone"
      ? "var(--alone-male-status-color)"
      : Object.values(status)[0] === "group"
      ? "var(--jamaah-status-color)"
      : Object.values(status)[0] === "female-alone"
      ? "var(--alone-female-status-color)"
      : Object.values(status)[0] === "excused"
      ? "var(--excused-status-color)"
      : Object.values(status)[0] === "missed"
      ? "var(--missed-status-color)"
      : Object.values(status)[0] === "late"
      ? "var(--late-status-color)"
      : "";
  }

  function determineRadialColors(date: Date) {
    if (date < userStartDateFormatted || date > todaysDate) {
      fajrColor = "transparent";
      zoharColor = "transparent";
      asarColor = "transparent";
      maghribColor = "transparent";
      ishaColor = "transparent";
      return;
    }
    fajrColor = "#585858";
    zoharColor = "#585858";
    asarColor = "#585858";
    maghribColor = "#585858";
    ishaColor = "#585858";

    salahTrackingArray.forEach((item) => {
      let formattedDate = format(date, "dd.MM.yy");
      let completedDates = item.completedDates;

      for (let key in completedDates) {
        if (completedDates[key].hasOwnProperty(formattedDate)) {
          if (Object.keys(completedDates[key])[0] === formattedDate) {
            if (item.salahName === "Fajr") {
              fajrColor = generateRadialColor({
                formattedDate: completedDates[key][formattedDate].status,
              });
            } else if (item.salahName === "Dhuhr") {
              zoharColor = generateRadialColor({
                formattedDate: completedDates[key][formattedDate].status,
              });
            } else if (item.salahName === "Asar") {
              asarColor = generateRadialColor({
                formattedDate: completedDates[key][formattedDate].status,
              });
            } else if (item.salahName === "Maghrib") {
              maghribColor = generateRadialColor({
                formattedDate: completedDates[key][formattedDate].status,
              });
            } else if (item.salahName === "Isha") {
              ishaColor = generateRadialColor({
                formattedDate: completedDates[key][formattedDate].status,
              });
            }
          }
        }
      }
    });
    return null;
  }

  console.log(monthsBetween.length);

  // const Column = ({ index, style }) => <div style={style}>Column {index}</div>;
  const Column = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div
      style={{
        ...style,
        width: monthsBetween.length === 1 ? "100%" : style.width,
        border: "1px solid rgb(54, 49, 49)",
      }}
      // bg-[color:var(--card-bg-color)]

      className={`bg-[color:var(--card-bg-color)] pb-5 calendar-single-month-wrap whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
    >
      <div
        ref={calenderSingleMonthHeightRef}
        className={`month-name-days-dates-wrap`}
      >
        <p className="py-4 font-semibold text-center">
          {formattedMonths[index]}
        </p>
        <div className="grid grid-cols-7 px-2 mb-3 place-items-center days-row-wrap">
          {days.map((day) => {
            return (
              <div
                key={uuidv4()}
                className="w-5 h-5 text-sm font-semibold text-center individual-day"
              >
                {day}
              </div>
            );
          })}
        </div>
        <div
          className="grid grid-cols-7 px-2 gap-y-7 place-items-center month-dates-wrap"
          key={uuidv4()}
        >
          {monthlyDates(formattedMonths[index]).map((day) => (
            <div
              onClick={() => {
                if (day <= todaysDate) {
                  // modifySingleDaySalah(day);
                  // setShowModal(true);
                }
              }}
              key={uuidv4()}
              className="relative flex items-center justify-center individual-date"
            >
              {determineRadialColors(day)}
              <svg
                className="absolute"
                xmlns="http://www.w3.org/2000/svg"
                id="svg"
                viewBox="0 0 150 150"
                style={{ height: "37px", width: "37px" }}
              >
                <desc>Created with Snap</desc>
                <defs />
                <path
                  d="M 86.1150408904588 8.928403485284022 A 67 67 0 0 1 134.40308587902058 44.011721763710284"
                  style={{
                    strokeWidth: "13px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={zoharColor}
                />
                <path
                  d="M 141.272558935669 65.15378589922615 A 67 67 0 0 1 122.82816700032245 121.91978731185029"
                  style={{
                    strokeWidth: "13px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={asarColor}
                />
                <path
                  d="M 104.84365305321519 134.98630153992926 A 67 67 0 0 1 45.15634694678482 134.98630153992926"
                  style={{
                    strokeWidth: "13px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={maghribColor}
                />
                <path
                  d="M 27.171832999677548 121.91978731185029 A 67 67 0 0 1 8.72744106433099 65.15378589922618"
                  style={{
                    strokeWidth: "13px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={ishaColor}
                />
                <path
                  d="M 15.596914120979442 44.01172176371027 A 67 67 0 0 1 63.884959109541164 8.928403485284022"
                  style={{
                    strokeWidth: "13px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={fajrColor}
                />
              </svg>
              <p
                //
                className={` text-sm cursor-pointer flex items-center justify-center font-semibold h-6 w-6 hover:text-white  ${
                  isDayInSpecificMonth(day, formattedMonths[index])
                    ? "white"
                    : "text-gray-600"
                }
              `}
              >
                {format(day, "d")}
                {/* {format(day, "dd")} */}
              </p>
            </div>
          ))}
        </div>
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
  );

  return (
    // <div
    //   // style={{ height: singleMonthDivHeight }}
    //   className="bg-[color:var(--card-bg-color)] calender-list-wrap mb-3 rounded-md"
    // >
    <AutoSizer disableHeight className="auto-sizer">
      {({ width }) => (
        <List
          style={{ borderRadius: "0.5rem" }}
          className="list"
          // height={330}
          height={400}
          itemCount={monthsBetween.length}
          itemSize={300}
          layout="horizontal"
          width={width}
          direction="rtl"
        >
          {Column}
        </List>
      )}
    </AutoSizer>
    // </div>
  );
};

export default Calendar;
