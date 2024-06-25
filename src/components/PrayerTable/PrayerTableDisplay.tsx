import React, { useEffect, useState, useRef } from "react";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import { Capacitor } from "@capacitor/core";
import PrayerTableCell from "./PrayerTableCell";
// import { Keyboard } from "@capacitor/keyboard";
import Sheet from "react-modal-sheet";
import useSQLiteDB from "../../utils/useSqLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
// import CalenderMonthly from "../Stats/CalenderMonthly";
// import StatCard from "../Stats/StatCard";
// import ReactModal from "react-modal";
// import Modal from "./Modal";
import { LuDot } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { PiFlower } from "react-icons/pi";

import { salahTrackingEntryType } from "../../types/types";

import { subDays, format, parse, eachDayOfInterval } from "date-fns";

// import StreakCount from "../Stats/StreakCount";

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
  const { performSQLAction, databaseInitialised } = useSQLiteDB();
  const sheetRef = useRef<HTMLDivElement>(null);
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);
  const modalSheetPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  const modalSheetHiddenPrayerReasonsWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [databaseInitialised]);

  const loadData = async () => {
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        // @ts-ignore
        const respSelect = await db?.query(`SELECT * FROM salahtrackingtable`);
        console.log();
        // put a usestate here to set the items
      });
    } catch (error) {
      alert((error as Error).message);
      console.log("ERROR IS COMING FROM LINE 67 in PrayerTableDisplay.tsx");
      // Put a usestate here such as setItems([]);
    }
  };

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
  // const [showReasons, setShowReasons] = useState(false);
  const [showAddCustomReasonInputBox, setShowAddCustomReasonInputBox] =
    useState(false);
  let selectedReasonsArray = selectedReasons;
  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [customReason, setCustomReason] = useState("");
  const handleCustomReason = (e: any) => {
    setCustomReason(e.target.value);
  };
  const [notes, setNotes] = useState("");
  const handleNotes = (e: any) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    // console.log(modalSheetPrayerReasonsWrap.current);
    // console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
    if (
      modalSheetPrayerReasonsWrap.current &&
      modalSheetHiddenPrayerReasonsWrap.current
    ) {
      console.log(modalSheetPrayerReasonsWrap.current);
      console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
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
  }, [hasUserClickedDate, salahStatus]);
  // const [showMonthlyCalenderModal, setShowMonthlyCalenderModal] =
  //   useState(false);

  const doesSalahAndDateExists = async (
    salahName: string,
    formattedDate: string
  ): Promise<boolean> => {
    console.log("SALAH NAME IS: " + salahName);
    console.log("formattedDate DATE IS: " + formattedDate);
    let doesSalahAndDateExistsResult = false;
    try {
      await performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          const count = await db?.query(
            `SELECT COUNT(*) AS count FROM salahtrackingtable WHERE date = ? AND salahName = ?`,
            [formattedDate, salahName]
          );
          console.log("COUNT IS: ");
          console.log(count);
          const result = await db?.query(
            `SELECT * FROM salahtrackingtable WHERE date = ? AND salahName = ?`,
            [formattedDate, salahName]
          );

          if (result && result.values && result.values.length > 0) {
            console.log("RESULT IS: ");
            console.log(result?.values[0]);
            setSalahStatus(result.values[0].salahStatus);
            setSelectedReasons(result.values[0].reasons);
            setNotes(result.values[0].notes);
          } else {
            setSalahStatus("");
            setSelectedReasons([]);
            setNotes("");
          }

          console.log("SALAH STATS IS:");
          console.log(salahStatus);

          if (count && count.values && count.values[0].count > 0) {
            doesSalahAndDateExistsResult = true;
            // alert("Entry exists");
          } else {
            doesSalahAndDateExistsResult = false;
            // alert("Entry does not exist");
          }

          // // update ui
          // const respSelect = await db?.query(
          //   `SELECT * FROM salahtrackingtable;`
          // );
          // setItems(respSelect?.values);
        },
        async () => {
          // setInputName("");
          // setEditItem(undefined);
        }
      );
    } catch (error) {
      alert((error as Error).message);
      console.log("ERROR ON LINE 274 PrayerTableDisplay.tsx");
    }
    return doesSalahAndDateExistsResult === false ? false : true;
  };

  const addSalah = async (
    salahName: string,
    salahStatus: string,
    date: string,
    reasons?: string,
    notes?: string
  ) => {
    console.log("addSalah FUNCTION BEING RUN");
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        let query = `INSERT INTO salahtrackingtable (salahName, salahStatus, date`; // ) values (?,?,?)
        let values = [salahName, salahStatus, date];

        if (reasons !== undefined) {
          query += `, reasons`;
          values.push(reasons);
        }

        if (notes !== undefined) {
          query += `, notes`;
          values.push(notes);
        }

        query += `) VALUES (${values.map(() => "?").join(", ")})`;

        await db?.query(query, values); // If .query isn't working, try .execute instead
        // await db?.execute(query, values);
        console.log("DATA INSERTED INTO DATABASE");
      });
    } catch (error) {
      console.log("ERROR WITHIN addSalah function:");
      console.log(error);
    }
  };

  const changePrayerStatus: (
    tableRowDate: string,
    selectedSalah: string,
    salahStatus: string,
    selectedReasons: string[],
    notes: string
  ) => void = async (tableRowDate, selectedSalah, salahStatus) => {
    const salahAndDateExist = await doesSalahAndDateExists(
      selectedSalah,
      tableRowDate
    );

    if (salahAndDateExist === false) {
      addSalah(selectedSalah, salahStatus, tableRowDate);
    } else if (salahAndDateExist === true) {
    }

    // const newSalahTrackingArray = salahTrackingArray.map((item) => {
    //   if (item.salahName === selectedSalah.replace(/\s/g, "")) {
    //     const doesDateObjectExist = item.completedDates.find((date) => {
    //       return Object.keys(date)[0] === tableRowDate;
    //     });

    //     if (doesDateObjectExist === undefined) {
    //       return {
    //         ...item,
    //         completedDates: [
    //           ...item.completedDates,
    //           {
    //             [tableRowDate]: {
    //               status: salahStatus,
    //               reasons: selectedReasons,
    //               notes: notes,
    //             },
    //           },
    //         ],
    //       };
    //     } else if (doesDateObjectExist !== undefined) {
    //       const filteredCompletedDatesArray = item.completedDates.filter(
    //         (date) => {
    //           return (
    //             Object.keys(doesDateObjectExist)[0] !== Object.keys(date)[0]
    //           );
    //         }
    //       );

    //       return {
    //         ...item,
    //         completedDates: [
    //           ...filteredCompletedDatesArray,
    //           {
    //             [tableRowDate]: {
    //               status: salahStatus,
    //               reasons: selectedReasons,
    //               notes: notes,
    //             },
    //           },
    //         ],
    //       };
    //     }
    //   }

    //   return item;
    // });
    // setSalahTrackingArray(newSalahTrackingArray);

    // localStorage.setItem(
    //   "storedSalahTrackingData",
    //   JSON.stringify(newSalahTrackingArray)
    // );
  };

  // const addSalahAndDateEntry = async (
  //   formattedDate: string,
  //   salahName: string
  // ) => {
  //   try {
  //     performSQLAction(async (db: SQLiteDBConnection | undefined) => {
  //       await db?.query(
  //         `INSERT INTO salahtrackingtable (date, salahName, salahStatus) values (?,?,?)`,
  //         [formattedDate, salahName, salahStatus]
  //       );
  //     });
  //   } catch (error) {}
  // };

  async function grabDate(salahName: string, formattedDate: string) {
    setSalahStatus("");
    setSelectedReasons([]);
    setNotes("");

    let tableRowDate = formattedDate;
    // Does salahAndDateExist need to exists in two places?
    // const salahAndDateExist = await doesSalahAndDateExists(
    //   salahName,
    //   tableRowDate
    // );
    await doesSalahAndDateExists(salahName, tableRowDate);

    // if (salahAndDateExist === true) {
    // } else if (salahAndDateExist === false) {
    //   setSalahStatus("");
    //   setSelectedReasons([]);
    //   setNotes("");
    // }

    // salahTrackingArray.forEach((item) => {
    //   if (item.salahName === salahName) {
    //     for (let i = 0; i < item.completedDates.length; i++) {
    //       // console.log(item.completedDates[i]);
    //       if (item.completedDates[i][tableRowDate]) {
    //         // console.log("TRUE");
    //         // setSalahStatus(item.completedDates[i][tableRowDate].status);
    //         // setSelectedReasons(item.completedDates[i][tableRowDate].reasons);
    //         // setNotes(item.completedDates[i][tableRowDate].notes);
    //       }
    //     }
    //   }
    // });

    setSelectedSalah(salahName);
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

  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";

  let cellIcon: string | JSX.Element;
  async function populateCells(
    formattedDate: string,
    salahName: string,
    index: number
  ) {
    cellIcon = (
      <LuDot
        className=" w-[24px] h-[24px]"
        onClick={(e: React.MouseEvent<SVGElement>) => {
          if (e.currentTarget.tagName === "svg") {
            // setShowUpdateStatusModal(true);
          }
        }}
      />
    );

    if (await doesSalahAndDateExists(salahName, formattedDate)) {
      // cellIcon = salahStatus;
    }

    const matchedObject = salahTrackingArray[index]?.completedDates.find(
      (obj) => {
        return formattedDate === Object.keys(obj)[0];
      }
    );

    // const iconColorMap = {
    //   "male-alone": "bg-[color:var(--alone-male-status-color)]",
    //   "group": "bg-[color:var(--jamaah-status-color)]",
    //   "female-alone": "bg-[color:var(--alone-female-status-color)]",
    //   "excused": "bg-[color:var(--excused-status-color)]",
    //   "late": "bg-[color:var(--late-status-color)]",
    //   "missed": "bg-[color:var(--missed-status-color)] red-block",
    // };

    // if (matchedObject !== undefined) {
    //   cellIcon = matchedObject[formattedDate].status;
    // }

    // if (cellIcon === "male-alone") {
    //   cellIcon = (
    //     <div
    //       className={`${iconStyles} bg-[color:var(--alone-male-status-color)]`}
    //     ></div>
    //   );
    // } else if (cellIcon === "group") {
    //   cellIcon = (
    //     <div
    //       className={`${iconStyles} bg-[color:var(--jamaah-status-color)] `}
    //     ></div>
    //   );
    // } else if (cellIcon === "female-alone") {
    //   cellIcon = (
    //     <div
    //       className={`${iconStyles} bg-[color:var(--alone-female-status-color)] `}
    //     ></div>
    //   );
    // } else if (cellIcon === "excused") {
    //   cellIcon = (
    //     <div
    //       className={`${iconStyles} bg-[color:var(--excused-status-color)] `}
    //     ></div>
    //   );
    // } else if (cellIcon === "late") {
    //   cellIcon = (
    //     <div
    //       className={`${iconStyles} bg-[color:var(--late-status-color)]  `}
    //     ></div>
    //   );
    // } else if (cellIcon === "missed") {
    //   cellIcon = (
    //     <div
    //       className={`${iconStyles} bg-[color:var(--missed-status-color)] red-block  `}
    //     ></div>
    //   );
    // }
    // return (
    //   <div
    //     id="icon-wrap"
    //     className="flex items-center justify-center h-full pt-6 pb-5 text-center td-element"
    //     key={uuidv4()}
    //     onClick={() => {
    //       grabDate(salahName, formattedDate);
    //       setShowUpdateStatusModal(true);
    //       setHasUserClickedDate(true);
    //     }}
    //   >
    //     {cellIcon}
    //   </div>
    // );

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
    <section className="relative">
      <div className="sheet-prayer-update-wrap">
        <Sheet
          // rootId="root"
          isOpen={showUpdateStatusModal}
          onClose={() => {
            setShowUpdateStatusModal(false);
            setHasUserClickedDate(false);
          }}
          detent="content-height"
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
                            // setShowReasons(false);
                            setSelectedReasons([]);
                            setNotes("");
                            // setReasonsArray([]);
                          }}
                          className={`${
                            salahStatus === "group" ? "border border-white" : ""
                          } px-5 py-3 bg-[color:var(--jamaah-status-color)] icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                            // setShowReasons(false);
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
                            // setShowReasons(true);
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
                            // setShowReasons(false);
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
                        // setShowReasons(true);
                        // setReasonsArray(reasonsArray);
                      }}
                      className={`${
                        salahStatus === "late" ? "border border-white" : ""
                      } px-5 py-3 bg-[color:var(--late-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                    >
                      <GoClock className="w-full mb-1 text-3xl" />
                      <p className="inline">Late</p>
                    </div>
                    <div
                      onClick={() => {
                        setSalahStatus("missed");
                        // setShowReasons(true);
                        // setReasonsArray(reasonsArray);
                      }}
                      className={`${
                        salahStatus === "missed" ? "border border-white" : ""
                      } px-5 py-3 bg-[color:var(--missed-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                    >
                      <GoSkip className="w-full mb-1 text-3xl" />
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
                          // style={{
                          //   backgroundColor: selectedReasons.includes(item)
                          //     ? "#2563eb"
                          //     : "",
                          // }}
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
                          // border border-gray-700 b-1 rounded-xl
                          className="p-2 m-1 text-xs bg-[rgba(0, 0, 0, 1)] bg-gray-800/70 rounded-xl"
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
                        setHasUserClickedDate(false);

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
          <Sheet.Backdrop onTap={close} />
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
            // return <>{populateCells(formattedDate, "Fajr", 0)}</>;
            return (
              <PrayerTableCell
                salahStatus={salahStatus}
                grabDate={grabDate}
                setShowUpdateStatusModal={setShowUpdateStatusModal}
                setHasUserClickedDate={setHasUserClickedDate}
                doesSalahAndDateExists={doesSalahAndDateExists}
                formattedDate={formattedDate}
                salahName="Fajr"
                iconStyles={iconStyles}
              />
            );
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
            // return <>{populateCells(formattedDate, "Dhuhr", 1)}</>;
            // return <div>hi</div>;
            return (
              <PrayerTableCell
                salahStatus={salahStatus}
                grabDate={grabDate}
                setShowUpdateStatusModal={setShowUpdateStatusModal}
                setHasUserClickedDate={setHasUserClickedDate}
                doesSalahAndDateExists={doesSalahAndDateExists}
                formattedDate={formattedDate}
                salahName="Dhuhr"
                iconStyles={iconStyles}
              />
            );
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
            // return <>{populateCells(formattedDate, "Asar", 2)}</>;
            // return <div>hi</div>;
            return (
              <PrayerTableCell
                salahStatus={salahStatus}
                grabDate={grabDate}
                setShowUpdateStatusModal={setShowUpdateStatusModal}
                setHasUserClickedDate={setHasUserClickedDate}
                doesSalahAndDateExists={doesSalahAndDateExists}
                formattedDate={formattedDate}
                salahName="Asar"
                iconStyles={iconStyles}
              />
            );
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
            // return <>{populateCells(formattedDate, "Maghrib", 3)}</>;
            // return <div>hi</div>;
            return (
              <PrayerTableCell
                salahStatus={salahStatus}
                grabDate={grabDate}
                setShowUpdateStatusModal={setShowUpdateStatusModal}
                setHasUserClickedDate={setHasUserClickedDate}
                doesSalahAndDateExists={doesSalahAndDateExists}
                formattedDate={formattedDate}
                salahName="Maghrib"
                iconStyles={iconStyles}
              />
            );
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
            // return <>{populateCells(formattedDate, "Isha", 4)}</>;
            // return <div>hi</div>;
            return (
              <PrayerTableCell
                salahStatus={salahStatus}
                grabDate={grabDate}
                setShowUpdateStatusModal={setShowUpdateStatusModal}
                setHasUserClickedDate={setHasUserClickedDate}
                doesSalahAndDateExists={doesSalahAndDateExists}
                formattedDate={formattedDate}
                salahName="Isha"
                iconStyles={iconStyles}
              />
            );
          }}
        />

        {/* Add more columns here if needed */}
      </Table>
      {/* </div> */}
      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
      <div
        className="absolute z-[-100]"
        ref={modalSheetHiddenPrayerReasonsWrap}
      >
        <div
          style={
            {
              // visibility: "hidden",
              // transform: "translateX(1000px)",
              // position: "absolute",
              // backgroundColor: "transparent",
              // color: "transparent",
              // border: "none",
              // left: "30%",
              // zIndex: "-100",
            }
          }
        >
          <div className="overflow-x-hidden prayer-status-modal-reasons-wrap">
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
        </div>
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
        <div className="flex flex-wrap">
          {/* {missedReasonsArray.map((item) => ( */}
          {reasonsArray.map((item) => (
            <p
              key={uuidv4()}
              // style={{
              //   backgroundColor: selectedReasons.includes(item)
              //     ? "#2563eb"
              //     : "",
              // }}
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
