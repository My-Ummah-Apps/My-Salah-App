import { useState } from "react";
import Modal from "./Modal";
// import ReactModal from "react-modal";
import { salahTrackingEntryType } from "../../types/types";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfWeek,
} from "date-fns";

const CalenderMonthly = ({
  salahName,
  days,
  setSalahTrackingArray,
  isDayInSpecificMonth,
  salahTrackingArray,
  countCompletedDates,
  startDate,
  modifySingleDaySalah,
  setCurrentWeek,
  currentWeek,
  // salahName,
  currentMonth,
}: {
  salahName: string;
  days: string[];
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  isDayInSpecificMonth: (dayToCheck: Date, currentMonth: string) => boolean;
  salahTrackingArray: salahTrackingEntryType[];
  countCompletedDates: (date: string, salah: string) => string;
  startDate: Date;
  modifySingleDaySalah: (date: Date) => void;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
  // salahName: string;
  currentMonth: string;
}) => {
  console.log(salahName);
  const [showModal, setShowModal] = useState(false);
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
        <div className="monthly-heading-text-wrap">
          <p className="text-xl font-semibold text-center month-name-text">
            {/* {format(firstDayOfMonth, "MMMM yyyy")} */}
            {salahName}
          </p>
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
                  onClick={() => {
                    modifySingleDaySalah(day);
                    setShowModal(true);
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
