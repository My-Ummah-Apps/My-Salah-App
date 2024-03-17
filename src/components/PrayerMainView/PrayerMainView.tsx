import React, { useState } from "react";
// import Modal from "./Modal";
import { v4 as uuidv4 } from "uuid";
import Sheet from "react-modal-sheet";
import CalenderMonthly from "../Stats/CalenderMonthly";
import StatCard from "../Stats/StatCard";
// import ReactModal from "react-modal";
// import { FaMosque, FaHome } from "react-icons/fa";
// import { ImCross } from "react-icons/im";

import { MdGroups } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import { BsPersonStanding } from "react-icons/bs";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { AiOutlineStop } from "react-icons/ai";
// import { RiSunFill } from "react-icons/ri";
// import { FaMoon } from "react-icons/fa";

// import { render } from "react-dom";
import { salahTrackingEntryType } from "../../types/types";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

import {
  subDays,
  format,
  parse,
  startOfToday,
  startOfMonth,
  // differenceInDays,
} from "date-fns";
import StreakCount from "../Stats/StreakCount";
import FajrSvg from "../SvgIcons/FajrSvg";

// import { v4 as uuidv4 } from "uuid";

const PrayerMainView = ({
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  currentWeek,
  startDate,
}: {
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;

  salahTrackingArray: salahTrackingEntryType[];
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;
  startDate: Date;
}) => {
  const [monthlyCalenderToShow, setMonthlyCalenderToShow] = useState("");

  // const [streakCounter, setStreakCounter] = useState(0);

  // BELOW CODE IS FROM CALENDER.TSX TO MAKE MONTHLY CALENDER FUNCTIONALITY WORK WHEN A TABLE ROW IS CLICKED
  // THIS IS ALL DUPLICATE CODE FROM CALENDER.TSX AND NEED TO FIND A MORE EFFICIENT WAY OF DOING THIS
  //  ----------------------------------------------

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = startOfToday();
  const isDayInSpecificMonth = (dayToCheck: Date, currentMonth: string) => {
    const parsedCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  const countCompletedDates = (date: string, salahName?: string) => {
    const allDatesWithinSalahTrackingArray = salahTrackingArray.reduce<
      string[]
    >((accumulatorArray, salah) => {
      if (salah.salahName === salahName) {
        salah.completedDates.forEach((item) => {
          accumulatorArray.push(Object.keys(item)[0]);
        });
      } else if (!salahName) {
        salah.completedDates.forEach((item) => {
          accumulatorArray.push(Object.keys(item)[0]);
        });
      }
      return accumulatorArray;
    }, []);

    let sameDatesArray = allDatesWithinSalahTrackingArray.filter(
      (currentDate) => currentDate === date
    );

    let sameDatesArrayLength = sameDatesArray.length;

    let color;

    if (salahName) {
      if (sameDatesArrayLength === 0) {
        color = "transparent";
      } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
        color = "green";
      }
    } else if (!salahName) {
      if (sameDatesArrayLength === 0) {
        color = "transparent";
      } else if (sameDatesArrayLength > 0 && sameDatesArrayLength < 5) {
        color = "orange";
      } else if (sameDatesArrayLength === 5) {
        color = "green";
      }
    }

    sameDatesArray = [];
    return color;
  };
  // END OF CODE FROM CALENDER.TSX ----------------------------------------------

  // const [icon, setIcon] = useState("");
  // const [showCalenderOneMonth, setShowCalenderOneMonth] = useState(false);
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (event: any) => {
    // console.log("touchevent STARTED " + event.changedTouches[0].screenX);
    setTouchStartX(event.changedTouches[0].screenX);
  };

  const handleTouchEnd = (event: any) => {
    // console.log("touchevent ENDED " + event.changedTouches[0].screenX);
    setTouchEndX(event.changedTouches[0].screenX);
    handleGesture();
  };

  const handleGesture = () => {
    const threshold = window.innerWidth / 5;
    const swipeDistance = touchEndX - touchStartX;

    if (threshold < Math.abs(swipeDistance)) {
      // setCurrentWeek((prevValue) => prevValue + 5);
    } else if (Math.abs(swipeDistance) > threshold) {
      // setCurrentWeek((prevValue) => prevValue - 5);
    }
  };

  // const SalahIcons: string[] = ["<RiSunFill />", "<FaMoon />"];

  // Array to hold the last five dates
  let currentDisplayedWeek: string[] = [];
  function generateDisplayedWeek() {
    currentDisplayedWeek = Array.from({ length: 5 }, (_, index) => {
      const date = subDays(startDate, 4 - index);
      return format(date, "dd.MM.yy");
    });
  }

  // generateDisplayedWeek(currentWeek);
  generateDisplayedWeek();

  // let salahStatus: string = "";

  // const [showModal, setShowModal] = useState(false);
  // const [isOpen, setOpen] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showMonthlyCalenderModal, setShowMonthlyCalenderModal] =
    useState(false);

  const changePrayerStatus: (
    tableHeadDate: string,
    selectedSalah: string,
    salahStatus: string
    // icon
  ) => void = (tableHeadDate, selectedSalah, salahStatus) => {
    const newSalahTrackingArray = salahTrackingArray.map((item) => {
      if (item.salahName === selectedSalah.replace(/\s/g, "")) {
        const doesDateObjectExist = item.completedDates.find((date) => {
          return Object.keys(date)[0] === tableHeadDate;
        });

        if (salahStatus === "blank") {
          if (doesDateObjectExist === undefined) {
            return {
              ...item,
              completedDates: [...item.completedDates],
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
              completedDates: [...filteredCompletedDatesArray],
            };
          }
        }

        if (doesDateObjectExist === undefined && salahStatus !== "blank") {
          return {
            ...item,
            completedDates: [
              ...item.completedDates,
              { [tableHeadDate]: salahStatus },
            ],
          };
        } else if (
          doesDateObjectExist !== undefined &&
          salahStatus !== "blank"
        ) {
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
              { [tableHeadDate]: salahStatus },
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
    let clickedElement: any;
    if (!salahName && !date) {
      // console.log("!salahName && !date do not exist");
      clickedElement = e.target.closest("#icon-wrap");
      const columnIndex: any = clickedElement.parentElement
        .cellIndex as HTMLTableCellElement;

      let selectedSalah =
        clickedElement.parentElement.parentElement.cells[0].innerText;

      const tableHeadDate =
        clickedElement.parentElement.parentElement.parentElement.parentElement
          .children[0].children[0].cells[columnIndex].textContent;

      setSelectedSalah(selectedSalah);
      setTableHeadDate(tableHeadDate);
    } else if (salahName && date) {
      // console.log("salahName && date exists");
      setSelectedSalah(salahName);
      setTableHeadDate(date);
    }
  }

  function renderCells(index: number) {
    return currentDisplayedWeek.map((date: any) => {
      let cellIcon: string | JSX.Element = (
        <LuDot
          onClick={(e: React.TouchEvent<HTMLDivElement>) => {
            // e.stopPropagation();

            if (e.currentTarget.tagName === "svg") {
              // setShowUpdateStatusModal(true);
            }
          }}
          className="flex self-center justify-self-center pt-2 px-3 pb-4 w-[40px] h-[40px]"
        />
      );
      const matchedObject = salahTrackingArray[index]?.completedDates.find(
        (obj) => date === Object.keys(obj)[0]
      );

      if (matchedObject !== undefined) {
        cellIcon = matchedObject[date];
      }
      if (cellIcon === "alone") {
        cellIcon = (
          <BsPersonStanding
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`flex self-center justify-self-center pt-2 px-3 pb-4 w-[40px] h-[40px]`}
          />
        );
      } else if (cellIcon === "group") {
        console.log("group");
        cellIcon = (
          <MdGroups
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`flex self-center justify-self-center pt-2 px-3 pb-4 w-[40px] h-[40px]`}
          />
        );
      } else if (cellIcon === "missed") {
        cellIcon = (
          <AiOutlineStop
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`flex self-center justify-self-center pt-2 px-3 pb-4 w-[40px] h-[40px]`}
          />
        );
      }
      return (
        <td key={uuidv4()} className="h-full border-none">
          <div
            id="icon-wrap"
            onClick={(e) => {
              e.stopPropagation();
              setShowUpdateStatusModal(true);
              grabDate(e);
            }}
          >
            {cellIcon}
          </div>
        </td>
      );
    });
  }

  // const wreathStyles = {
  //   // height: "30%",
  //   width: "35%",
  // };

  return (
    <section onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Sheet
        isOpen={showUpdateStatusModal}
        onClose={() => setShowUpdateStatusModal(false)}
        detent="content-height"
        // tweenConfig = { ease: 'easeOut', duration: 0.2 }
      >
        <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Header />
          <Sheet.Content>
            {" "}
            <section className="mx-auto my-10">
              <div className="my-4 icon-and-text-wrap">
                <MdGroups
                  className="inline mr-4 text-3xl"
                  // style={{
                  //   fontSize: "2rem",
                  //   marginRight: "1rem",
                  //   display: "inline",
                  // }}
                  onClick={() => {
                    changePrayerStatus(tableHeadDate, selectedSalah, "group");
                    setShowUpdateStatusModal(false);
                  }}
                />
                <p className="inline">Prayed In Jamaah</p>
              </div>
              <div className="my-4 icon-and-text-wrap">
                <BsPersonStanding
                  className="inline mr-4 text-3xl"
                  style={
                    {
                      // fontSize: "2rem",
                      // marginRight: "1rem",
                      // display: "inline",
                    }
                  }
                  onClick={() => {
                    changePrayerStatus(tableHeadDate, selectedSalah, "alone");
                    setShowUpdateStatusModal(false);
                  }}
                />
                <p className="inline">Prayed On Time</p>
              </div>
              <div className="my-4 icon-and-text-wrap">
                <LuDot
                  className="inline mr-4 text-3xl"
                  // style={{
                  //   fontSize: "2rem",
                  //   marginRight: "1rem",
                  //   display: "inline",
                  // }}
                  onClick={() => {
                    changePrayerStatus(tableHeadDate, selectedSalah, "blank");
                    setShowUpdateStatusModal(false);
                  }}
                />
                <p className="inline">Blank</p>
              </div>
              <div className="my-4 icon-and-text-wrap">
                <AiOutlineStop
                  className="inline mr-4 text-3xl"
                  // style={{
                  //   fontSize: "2rem",
                  //   marginRight: "1rem",
                  //   display: "inline",
                  // }}
                  onClick={() => {
                    changePrayerStatus(tableHeadDate, selectedSalah, "missed");
                    setShowUpdateStatusModal(false);
                  }}
                />
                <p className="inline">Missed</p>
              </div>
            </section>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
        <Sheet.Backdrop />
      </Sheet>
      <Sheet
        isOpen={showMonthlyCalenderModal}
        onClose={() => setShowMonthlyCalenderModal(false)}
        detent="content-height"
      >
        <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Header />
          <Sheet.Content>
            <Sheet.Scroller>
              {" "}
              <section className="p-5">
                <h1 className="m-5 text-2xl text-center">
                  {monthlyCalenderToShow}
                </h1>
                <StreakCount />
                {/* <div className="mb-10 streak-wrap">
                  <div className="relative flex items-center justify-center wreath-and-text-wrap">
                    <img
                      style={{ width: "150px", marginRight: "-4rem" }}
                      src="/src/assets/icons/wreath-left.png"
                      alt=""
                      srcSet=""
                    />
                    <div className="absolute">
                      <h1 className="mb-1 text-4xl font-extrabold text-center">
                        {"1 Days"}
                      </h1>
                      <h2 className="text-xs text-center">Current Streak</h2>
                    </div>
                    <img
                      style={{ width: "150px", marginLeft: "7rem" }}
                      src="/src/assets/icons/wreath-right.png"
                      alt=""
                      srcSet=""
                    />
                  </div>
                </div> */}

                <CalenderMonthly
                  // getNextMonth={getNextMonth}
                  // getPrevMonth={getPrevMonth}
                  grabDate={grabDate}
                  setShowUpdateStatusModal={setShowUpdateStatusModal}
                  salahName={monthlyCalenderToShow}
                  days={days}
                  currentMonth={format(today, "MMM-yyyy")}
                  isDayInSpecificMonth={isDayInSpecificMonth}
                  countCompletedDates={countCompletedDates}
                  setSalahTrackingArray={setSalahTrackingArray}
                  salahTrackingArray={salahTrackingArray}
                  startDate={startDate}
                  setCurrentWeek={setCurrentWeek}
                  currentWeek={currentWeek}
                  // modifySingleDaySalah={modifySingleDaySalah}
                />
                <div className="grid grid-cols-2">
                  <StatCard statName={"In jamaah"} />
                  <StatCard statName={"On time"} />
                  <StatCard statName={"Late"} />
                  <StatCard statName={"Not Prayed"} />
                </div>
                {/* <Calender
                // setShowCalenderOneMonth={setShowCalenderOneMonth}
                showCalenderOneMonth={showCalenderOneMonth}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                startDate={startDate}
                setCurrentWeek={setCurrentWeek}
                currentWeek={currentWeek}
              /> */}
              </section>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
      <table
        className="w-full shadow-lg"
        onClick={(e) => {
          // grabDate(e);
          // setShowUpdateStatusModal(true);
          // e.preventDefault();
          if (e.isTrusted && e.currentTarget.tagName !== "svg") {
            // setShowMonthlyCalenderModal(true);
          }
        }}
      >
        <thead className="">
          <tr className="hidden">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item) => {
              return (
                <td
                  key={uuidv4()}
                  // key={"invisible td: " + item}
                  className="text-xs border-none"
                >
                  {item}
                </td>
              );
            })}
          </tr>
          <tr className="h-12">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item) => {
              const parsedDate = parse(item, "dd.MM.yy", new Date());
              const formattedDate = format(parsedDate, "EEE dd");
              const splitFormattedDate: string[] = formattedDate.split(" ");

              return (
                <td
                  key={uuidv4()}
                  // key={"visible td: " + item}
                  className="border-none text-[#c4c4c4] text-center"
                >
                  {/* {formattedDate} */}
                  <p>{splitFormattedDate[0]}</p>
                  <p>{splitFormattedDate[1]}</p>
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {salahTrackingArray?.map((item, index) => {
            return (
              <tr
                key={uuidv4()}
                // key={"table row: " + item.salahName}
                onClick={(e) => {
                  // setShowMonthlyCalenderModal(true);
                  // e.stopPropagation();

                  // monthlyCalenderToShow =
                  //   e.currentTarget.querySelector("td")?.textContent;
                  setMonthlyCalenderToShow(
                    // e.currentTarget.querySelector("td")?.textContent || ""
                    e.currentTarget.querySelector("td")?.textContent || ""
                  );
                  if (e.currentTarget.tagName !== "svg") {
                    setShowMonthlyCalenderModal(true);
                    // setShowCalenderOneMonth(true);
                  }
                }}
                className="bg-[color:var(--card-bg-color)]"
              >
                <td className="border-none table-salah-name-td py-7">
                  <div className="flex flex-row items-center">
                    {item.salahName === "Fajr" ? (
                      <FajrSvg color={"#E49759"} />
                    ) : item.salahName === "Zohar" ? (
                      <FajrSvg color={"yellow"} />
                    ) : item.salahName === "Asar" ? (
                      <FajrSvg color={"#c2410c"} />
                    ) : item.salahName === "Maghrib" ? (
                      <FajrSvg color={"#4E5482"} />
                    ) : item.salahName === "Isha" ? (
                      <FajrSvg color={"#855988"} />
                    ) : null}

                    {/* <RiSunFill className="mr-4 text-4xl text-amber-300" /> */}
                    <p className="text-[#c4c4c4] table-salah-name">
                      {item.salahName}
                    </p>
                  </div>
                </td>
                {renderCells(index)}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-around pt-6 pb-20 ">
        <button
          onClick={() => {
            setCurrentWeek((prevValue) => prevValue + 5);
          }}
        >
          <IoChevronBackSharp />
        </button>
        <div>
          {currentDisplayedWeek[0]} -{" "}
          {currentDisplayedWeek[currentDisplayedWeek.length - 1]}
        </div>
        <button
          onClick={() => {
            setCurrentWeek((prevValue) => prevValue - 5);
          }}
        >
          <IoChevronForward />
        </button>
      </div>
    </section>
  );
};

export default PrayerMainView;
