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
  startOfYear,
  startOfWeek,
  eachMonthOfInterval,
  endOfYear,
} from "date-fns";

const CalenderYearly = ({
  days,
  isDayInSpecificMonth,
  currentYear,
  howManyDatesExistWithinSalahTrackingArray,
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  currentWeek,
  // setStartDate,
  startDate,

  modifySingleDaySalah,
}: {
  days: string[];
  isDayInSpecificMonth: (dayToCheck: Date, currentMonth: string) => boolean;
  currentYear: Date;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  howManyDatesExistWithinSalahTrackingArray: (date: string) => string;
  salahName: string;
  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
  modifySingleDaySalah: (date: Date) => void;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;

  currentWeek: number;
}) => {
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

  const [showModal, setShowModal] = useState(false);
  console.log(currentYear);
  const monthsInYear = eachMonthOfInterval({
    start: startOfYear(currentYear),
    end: endOfYear(currentYear),
  });

  const monthStrings = monthsInYear.map((month) => format(month, "MMM-yyyy"));

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

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen calender-wrap">
        <div className="w-[900px] h-[600px]">
          <div className="flex items-center justify-between chevrons-wrap"></div>
          <div>
            <div className="grid grid-cols-2 place-items-center dates-grid-wrap">
              {monthStrings.map((month) => (
                <div className="justify-between bg-[color:var(--card-bg-color)] flex-column card-wrap my-5 rounded-2xl box-shadow: 0 25px 50px -12px rgb(31, 35, 36) single-month-wrap">
                  <p className="text-xl font-semibold text-center">{month}</p>
                  <div className="grid grid-cols-7 gap-6 mb-3 place-items-center days-row-wrap">
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
                  </div>
                  <div
                    className="grid grid-cols-7 gap-1 place-items-center month-dates-wrap"
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
                            backgroundColor:
                              howManyDatesExistWithinSalahTrackingArray(
                                format(day, "dd.MM.yy")
                              ),
                          }}
                          className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-md  hover:text-white text-sm ${
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
        </div>
      </div>
    </>
  );
};

export default CalenderYearly;
