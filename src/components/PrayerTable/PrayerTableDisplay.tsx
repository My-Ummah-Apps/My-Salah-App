import React, { useEffect, useState, useRef } from "react";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import { Capacitor } from "@capacitor/core";
// import { Keyboard } from "@capacitor/keyboard";
import Sheet from "react-modal-sheet";
// import CalenderMonthly from "../Stats/CalenderMonthly";
// import StatCard from "../Stats/StatCard";
// import ReactModal from "react-modal";
// import Modal from "./Modal";
import { LuDot } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";

import { salahTrackingEntryType } from "../../types/types";

import { subDays, format, parse, eachDayOfInterval } from "date-fns";

// import StreakCount from "../Stats/StreakCount";
import { PiFlower } from "react-icons/pi";

// import { v4 as uuidv4 } from "uuid";

const PrayerTableDisplay = ({
  userGender,
  userStartDate,
  setSalahTrackingArray,
  salahTrackingArray,
  startDate,
}: {
  userGender: string;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  userStartDate: string;
  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);
  const modalSheetPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  const modalSheetHiddenPrayerReasonsWrap = useRef<HTMLDivElement>(null);

  if (Capacitor.getPlatform() === "ios") {
    Keyboard.setResizeMode({
      mode: KeyboardResize.None,
    });

    window.addEventListener("keyboardWillShow", (e) => {
      if (sheetRef.current) {
        let height = (e as any).keyboardHeight;
        sheetRef.current.style.setProperty(
          "margin-bottom",
          height + "px",
          "important"
        );
      }
    });
    window.addEventListener("keyboardWillHide", (e) => {
      e;

      if (sheetRef.current) {
        sheetRef.current.style.setProperty(
          "margin-bottom",
          0 + "px",
          "important"
        );
      }
    });
  }

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
  // userStartDate = "05.05.22";
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
  const [reasonsArray, setReasonsArray] = useState<string[]>([]);
  // const [showReasonsArray, setShowReasonsArray] = useState(false);
  const [showAddCustomReasonInputBox, setShowAddCustomReasonInputBox] =
    useState(false);
  let selectedReasonsArray = selectedReasons;
  const [customReason, setCustomReason] = useState("");
  const handleCustomReason = (e: any) => {
    setCustomReason(e.target.value);
  };
  const [notes, setNotes] = useState("");
  const handleNotes = (e: any) => {
    setNotes(e.target.value);
  };
  console.log(salahStatus);
  useEffect(() => {
    if (
      modalSheetPrayerReasonsWrap.current &&
      modalSheetHiddenPrayerReasonsWrap.current
    ) {
      // console.log(modalSheetPrayerReasonsWrap.current);
      // console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
      if (
        salahStatus === "male-alone" ||
        salahStatus === "late" ||
        salahStatus === "missed"
      ) {
        modalSheetPrayerReasonsWrap.current.style.maxHeight =
          modalSheetHiddenPrayerReasonsWrap.current.offsetHeight + "px";
        modalSheetPrayerReasonsWrap.current.style.opacity = "1";
      } else {
        modalSheetPrayerReasonsWrap.current.style.maxHeight = "0";
      }
    }
  }, [salahStatus]);
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
  }

  useEffect(() => {
    const storedReasonsArray = localStorage.getItem("storedReasonsArray");
    if (storedReasonsArray) {
      setReasonsArray(JSON.parse(storedReasonsArray));
    } else if (storedReasonsArray === null) {
      const defaultReasonsArray = [
        "Alarm",
        "Education",
        "Family",
        "Friends",
        "Gaming",
        "Guests",
        "Leisure",
        "Movies",
        "Shopping",
        "Sleep",
        "Sports",
        "Travel",
        "TV",
        "Work",
      ];
      localStorage.setItem(
        "storedReasonsArray",
        JSON.stringify(defaultReasonsArray)
      );
      setReasonsArray(defaultReasonsArray);
    }
  }, []);

  let cellIcon: string | JSX.Element;
  function populateCells(formattedDate: string, salah: string, index: number) {
    cellIcon = (
      <LuDot
        className="inline-block rounded-md w-[24px] h-[24px]"
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
        <div className="inline-block rounded-md bg-[color:var(--alone-male-status-color)] text-white w-[24px] h-[24px]"></div>
      );
    } else if (cellIcon === "group") {
      cellIcon = (
        <div className="inline-block rounded-md  bg-[color:var(--jamaah-status-color)] text-white w-[24px] h-[24px]"></div>
      );
    } else if (cellIcon === "female-alone") {
      cellIcon = (
        <div className="inline-block rounded-md  bg-[color:var(--alone-female-status-color)] text-white w-[24px] h-[24px]"></div>
      );
    } else if (cellIcon === "excused") {
      cellIcon = (
        <div className="inline-block rounded-md bg-[color:var(--excused-status-color)] text-white w-[24px] h-[24px]"></div>
      );
    } else if (cellIcon === "late") {
      cellIcon = (
        <div className="inline-block rounded-md bg-[color:var(--late-status-color)] text-white w-[24px] h-[24px] "></div>
      );
    } else if (cellIcon === "missed") {
      cellIcon = (
        <div className="inline-block rounded-md bg-[color:var(--missed-status-color)] red-block text-white w-[24px] h-[24px] "></div>
      );
    }
    return (
      <div
        id="icon-wrap"
        className="flex items-center justify-center h-full pt-6 pb-5 text-center td-element"
        key={uuidv4()}
        onClick={() => {
          grabDate(salah, formattedDate);
          setShowUpdateStatusModal(true);
          // console.log(salahStatus);
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
      {/*  bottom-12 */}
      <div className="sheet-prayer-update-wrap">
        <Sheet
          // rootId="root"
          isOpen={showUpdateStatusModal}
          onClose={() => {
            setShowUpdateStatusModal(false);
          }}
          detent="content-height"
          // transition={{ duration: 100, type: "tween" }}
          // animate={{ rotate: 360 }}
          // transition={{ duration: 2 }}
          tweenConfig={{ ease: "easeOut", duration: 0.3 }} // Adjust duration to slow down or speed up the animation
        >
          <Sheet.Container
            className="react-modal-sheet-container"
            ref={sheetRef}
            style={{ backgroundColor: "rgb(33, 36, 38)" }}
          >
            <Sheet.Header />
            <Sheet.Content>
              <Sheet.Scroller>
                {" "}
                <section className="w-[90%] mx-auto mt-5 mb-20 rounded-lg text-white">
                  <h1 className="mb-5 text-3xl text-center">
                    How did you pray {selectedSalah}?
                  </h1>
                  <div
                    // ref={modalSheetPrayerStatusesWrap}
                    className={`grid grid-cols-4 grid-rows-1 gap-2 text-xs modal-sheet-prayer-statuses-wrap `}
                  >
                    {userGender === "male" ? (
                      <>
                        <div
                          onClick={() => {
                            setSalahStatus("group");
                            setSelectedReasons([]);
                            setNotes("");
                            // setReasonsArray([]);
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
                            // setReasonsArray([]);
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
                            // setReasonsArray(reasonsArray);
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
                            // setReasonsArray([]);
                          }}
                          className={`${
                            salahStatus === "excused"
                              ? "border border-white"
                              : ""
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
                        // setReasonsArray(reasonsArray);
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
                        // setReasonsArray(reasonsArray);
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

                  {/* {salahStatus === "male-alone" ||
                  salahStatus === "late" ||
                  salahStatus === "missed" ? ( */}
                  <div
                    ref={modalSheetPrayerReasonsWrap}
                    className="my-8 overflow-x-hidden prayer-status-modal-reasons-wrap"
                  >
                    <div className="flex justify-between">
                      <h2 className="mb-3 text-sm">Reasons (Optional): </h2>
                      <p
                        onClick={() => {
                          // prompt();
                          setShowAddCustomReasonInputBox(true);
                        }}
                      >
                        {/* + */}
                      </p>
                    </div>
                    <div className="flex flex-wrap ">
                      {/* {missedReasonsArray.map((item) => ( */}
                      {reasonsArray.map((item) => (
                        <p
                          key={uuidv4()}
                          style={{
                            backgroundColor: selectedReasons.includes(item)
                              ? "#2563eb"
                              : "",
                          }}
                          onClick={() => {
                            if (!selectedReasonsArray.includes(item)) {
                              selectedReasonsArray = [...selectedReasons, item];
                            } else if (selectedReasonsArray.includes(item)) {
                              let indexToRemove = selectedReasons.indexOf(item);
                              selectedReasonsArray = selectedReasons.filter(
                                (item) => {
                                  return (
                                    selectedReasons.indexOf(item) !==
                                    indexToRemove
                                  );
                                }
                              );
                            }
                            setSelectedReasons(selectedReasonsArray);
                          }}
                          className="p-2 m-1 text-xs border border-gray-700 b-1 rounded-xl"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  {/* ) : null} */}
                  {showAddCustomReasonInputBox ? (
                    <div className="absolute inline-block p-5 transform -translate-x-1/2 -translate-y-1/2 custom-input-box-wrap top-1/2 left-1/2 bg-slate-950">
                      <p className="mb-5">Enter Custom Reason:</p>
                      <input
                        className="bg-gray-800"
                        type="text"
                        maxLength={10}
                        value={customReason}
                        onChange={handleCustomReason}
                      />
                      <button
                        className="mt-10 bg-blue-700"
                        onClick={() => {
                          const updatedReasonsArray = [
                            ...reasonsArray,
                            customReason,
                          ];

                          setReasonsArray(updatedReasonsArray);
                          setShowAddCustomReasonInputBox(false);
                          localStorage.setItem(
                            "storedReasonsArray",
                            JSON.stringify(updatedReasonsArray)
                          );
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : null}

                  <div
                    className="text-sm notes-wrap"
                    //  useRef={notesBoxRef}
                  >
                    <h2 className="mt-3">Notes (Optional)</h2>
                    <textarea
                      value={notes}
                      onChange={handleNotes}
                      style={{ resize: "vertical" }}
                      // wrap="hard"
                      rows={3}
                      // cols={1}
                      className="w-full p-1 mt-3 bg-transparent border rounded-md border-amber-600"
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
                        // console.log(
                        //   "salahStatus before state update: " + salahStatus
                        // );
                        // setSalahStatus((prevValue) => prevValue + "1");
                        // console.log(
                        //   "salahStatus after state update: " + salahStatus
                        // );
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
      </div>

      {/* <div style={{ width: "100vw !important" }}> */}
      <Table
        style={{
          textTransform: "none",
        }}
        className="text-center "
        rowCount={currentDisplayedDates.length}
        rowGetter={rowGetter}
        rowHeight={100}
        headerHeight={40}
        height={800}
        width={510}
      >
        <Column
          style={{ marginLeft: "0" }}
          className="text-sm text-left "
          label=""
          dataKey="date"
          width={120}
          flexGrow={1}
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
          className="text-center"
          label="Fajr"
          dataKey="date"
          width={80}
          flexGrow={1}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            return <>{populateCells(formattedDate, "Fajr", 0)}</>;
          }}
        />
        <Column
          className="text-center"
          label="Dhuhr"
          dataKey="date"
          width={80}
          flexGrow={1}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            return <>{populateCells(formattedDate, "Dhuhr", 1)}</>;
          }}
        />
        <Column
          className="text-center"
          label="Asar"
          dataKey="date"
          width={80}
          flexGrow={1}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            return <>{populateCells(formattedDate, "Asar", 2)}</>;
          }}
        />
        <Column
          className="text-center"
          label="Maghrib"
          dataKey="date"
          width={80}
          flexGrow={1}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            return <>{populateCells(formattedDate, "Maghrib", 3)}</>;
          }}
        />
        <Column
          className="text-center"
          label="Isha"
          dataKey="date"
          width={80}
          flexGrow={1}
          cellRenderer={({ rowData }) => {
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            return <>{populateCells(formattedDate, "Isha", 4)}</>;
          }}
        />

        {/* Add more columns here if needed */}
      </Table>
      {/* </div> */}
      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
      <div ref={modalSheetHiddenPrayerReasonsWrap}>
        <div className="my-8 overflow-x-hidden prayer-status-modal-reasons-wrap">
          <div className="flex justify-between">
            <h2 className="mb-3 text-sm">Reasons (Optional): </h2>
            <p
              onClick={() => {
                // prompt();
                setShowAddCustomReasonInputBox(true);
              }}
            >
              {/* + */}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap">
          {/* {missedReasonsArray.map((item) => ( */}
          {reasonsArray.map((item) => (
            <p
              key={uuidv4()}
              style={{
                backgroundColor: selectedReasons.includes(item)
                  ? "#2563eb"
                  : "",
              }}
              onClick={() => {
                if (!selectedReasonsArray.includes(item)) {
                  selectedReasonsArray = [...selectedReasons, item];
                } else if (selectedReasonsArray.includes(item)) {
                  let indexToRemove = selectedReasons.indexOf(item);
                  selectedReasonsArray = selectedReasons.filter((item) => {
                    return selectedReasons.indexOf(item) !== indexToRemove;
                  });
                }
                setSelectedReasons(selectedReasonsArray);
              }}
              className="p-2 m-1 text-xs border border-gray-700 b-1 rounded-xl"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrayerTableDisplay;
