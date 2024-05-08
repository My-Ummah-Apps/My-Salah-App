import React, { useState } from "react";
// import Modal from "./Modal";
import { v4 as uuidv4 } from "uuid";
// import { FixedSizeList as List } from "react-window";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import Sheet from "react-modal-sheet";
// import CalenderMonthly from "../Stats/CalenderMonthly";
// import StatCard from "../Stats/StatCard";
// import ReactModal from "react-modal";
// import { FaMosque, FaHome } from "react-icons/fa";
// import { ImCross } from "react-icons/im";

// import { MdGroups, MdPerson } from "react-icons/md";
// import { MdPerson } from "react-icons/md";
import { LuDot } from "react-icons/lu";
// import { BsPersonStanding } from "react-icons/bs";
// import { AiOutlineStop } from "react-icons/ai";
// import { GoCircleSlash } from "react-icons/go";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";

// import { PiClockCounterClockwise } from "react-icons/pi";
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
  userStartDate = "05.05.22";
  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  const endDate = new Date(); // Current date
  const datesBetween = eachDayOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });
  // console.log(datesBetween.length);
  const datesFormatted = datesBetween.map((date) => format(date, "dd.MM.yy"));
  datesFormatted.reverse();
  let currentDisplayedDates: string[] = [];
  function generateDisplayedWeek() {
    currentDisplayedDates = Array.from(
      // { length: datesBetween.length },
      { length: datesBetween.length },
      (_, index) => {
        const date = subDays(startDate, index);
        return format(date, "dd.MM.yy");
      }
    );
  }

  generateDisplayedWeek();

  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [salahStatus, setSalahStatus] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reasonsArray, setReasonsArray] = useState<string[]>();
  let arr = selectedReasons;
  const [notes, setNotes] = useState("");
  const handleNotes = (e: any) => {
    setNotes(e.target.value);
  };
  // const [showMonthlyCalenderModal, setShowMonthlyCalenderModal] =
  //   useState(false);

  const changePrayerStatus: (
    tableRowDate: string,
    selectedSalah: string,
    salahStatus: string,
    selectedReasons: string[],
    notes: string
  ) => void = (tableRowDate, selectedSalah, salahStatus) => {
    const newSalahTrackingArray = salahTrackingArray.map((item) => {
      if (item.salahName === selectedSalah.replace(/\s/g, "")) {
        const doesDateObjectExist = item.completedDates.find((date) => {
          return Object.keys(date)[0] === tableRowDate;
        });

        if (doesDateObjectExist === undefined) {
          return {
            ...item,
            completedDates: [
              ...item.completedDates,
              {
                [tableRowDate]: {
                  status: salahStatus,
                  reasons: selectedReasons,
                  notes: notes,
                },
              },
            ],
          };
        } else if (doesDateObjectExist !== undefined) {
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
              {
                [tableRowDate]: {
                  status: salahStatus,
                  reasons: selectedReasons,
                  notes: notes,
                },
              },
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

  function grabDate(salah: string, formattedDate: string) {
    setSalahStatus("");
    setSelectedReasons([]);
    setNotes("");

    let tableRowDate = formattedDate;

    salahTrackingArray.forEach((item) => {
      if (item.salahName === salah) {
        for (let i = 0; i < item.completedDates.length; i++) {
          // console.log(item.completedDates[i]);
          if (item.completedDates[i][tableRowDate]) {
            // console.log("TRUE");
            setSalahStatus(item.completedDates[i][tableRowDate].status);
            setSelectedReasons(item.completedDates[i][tableRowDate].reasons);
            setNotes(item.completedDates[i][tableRowDate].notes);
          }
        }
      }
    });

    setSelectedSalah(salah);
    setTableRowDate(tableRowDate);
    console.log(selectedSalah);
    console.log(tableRowDate);
  }

  let missedReasonsArray = [
    "missedArray:",
    "Alarm",
    "Family",
    "Guests",
    "Friends",
    "Movies",
    "Sleep",
  ];
  let lateReasonsArray = [
    "lateArray:",
    "Alarm",
    "Family",
    "Friends",
    "Guests",
    "Movies",
    "Sleep",
    "Alarm",
    "Family",
    "Friends",
    "Guests",
    "Movies",
    "Sleep",
  ];
  let prayedAloneReasonsArray = [
    "alonearray: ",
    "Family",
    "Friends",
    "Guests",
    "Movies",
    "Sleep",
    "Alarm",
    "Family",
    "Friends",
    "Guests",
    "Movies",
    "Sleep",
    "Alarm",
  ];

  let cellIcon: string | JSX.Element;
  function populateCells(formattedDate: string, salah: string, index: number) {
    cellIcon = (
      <LuDot
        className="inline-block rounded-md w-[24px] h-[24px] self-center justify-self-center m-1"
        onClick={(e: React.MouseEvent<SVGElement>) => {
          if (e.currentTarget.tagName === "svg") {
            // setShowUpdateStatusModal(true);
          }
        }}
      />
    );

    const matchedObject = salahTrackingArray[index]?.completedDates.find(
      (obj) => {
        return formattedDate === Object.keys(obj)[0];
      }
    );

    if (matchedObject !== undefined) {
      cellIcon = matchedObject[formattedDate].status;
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
      <div
        id="icon-wrap"
        // className="h-full pt-6 pb-5 text-center td-element"
        key={uuidv4()}
        onClick={() => {
          grabDate(salah, formattedDate);
          setShowUpdateStatusModal(true);
        }}
      >
        {cellIcon}
      </div>
    );

    // pt-2
    // <div key={uuidv4()} className="h-full pt-6 pb-5 text-center td-element">
    // <div
    //   id="icon-wrap"
    //   // className="h-full pt-6 pb-5 text-center td-element"
    //   key={uuidv4()}
    //   onClick={(e) => {
    //     // e.stopPropagation();
    //     grabDate(e);
    //     setShowUpdateStatusModal(true);
    //   }}
    // >
    //   {cellIcon}
    // </div>
    // {/* </div> */}

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

  const rowGetter = ({ index }: any) => {
    return currentDisplayedDates[index]; // Return data for the row at the specified index
  };

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
              <section className="w-[90%] mx-auto mt-5 mb-20 rounded-lg text-white">
                <h1 className="mb-5 text-3xl text-center">
                  How did you pray {selectedSalah}?
                </h1>
                <div className="grid grid-cols-4 grid-rows-1 gap-2 text-xs salah-statuses-wrap">
                  {userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("group");
                          setReasonsArray([]);
                        }}
                        className={`${
                          salahStatus === "group" ? "border border-white" : ""
                        } px-5 py-3  bg-[color:var(--jamaah-status-color)] icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        {" "}
                        <GoPeople className="w-full mb-1 text-3xl" />
                        <p className="inline"> In Jamaah</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("female-alone");
                          setReasonsArray([]);
                        }}
                        className={`${
                          salahStatus === "female-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3 bg-[color:var(--alone-female-status-color)] icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        {" "}
                        <GoPerson className="w-full mb-1 text-3xl" />
                        <p className="inline">Prayed</p>
                      </div>
                    </>
                  )}
                  {userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("male-alone");
                          setReasonsArray(prayedAloneReasonsArray);
                        }}
                        className={`${
                          salahStatus === "male-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3  bg-[color:var(--alone-male-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        <GoPerson className="w-full mb-1 text-3xl" />
                        <p className="inline">On Time</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("excused");
                          setReasonsArray([]);
                        }}
                        className={`${
                          salahStatus === "excused" ? "border border-white" : ""
                        } px-5 py-3  bg-[color:var(--excused-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        <PiFlower className="w-full mb-1 text-3xl" />
                        <p className="inline">Excused</p>
                      </div>{" "}
                    </>
                  )}
                  <div
                    onClick={() => {
                      setSalahStatus("late");
                      setReasonsArray(lateReasonsArray);
                    }}
                    className={`${
                      salahStatus === "late" ? "border border-white" : ""
                    } px-5 py-3 bg-[color:var(--late-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                  >
                    <GoClock
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
                      setReasonsArray(missedReasonsArray);
                    }}
                    className={`${
                      salahStatus === "missed" ? "border border-white" : ""
                    } px-5 py-3 bg-[color:var(--missed-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                  >
                    <GoSkip
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
                <div className="reasons-wrap">
                  <h2 className="my-3 text-sm">Reason (Optional): </h2>
                  <div className="flex flex-wrap ">
                    {/* {missedReasonsArray.map((item) => ( */}
                    {reasonsArray?.map((item) => (
                      <p
                        key={uuidv4()}
                        style={{
                          backgroundColor: selectedReasons.includes(item)
                            ? "#2563eb"
                            : "",
                        }}
                        onClick={() => {
                          if (!arr.includes(item)) {
                            arr = [...selectedReasons, item];
                          } else if (arr.includes(item)) {
                            console.log(item);
                            let indexToRemove = selectedReasons.indexOf(item);
                            arr = selectedReasons.filter((item) => {
                              return (
                                selectedReasons.indexOf(item) !== indexToRemove
                              );
                            });
                          }

                          setSelectedReasons(arr);
                        }}
                        className="p-2 m-1 text-xs border border-gray-700 b-1 rounded-xl"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-sm notes-wrap">
                  <h2 className="mt-3">Notes (Optional)</h2>
                  <textarea
                    value={notes}
                    onChange={handleNotes}
                    style={{ resize: "vertical" }}
                    // wrap="hard"
                    rows={3}
                    // cols={1}
                    className="w-full mt-3 bg-transparent border rounded-md border-amber-600"
                  />
                </div>
                <button
                  onClick={() => {
                    if (salahStatus) {
                      changePrayerStatus(
                        tableRowDate,
                        selectedSalah,
                        salahStatus,
                        selectedReasons,
                        notes
                      );
                      setShowUpdateStatusModal(false);
                    }
                  }}
                  className={`w-full p-4 mt-5 rounded-2xl bg-blue-600 ${
                    salahStatus ? "opacity-100" : "opacity-20"
                  }`}
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

      <Table
        rowCount={currentDisplayedDates.length}
        rowGetter={rowGetter}
        rowHeight={100}
        headerHeight={40}
        height={600}
        width={1000}
      >
        <Column
          label=""
          dataKey="date"
          width={75}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            const formattedDay = format(dateObject, "EEEE");

            return (
              <>
                <p>{formattedDate}</p>
                <p>{formattedDay}</p>
              </>
            );
          }}
        />
        <Column
          label="Fajr"
          dataKey="date"
          width={75}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");

            return <>{populateCells(formattedDate, "Fajr", 0)}</>;
          }}
        />
        <Column
          label="Dhuhr"
          dataKey="date"
          width={75}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");

            return <>{populateCells(formattedDate, "Dhuhr", 1)}</>;
          }}
        />
        <Column
          label="Asar"
          dataKey="date"
          width={75}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");

            return <>{populateCells(formattedDate, "Asar", 2)}</>;
          }}
        />
        <Column
          label="Maghrib"
          dataKey="date"
          width={75}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");

            return <>{populateCells(formattedDate, "Maghrib", 3)}</>;
          }}
        />
        <Column
          label="Isha"
          dataKey="date"
          width={75}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");

            return <>{populateCells(formattedDate, "Isha", 4)}</>;
          }}
        />

        {/* Add more columns here if needed */}
      </Table>
    </section>
  );
};

export default PrayerTableDisplay;
