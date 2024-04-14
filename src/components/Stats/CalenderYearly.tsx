import { useState } from "react";
import { salahTrackingEntryType } from "../../types/types";
// import CalenderMonthly from "./CalenderMonthly";
import Modal from "./Modal";
import _ from "lodash";

// Change below so that entire module isn't being imported
// import Swiper from "swiper/bundle";
// import "swiper/css/navigation";
// import Swiper styles
// import "swiper/css";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import {
  add,
  sub,
  format,
  parse,
  // startOfToday,
  startOfMonth,
  // differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfYear,
  startOfWeek,
  eachMonthOfInterval,
  endOfYear,
} from "date-fns";
// import CircleSegment from "./CircleSegment";

// const todaysDate = new Date();

const CalenderYearly = ({
  // setShowCalenderOneMonth,
  // showCalenderOneMonth,
  userStartDate,
  setSalahTrackingArray,
  salahTrackingArray,
  startDate,
  setCurrentWeek,
  currentWeek,
}: {
  // setShowCalenderOneMonth: React.Dispatch<React.SetStateAction<boolean>>;
  // showCalenderOneMonth: boolean;
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
  // const data = [
  //   { name: "Group A", value: 400 },
  //   { name: "Group B", value: 300 },
  //   { name: "Group C", value: 300 },
  //   { name: "Group D", value: 200 },
  // ];
  // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  // const [showMonthlyCalender, setShowMonthlyCalender] = useState(false);
  // const [showYearlyCalender, setShowYearlyCalender] = useState(true);

  const [currentYear, setCurrentYear] = useState(new Date());

  // const today = startOfToday(); // Will return todays date details
  // const [currentMonth, setcurrentMonth] = useState(() =>
  //   format(today, "MMM-yyyy")
  // ); // Jan-2024 (string)

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
    const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  // const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
  //   console.log("getPrevMonth triggered");
  //   event.preventDefault();
  //   const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 }); // Take the first day of the month, and substract one month from it, example: if firstDayOfMonth represents March 1st, 2023, this line of code would calculate February 1st, 2023.
  //   setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  // };

  // const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
  //   console.log("getNextMonth triggered");
  //   event.preventDefault();
  //   const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
  //   setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  // };

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

  let monthsInYear: Date[] = eachMonthOfInterval({
    start: startOfYear(currentYear),
    end: endOfYear(currentYear),
  });
  let todaysDate = new Date();

  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());

  if (currentYear.getFullYear === userStartDateFormatted.getFullYear) {
    // userStartDateFormatted.setMonth(userStartDateFormatted.getMonth() - 1);
    monthsInYear = monthsInYear.filter(
      (month) => month > userStartDateFormatted
      // && isAfter(month, p)
    );
  }

  const monthStrings = monthsInYear.map((month) => format(month, "MMM-yyyy"));
  // console.log(monthStrings);
  let firstDayOfMonth;
  const yearlyMonthsData = (month: string) => {
    firstDayOfMonth = parse(month, "MMM-yyyy", new Date()); // Returns Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)
    //
    const daysInMonth = eachDayOfInterval({
      // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
      start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month

      end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
    }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
    return daysInMonth;
  };

  console.log(salahTrackingArray);
  function determineRadialColors(date: Date) {
    fajrColor = "gray";
    zoharColor = "gray";
    asarColor = "gray";
    maghribColor = "gray";
    ishaColor = "gray";

    salahTrackingArray.forEach((item) => {
      let formattedDate = format(date, "dd.MM.yy");
      let completedDates = item.completedDates;

      for (let key in completedDates) {
        if (completedDates[key].hasOwnProperty(formattedDate)) {
          if (Object.keys(completedDates[key])[0] === formattedDate) {
            if (item.salahName === "Fajr") {
              fajrColor =
                Object.values(completedDates[key])[0] === "alone"
                  ? "yellow"
                  : Object.values(completedDates[key])[0] === "group"
                  ? "green"
                  : Object.values(completedDates[key])[0] === "missed"
                  ? "red"
                  : Object.values(completedDates[key])[0] === "late"
                  ? "orange"
                  : "pink";
            } else if (item.salahName === "Zohar") {
              zoharColor =
                Object.values(completedDates[key])[0] === "alone"
                  ? "yellow"
                  : Object.values(completedDates[key])[0] === "group"
                  ? "green"
                  : Object.values(completedDates[key])[0] === "missed"
                  ? "red"
                  : Object.values(completedDates[key])[0] === "late"
                  ? "orange"
                  : "pink";
            } else if (item.salahName === "Asar") {
              asarColor =
                Object.values(completedDates[key])[0] === "alone"
                  ? "yellow"
                  : Object.values(completedDates[key])[0] === "group"
                  ? "green"
                  : Object.values(completedDates[key])[0] === "missed"
                  ? "red"
                  : Object.values(completedDates[key])[0] === "late"
                  ? "orange"
                  : "pink";
            } else if (item.salahName === "Maghrib") {
              maghribColor =
                Object.values(completedDates[key])[0] === "alone"
                  ? "yellow"
                  : Object.values(completedDates[key])[0] === "group"
                  ? "green"
                  : Object.values(completedDates[key])[0] === "missed"
                  ? "red"
                  : Object.values(completedDates[key])[0] === "late"
                  ? "orange"
                  : "pink";
            } else if (item.salahName === "Isha") {
              ishaColor =
                Object.values(completedDates[key])[0] === "alone"
                  ? "yellow"
                  : Object.values(completedDates[key])[0] === "group"
                  ? "green"
                  : Object.values(completedDates[key])[0] === "missed"
                  ? "red"
                  : Object.values(completedDates[key])[0] === "late"
                  ? "purple"
                  : "pink";
            }
          }
        }
      }
    });
    return null;
  }

  return (
    <div className="calender-page-wrap">
      <div className="sticky flex justify-around mb-10 calender-component-header">
        {" "}
        <IoChevronBackSharp
          className="w-6 h-6 cursor-pointer"
          // onClick={setCurrentYear((prevYearValue) =>
          //   sub(prevYearValue, { years: 1 })
          // )}
          onClick={() => {
            if (
              currentYear.getFullYear() > userStartDateFormatted.getFullYear()
            ) {
              setCurrentYear((prevYearValue) =>
                sub(prevYearValue, { years: 1 })
              );
            }
          }}
        />
        <h1>{format(currentYear, "yyyy")}</h1>
        <IoChevronForward
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            if (todaysDate.getFullYear() < currentYear.getFullYear()) {
              setCurrentYear((prevYearValue) =>
                add(prevYearValue, { years: 1 })
              );
            }
          }}
          // onClick={
          //   showMonthlyCalender
          //     ? getNextMonth
          //     : () =>
          //         setCurrentYear((prevYearValue) =>
          //           add(prevYearValue, { years: 1 })
          //         )
          // }
        />
      </div>
      <>
        <div className="flex items-center justify-center calender-wrap">
          <div className="flex items-center justify-between chevrons-wrap"></div>
          {/* gap-5 */}
          <div className="flex w-full mb-6 overflow-scroll rounded-lg months-wrap">
            {monthStrings.map((month) => (
              // rounded-2xl
              <div className="bg-[color:var(--card-bg-color)] flex-column card-wrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36) single-month-wrap px-9 border-r border-gray-700">
                <p className="py-4 font-semibold text-center">{month}</p>
                <div className="grid grid-cols-7 mb-3 place-items-center days-row-wrap">
                  {days.map((day, index) => {
                    return (
                      <div
                        key={index}
                        className="w-5 h-5 text-sm font-semibold individual-day"
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div
                  // grid grid-cols-7
                  className="grid grid-cols-7 gap-x-12 gap-y-5 place-items-center month-dates-wrap"
                  key={month}
                >
                  {yearlyMonthsData(month).map((day, index) => (
                    <div
                      onClick={() => {
                        if (day <= todaysDate) {
                          // modifySingleDaySalah(day);
                          // setShowModal(true);
                        }
                      }}
                      key={index}
                      className="relative flex items-center justify-center individual-date"
                    >
                      {determineRadialColors(day)}
                      <svg
                        className="absolute"
                        xmlns="http://www.w3.org/2000/svg"
                        id="svg"
                        viewBox="0 0 150 150"
                        style={{ height: "30px", width: "30px" }}
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
                        // style={{
                        //   backgroundColor: countCompletedDates(
                        //     format(day, "dd.MM.yy")
                        //   ),
                        // }}
                        // rounded-md
                        className={` text-sm cursor-pointer flex items-center justify-center font-semibold h-6 w-6 hover:text-white  ${
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
