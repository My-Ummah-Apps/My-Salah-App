import { useState } from "react";
import Modal from "./Modal";
// import ReactModal from "react-modal";
import { salahTrackingEntryType } from "../../types/types";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  // getDay,
  // isSameMonth,
  // isToday,
  parse,
  startOfToday,
  startOfWeek,
  // startOfISOWeek,
  startOfMonth,
} from "date-fns";

const CalenderMonthly = ({
  setSalahTrackingArray,
  salahTrackingArray,
  // setStartDate,
  startDate,
  modifySingleDaySalah,
  setCurrentStartDate,
  currentStartDate,
  salahName,
  currentMonth,
}: {
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
  modifySingleDaySalah: (date: Date) => void;
  setCurrentStartDate: React.Dispatch<React.SetStateAction<number>>;
  currentStartDate: number;
  salahName: string;
  currentMonth: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const today = startOfToday(); // Wed Jan 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time) (object)
  //   const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
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
  // let dateColor: string;

  // const datesArray: string[] = [];
  const allDatesArray = salahTrackingArray.reduce<string[]>(
    (accumulatorArray, salah) => {
      if (salahName !== "Overall") {
        if (salah.salahName === salahName) {
          salah.completedDates.forEach((item) => {
            // datesArray.push(Object.keys(item)[0]);
            accumulatorArray.push(Object.keys(item)[0]);
          });
        }
      } else if (salahName == "Overall") {
        // if (salah.salahName === salahName) {
        salah.completedDates.forEach((item) => {
          // datesArray.push(Object.keys(item)[0]);
          accumulatorArray.push(Object.keys(item)[0]);
        });
        //   }
      }

      // return datesArray;
      return accumulatorArray;
    },
    []
  );

  // let dArray = [];

  const howManyDatesExist = (date: string) => {
    // allDatesArray.reduce((value, dateString) => {
    //   console.log(value);
    //   return value;
    // }, 0);

    // let increment = 0;
    // let sameDatesArray = allDatesArray.map((currentDate) => {
    //   if (currentDate === date) {
    //     dArray.push(date);
    //     increment = dArray.length;
    //   }

    //   return dArray;
    // });

    let sameDatesArray = allDatesArray.filter(
      (currentDate) => currentDate === date
    );

    let sameDatesArrayLength = sameDatesArray.length;

    let color;
    if (sameDatesArrayLength === 0) {
      // console.log("increment > 2");
      //   color = "red";
      color = "transparent";
    } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
      // console.log("increment < 2");

      color = "orange";
    } else if (sameDatesArrayLength === 5) {
      // console.log("increment === 4");

      color = "green";
    } else {
      color = "yellow";
    }
    // dArray = [];
    sameDatesArray = [];
    return color;
  };

  // function doesDateExist(date) {
  //   return allDatesArray.includes(format(date, "dd.MM.yy"));
  // }

  // const [currentMonth, setcurrentMonth] = useState(() =>
  //   format(today, "MMM-yyyy")
  // ); // Jan-2024 (string)

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

    end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
  }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)

  return (
    <>
      {/* <h1 className="pt-5 text-3xl">Monthly</h1> */}

      <div className="justify-between bg-[color:var(--card-bg-color)] flex-column card-wrap my-10 rounded-2xl box-shadow: 0 25px 50px -12px rgb(31, 35, 36) p-3">
        {/* <IoChevronBackSharp
          className="w-6 h-6 cursor-pointer"
          onClick={getPrevMonth}
        />
        <IoChevronForward
          className="w-6 h-6 cursor-pointer"
          onClick={getNextMonth}
        /> */}
        {/* <div className="flex items-center justify-between"> */}
        <div className="">
          <p className="text-xl font-semibold text-center">
            {/* {format(firstDayOfMonth, "MMMM yyyy")} */}
            {salahName}
          </p>
          <div className="flex items-center gap-6 justify-evenly sm:gap-12">
            {/* <IoChevronBackSharp
              className="w-6 h-6 cursor-pointer"
              onClick={getPrevMonth}
            />
            <IoChevronForward
              className="w-6 h-6 cursor-pointer"
              onClick={getNextMonth}
            /> */}
          </div>
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

        <div className="grid grid-cols-7 gap-1 place-items-center">
          {daysInMonth.map((day, index) => {
            return (
              <>
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
                      backgroundColor: howManyDatesExist(
                        format(day, "dd.MM.yy")
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
                  setCurrentStartDate={setCurrentStartDate}
                  currentStartDate={currentStartDate}
                  startDate={startDate}
                />
              </>
            );
          })}
        </div>
        <div className="flex justify-between p-1 border-[1px] border-solid rounded-lg border-lime-400 streak-and-strength-wrap">
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
