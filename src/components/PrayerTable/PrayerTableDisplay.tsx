import React, { useState } from "react";
// import Modal from "./Modal";
import { v4 as uuidv4 } from "uuid";
import Sheet from "react-modal-sheet";
// import CalenderMonthly from "../Stats/CalenderMonthly";
// import StatCard from "../Stats/StatCard";
// import ReactModal from "react-modal";
// import { FaMosque, FaHome } from "react-icons/fa";
// import { ImCross } from "react-icons/im";

// import { MdGroups, MdPerson } from "react-icons/md";
import { MdPerson } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import { BsPersonStanding } from "react-icons/bs";
import { AiOutlineStop } from "react-icons/ai";
// import { GoPerson } from "react-icons/go";
// import { GoPeople } from "react-icons/go";
import { PiClockCounterClockwise } from "react-icons/pi";

import { salahTrackingEntryType } from "../../types/types";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

import {
  subDays,
  format,
  parse,
  // startOfToday,
  // startOfMonth,
  eachDayOfInterval,
  // differenceInDays,
} from "date-fns";

// import StreakCount from "../Stats/StreakCount";
import { PiFlower } from "react-icons/pi";

// import { v4 as uuidv4 } from "uuid";

const PrayerTableDisplay = ({
  userGender,
  userStartDate,
  setSalahTrackingArray,
  salahTrackingArray,
  // setCurrentWeek,
  // currentWeek,
  startDate,
}: {
  userGender: string;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  userStartDate: string;
  salahTrackingArray: salahTrackingEntryType[];
  // setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  // currentWeek: number;
  startDate: Date;
}) => {
  // console.log("salahTrackingArray");
  // console.log(salahTrackingArray);
  // const [monthlyCalenderToShow, setMonthlyCalenderToShow] = useState("");

  // const [streakCounter, setStreakCounter] = useState(0);

  // BELOW CODE IS FROM CALENDER.TSX TO MAKE MONTHLY CALENDER FUNCTIONALITY WORK WHEN A TABLE ROW IS CLICKED
  // THIS IS ALL DUPLICATE CODE FROM CALENDER.TSX AND NEED TO FIND A MORE EFFICIENT WAY OF DOING THIS
  //  ----------------------------------------------

  // const days = ["M", "T", "W", "T", "F", "S", "S"];
  // const today = startOfToday();
  // const isDayInSpecificMonth = (dayToCheck: Date, currentMonth: string) => {
  //   const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  //   const dayMonth = startOfMonth(dayToCheck);
  //   return (
  //     dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
  //     dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
  //   );
  // };

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

  //   let sameDatesArray = allDatesWithinSalahTrackingArray.filter(
  //     (currentDate) => currentDate === date
  //   );

  //   let sameDatesArrayLength = sameDatesArray.length;

  //   let color;

  //   if (salahName) {
  //     if (sameDatesArrayLength === 0) {
  //       color = "transparent";
  //     } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
  //       color = "green";
  //     }
  //   } else if (!salahName) {
  //     if (sameDatesArrayLength === 0) {
  //       color = "transparent";
  //     } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
  //       color = "orange";
  //     } else if (sameDatesArrayLength === 5) {
  //       color = "green";
  //     }
  //   }

  //   sameDatesArray = [];
  //   return color;
  // };
  // END OF CODE FROM CALENDER.TSX ----------------------------------------------

  // const [icon, setIcon] = useState("");
  // const [showCalenderOneMonth, setShowCalenderOneMonth] = useState(false);
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableRowDate, setTableRowDate] = useState("");

  // Array to hold the last five dates
  // userStartDate = "01.01.10";
  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  const endDate = new Date(); // Current date
  const datesBetween = eachDayOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });
  // console.log(datesBetween.length);
  let currentDisplayedDates: string[] = [];
  function generateDisplayedWeek() {
    currentDisplayedDates = Array.from(
      { length: datesBetween.length },
      (_, index) => {
        const date = subDays(startDate, index);
        return format(date, "dd.MM.yy");
      }
    );
  }

  generateDisplayedWeek();

  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  // const [showMonthlyCalenderModal, setShowMonthlyCalenderModal] =
  //   useState(false);

  const changePrayerStatus: (
    tableRowDate: string,
    selectedSalah: string,
    salahStatus: string
    // icon
  ) => void = (tableRowDate, selectedSalah, salahStatus) => {
    const newSalahTrackingArray = salahTrackingArray.map((item) => {
      if (item.salahName === selectedSalah.replace(/\s/g, "")) {
        const doesDateObjectExist = item.completedDates.find((date) => {
          return Object.keys(date)[0] === tableRowDate;
        });

        // if (salahStatus === "late") {
        // if (doesDateObjectExist === undefined) {
        //   return {
        //     ...item,
        //     completedDates: [...item.completedDates],
        //   };
        // } else if (doesDateObjectExist !== undefined) {
        //   const filteredCompletedDatesArray = item.completedDates.filter(
        //     (date) => {
        //       return (
        //         Object.keys(doesDateObjectExist)[0] !== Object.keys(date)[0]
        //       );
        //     }
        //   );

        //   return {
        //     ...item,
        //     completedDates: [...filteredCompletedDatesArray],
        //   };
        // }
        // }

        if (doesDateObjectExist === undefined) {
          return {
            ...item,
            completedDates: [
              ...item.completedDates,
              { [tableRowDate]: salahStatus },
            ],
          };
        } else if (doesDateObjectExist !== undefined) {
          // console.log(
          //   "doesDateObjectExist !== undefined && salahStatus !== blank"
          // );
          const filteredCompletedDatesArray = item.completedDates.filter(
            (date) => {
              return (
                Object.keys(doesDateObjectExist)[0] !== Object.keys(date)[0]
              );
            }
          );
          return {
            ...item,
            completedDates: [
              ...filteredCompletedDatesArray,
              { [tableRowDate]: salahStatus },
            ],
          };
        }
      }

      return item;
    });
    setSalahTrackingArray(newSalahTrackingArray);

    localStorage.setItem(
      "storedSalahTrackingData",
      JSON.stringify(newSalahTrackingArray)
    );
  };

  function grabDate(e: any, date?: string, salahName?: string) {
    // console.log("grabDate has run");

    if (!salahName && !date) {
      let tableRowDate =
        e.target.closest(".table-row").cells[0].children[0].innerText;
      console.log("tableRowDate:");
      console.log(
        e.target.closest(".table-row").cells[0].children[0].innerText
      );

      const columnIndex: any = e.target.closest("#icon-wrap").parentElement
        .cellIndex as HTMLTableCellElement;

      const selectedSalah =
        e.target.closest(".table").children[0].children[0].cells[columnIndex]
          .innerText;

      // console.log("selectedSalah:");
      // console.log(selectedSalah);

      setSelectedSalah(selectedSalah);
      setTableRowDate(tableRowDate);
    } else if (salahName && date) {
      // console.log("salahName && date exists");
      setSelectedSalah(salahName);
      setTableRowDate(date);
    }
  }

  let missedReasonsArray = [
    "Alarm",
    "Family",
    "Guests",
    "Friends",
    "Movies",
    "Sleep",
    "Alarm",
    "Family",
    "Guests",
    "Friends",
    "Movies",
    "Sleep",
  ];
  // let lateReasonsArray = [
  //   "Alarm",
  //   "Family",
  //   "Friends",
  //   "Guests",
  //   "Movies",
  //   "Sleep",
  //   "Alarm",
  //   "Family",
  //   "Friends",
  //   "Guests",
  //   "Movies",
  //   "Sleep",
  // ];
  // let prayedAloneReasonsArray = [
  //   "Family",
  //   "Friends",
  //   "Guests",
  //   "Movies",
  //   "Sleep",
  //   "Alarm",
  //   "Family",
  //   "Friends",
  //   "Guests",
  //   "Movies",
  //   "Sleep",
  //   "Alarm",
  // ];

  let cellIcon: string | JSX.Element;
  function populateCells(formattedDate: string, index: number) {
    cellIcon = (
      <LuDot
        onClick={(e: React.TouchEvent<HTMLDivElement>) => {
          // e.stopPropagation();

          if (e.currentTarget.tagName === "svg") {
            // setShowUpdateStatusModal(true);
          }
        }}
        className="inline-block rounded-md w-[24px] h-[24px] self-center justify-self-center m-1"
      />
    );
    const matchedObject = salahTrackingArray[index]?.completedDates.find(
      (obj) => {
        return formattedDate === Object.keys(obj)[0];
      }
    );

    if (matchedObject !== undefined) {
      cellIcon = matchedObject[formattedDate];
    }

    if (cellIcon === "male-alone") {
      cellIcon = (
        <div className="inline-block rounded-md bg-[color:var(--alone-male-status-color)] text-white w-[24px] h-[24px]  self-center justify-self-center m-1">
          {" "}
          {/* <GoPerson
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`text-white w-[15px] h-[15px] flex self-center justify-self-center m-1`}
          /> */}
        </div>
      );
    } else if (cellIcon === "group") {
      cellIcon = (
        <div className="inline-block rounded-md  bg-[color:var(--jamaah-status-color)] text-white w-[24px] h-[24px]  self-center justify-self-center m-1">
          {" "}
          {/* <GoPeople
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`text-white w-[15px] h-[15px] flex self-center justify-self-center m-1`}
          /> */}
        </div>
      );
    } else if (cellIcon === "female-alone") {
      cellIcon = (
        <div className="inline-block rounded-md  bg-[color:var(--alone-female-status-color)] text-white w-[24px] h-[24px]  self-center justify-self-center m-1">
          {" "}
          {/* <GoPeople
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`text-white w-[15px] h-[15px] flex self-center justify-self-center m-1`}
          /> */}
        </div>
      );
    } else if (cellIcon === "excused") {
      cellIcon = (
        <div className="inline-block rounded-md bg-[color:var(--excused-status-color)] text-white w-[24px] h-[24px]  self-center justify-self-center m-1">
          {/* <PiClockCounterClockwise
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`text-white w-[15px] h-[15px] flex self-center justify-self-center m-1`}
          /> */}
        </div>
      );
    } else if (cellIcon === "late") {
      cellIcon = (
        <div className="inline-block rounded-md bg-[color:var(--late-status-color)] text-white w-[24px] h-[24px]  self-center justify-self-center m-1">
          {/* <PiClockCounterClockwise
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`text-white w-[15px] h-[15px] flex self-center justify-self-center m-1`}
          /> */}
        </div>
      );
    } else if (cellIcon === "missed") {
      cellIcon = (
        <div className="inline-block rounded-md  bg-[color:var(--missed-status-color)] red-block text-white w-[24px] h-[24px]  self-center justify-self-center m-1">
          {" "}
          {/* <AiOutlineStop
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`text-white w-[15px] h-[15px] flex self-center justify-self-center m-1`}
          /> */}
        </div>
      );
    }
    return (
      // pt-2
      <td key={uuidv4()} className="h-full pt-6 pb-5 text-center td-element">
        <div
          id="icon-wrap"
          onClick={(e) => {
            // e.stopPropagation();
            setShowUpdateStatusModal(true);
            grabDate(e);
          }}
        >
          {cellIcon}
        </div>
      </td>
    );
    // });
  }

  // const wreathStyles = {
  //   // height: "30%",
  //   width: "35%",
  // };
  // let excusedColor;

  // if (userGender === "female") {
  //   excusedColor = "purple";
  //   console.log("trigger");
  // } else if (userGender === "male") {
  //   excusedColor = "var(--alone-male-status-color)";
  // }

  // let tableRowDate;
  // let selectedSalah
  // tableRowDate, selectedSalah, "missed"
  // let salahStatus: string;
  const [salahStatus, setSalahStatus] = useState("");

  return (
    // Below touchevents cause an issue with onclicks further down the DOM tree not working on iOS devices
    // <section onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <section>
      <Sheet
        isOpen={showUpdateStatusModal}
        onClose={() => setShowUpdateStatusModal(false)}
        detent="content-height"
        // tweenConfig = { ease: 'easeOut', duration: 0.2 }
      >
        <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Header />
          <Sheet.Content>
            <Sheet.Scroller>
              {" "}
              <section className="w-[80%] mx-auto mt-5 mb-20 rounded-lg text-white">
                <h1 className="mb-5 text-3xl text-center">
                  How did you pray {selectedSalah}?
                </h1>
                <div className="grid grid-cols-2 salah-statuses-wrap">
                  {userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("group");
                        }}
                        className={`${
                          salahStatus === "group" ? "border border-white" : ""
                        } px-5 py-3 mb-4 bg-[color:var(--jamaah-status-color)] icon-and-text-wrap rounded-xl w-[80%] mx-auto text-center`}
                      >
                        {" "}
                        <MdPerson className="w-full mb-1 text-3xl" />
                        <p className="inline">Prayed In Jamaah</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("female-alone");
                        }}
                        className={`${
                          salahStatus === "female-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3 mb-4 bg-[color:var(--alone-female-status-color)] icon-and-text-wrap rounded-xl w-[80%] mx-auto text-center`}
                      >
                        {" "}
                        <MdPerson className="w-full mb-1 text-3xl" />
                        <p className="inline">Prayed</p>
                      </div>
                    </>
                  )}
                  {userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("male-alone");
                        }}
                        className={`${
                          salahStatus === "male-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3 mb-4 bg-[color:var(--alone-male-status-color)] icon-and-text-wrap rounded-2xl w-[80%] mx-auto text-center`}
                      >
                        <BsPersonStanding className="w-full mb-1 text-3xl" />
                        <p className="inline">Prayed On Time</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("excused");
                        }}
                        className={`${
                          salahStatus === "excused" ? "border border-white" : ""
                        } px-5 py-3 mb-4 bg-[color:var(--excused-status-color)] icon-and-text-wrap rounded-2xl w-[80%] mx-auto text-center`}
                      >
                        <PiFlower className="w-full mb-1 text-3xl" />
                        <p className="inline">Excused</p>
                      </div>{" "}
                    </>
                  )}
                  <div
                    onClick={() => {
                      setSalahStatus("late");
                    }}
                    className={`${
                      salahStatus === "late" ? "border border-white" : ""
                    } px-5 py-3 mb-4 bg-[color:var(--late-status-color)] icon-and-text-wrap rounded-2xl w-[80%] mx-auto text-center`}
                  >
                    <PiClockCounterClockwise
                      className="w-full mb-1 text-3xl"
                      // style={{
                      //   fontSize: "2rem",
                      //   marginRight: "1rem",
                      //   display: "inline",
                      // }}
                    />
                    <p className="inline">Late</p>
                  </div>
                  <div
                    onClick={() => {
                      setSalahStatus("missed");
                    }}
                    className={`${
                      salahStatus === "missed" ? "border border-white" : ""
                    } px-5 py-3 mb-4 bg-[color:var(--missed-status-color)] icon-and-text-wrap rounded-2xl w-[80%] mx-auto text-center`}
                  >
                    <AiOutlineStop
                      className="w-full mb-1 text-3xl"
                      // style={{
                      //   fontSize: "2rem",
                      //   marginRight: "1rem",
                      //   display: "inline",
                      // }}
                    />
                    <p className="inline">Missed</p>
                  </div>
                </div>
                <div>
                  <p className="my-3 text-sm">Reason (Optional): </p>
                  <div className="flex flex-wrap ">
                    {missedReasonsArray.map((item) => (
                      <p className="p-2 m-1 text-sm border border-blue-400 rounded-xl">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    changePrayerStatus(
                      tableRowDate,
                      selectedSalah,
                      salahStatus
                    );
                    setShowUpdateStatusModal(false);
                    setSalahStatus("");
                  }}
                  className="w-full p-4 mt-5 bg-blue-600 rounded-2xl"
                >
                  Save
                </button>
              </section>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
        <Sheet.Backdrop />
      </Sheet>

      <table
        className="table w-full shadow-lg"
        onClick={(e) => {
          // grabDate(e);
          // setShowUpdateStatusModal(true);
          // e.preventDefault();
          if (e.isTrusted && e.currentTarget.tagName !== "svg") {
            // setShowMonthlyCalenderModal(true);
          }
        }}
      >
        {/* sticky top-0 bg-[color:var(--primary-color)] */}
        <thead className="sticky top-0 bg-[color:var(--primary-color)] thead">
          {/* <tr>
            <th className="border-none"></th>
          </tr> */}
          <tr // role="button"
            // key={uuidv4()}
            // key={"table row: " + item.salahName}
            onClick={(e) => {
              // setShowMonthlyCalenderModal(true);
              // e.stopPropagation();

              // monthlyCalenderToShow =
              //   e.currentTarget.querySelector("td")?.textContent;
              // setMonthlyCalenderToShow(
              //   // e.currentTarget.querySelector("td")?.textContent || ""
              //   e.currentTarget.querySelector("td")?.textContent || ""
              // );
              if (e.currentTarget.tagName !== "svg") {
                // setShowMonthlyCalenderModal(true);
              }
            }}
            className=""
          >
            <th className="w-1/6 "></th>
            {salahTrackingArray?.map((item) => {
              return (
                <th
                  key={uuidv4()}
                  className=" text-sm font-light table-salah-name-th text-[#c4c4c4] w-1/6"
                >
                  {item.salahName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {currentDisplayedDates.map((item) => {
            const dateObject = parse(item, "dd.MM.yy", new Date());
            // const formattedDate = format(parsedDate, "EEE dd");
            const formattedDate = format(dateObject, "dd.MM.yy");
            const formattedDay = format(dateObject, "EEEE");
            // const splitFormattedDate: string[] = formattedDate.split(" ");

            return (
              <tr className="table-row h-12" key={uuidv4()}>
                <td className="align-middle text-[#c4c4c4] text-sm pr-4">
                  <p className="mb-1">{formattedDate}</p>
                  <p>{formattedDay}</p>
                </td>
                {Array.from({ length: 5 }).map((_, index) =>
                  populateCells(formattedDate, index)
                )}
                {/* {populateCells(dateObject)} */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default PrayerTableDisplay;
