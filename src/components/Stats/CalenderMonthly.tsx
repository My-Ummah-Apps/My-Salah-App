import { useState } from "react";
import Modal from "./Modal";
// import ReactModal from "react-modal";
import { salahTrackingEntryType } from "../../types/types";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfWeek,
  add,
  startOfToday,
} from "date-fns";

const CalenderMonthly = ({
  // getPrevMonth,
  // getNextMonth,
  grabDate,
  setShowUpdateStatusModal,
  salahName,
  days,
  setSalahTrackingArray,
  isDayInSpecificMonth,
  salahTrackingArray,
  countCompletedDates,
  startDate,
  // modifySingleDaySalah,
  setCurrentWeek,
  currentWeek, // salahName,
  // currentMonth,
}: {
  // getPrevMonth: (event: React.MouseEvent<SVGSVGElement>) => void;
  // getNextMonth: (event: React.MouseEvent<SVGSVGElement>) => void;
  grabDate: (e: any, date?: string, salahName?: string) => void;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  salahName: string;
  days: string[];
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  isDayInSpecificMonth: (dayToCheck: Date, currentMonth: string) => boolean;
  salahTrackingArray: salahTrackingEntryType[];
  countCompletedDates: (date: string, salah: string) => any;
  startDate: Date;
  // modifySingleDaySalah: (date: Date) => void;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
  // salahName: string;
  currentMonth: string;
}) => {
  const [showModal, setShowModal] = useState(false);

  const today = startOfToday(); // Will return todays date details
  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  ); // Jan-2024 (string)

  const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 }); // Take the first day of the month, and substract one month from it, example: if first DayOfMonth represents March 1st, 2023, this line of code would calculate February 1st, 2023.
    setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  };
  // const today = startOfToday(); // Wed Jan 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)

  //   const days = [""];
  // const colStartClasses = [
  //   // "",
  //   // "col-start-2",
  //   // "col-start-3",
  //   // "col-start-4",
  //   // "col-start-5",
  //   // "col-start-6",
  //   // "col-start-7",
  // ];

  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date()); // Returns Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)

  const daysInMonth = eachDayOfInterval({
    // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month

    end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
  }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)

  return (
    <>
      <div className="justify-between bg-[color:var(--card-bg-color)] flex-column card-wrap mb-10 rounded-2xl box-shadow: 0 25px 50px -12px rgb(31, 35, 36) p-3 single-month-wrap">
        <div className="flex items-center justify-between monthly-heading-text-wrap">
          <p className="text-xl font-semibold text-center month-name-text">
            {/* {format(firstDayOfMonth, "MMMM yyyy")} */}
            {currentMonth.replace("-", " ")}
          </p>
          <div className="flex chevron-wrap">
            <div className="p-3 m-1 bg-gray-700 rounded-md bg-opacity-40">
              <IoChevronBackSharp
                onClick={(event: React.MouseEvent<SVGSVGElement>) => {
                  getPrevMonth(event);
                }}
              />{" "}
            </div>
            <div className="p-3 m-1 bg-gray-700 rounded-md bg-opacity-40">
              <IoChevronForward
                onClick={(event: React.MouseEvent<SVGSVGElement>) => {
                  getNextMonth(event);
                }}
              />
            </div>
          </div>
          {/* <div className="flex items-center gap-6 justify-evenly sm:gap-12"></div> */}
        </div>
        <hr className="my-6" />
        <div className="grid grid-cols-7 gap-6 mb-3 place-items-center days-row-wrap">
          {days.map((day, index) => {
            return (
              <div key={index} className="font-semibold">
                {day}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-7 gap-1 place-items-center month-dates-wrap">
          {daysInMonth.map((day, index) => {
            return (
              <>
                {/* Need to add logic here, as each date is painted, check...does this date exist in the current salahs array? if so how many? and color it accordingly, before moving onto the next date and doing the same */}
                <div
                  onClick={(e) => {
                    // modifySingleDaySalah(day);
                    grabDate(e, format(day, "dd.MM.yy"), salahName);
                    setShowUpdateStatusModal(true);
                    console.log("date clicked: " + format(day, "dd.MM.yy"));
                    console.log("salah to update: " + salahName);
                    // setShowModal(true);
                  }}
                  key={index}
                  className=""
                >
                  <p
                    style={{
                      backgroundColor: countCompletedDates(
                        format(day, "dd.MM.yy"),
                        salahName
                      ),
                    }}
                    className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-md  hover:text-white text-sm ${
                      // isSameMonth(day, today) ? "text-gray-900" : "text-gray-400"

                      isDayInSpecificMonth(day, currentMonth)
                        ? "text-gray-400"
                        : "text-gray-900"
                    } 

                    `}
                  >
                    {format(day, "d")}
                  </p>
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
              </>
            );
          })}
        </div>
        <div className="flex justify-between p-1 mt-5 border-[1px] border-solid rounded-lg border-lime-400 streak-and-strength-wrap text-sm">
          <p>Streak: L - 5D C - 0D</p>
          <p>Strength: 75%</p>
        </div>
      </div>
    </>
  );
};

export default CalenderMonthly;

//   ${isToday(day) && "bg-red-500 text-white"}
// ${!isToday(day) && "hover:bg-blue-500"}
