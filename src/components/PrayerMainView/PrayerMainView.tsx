import React, { useState } from "react";
// import Modal from "./Modal";
import Sheet from "react-modal-sheet";
// import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
// import { RiSunFill } from "react-icons/ri";
// import { FaMoon } from "react-icons/fa";
import { subDays, format, parse } from "date-fns";
// import { render } from "react-dom";
import { salahTrackingEntryType } from "../../types/types";
// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

// import { v4 as uuidv4 } from "uuid";
// import CalenderMonthly from "../Stats/CalenderMonthly";

const PrayerMainView = ({
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentWeek,
  startDate,
}: {
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  startDate: Date;
}) => {
  // console.log("PRAYER MAIN VIEW RENDERED");
  // const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");

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
      // console.log("tableHeadDate", tableHeadDate);
      // console.log("selectedSalah", selectedSalah);
      // console.log("salahStatus", salahStatus);
      if (item.salahName == selectedSalah) {
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
      // console.log("item is ", item);
      return item;
    });
    setSalahTrackingArray(newSalahTrackingArray);

    localStorage.setItem(
      "storedSalahTrackingData",
      JSON.stringify(newSalahTrackingArray)
    );
  };
  let clickedElement: any;
  // let columnIndex: number;
  function grabDate(e: any) {
    console.log("GRABDATE TRIGGERED");
    // const cell = e.target as HTMLTableCellElement;

    let selectedSalah;

    clickedElement = e.target.closest("#icon-wrap");
    const columnIndex: any = clickedElement.parentElement
      .cellIndex as HTMLTableCellElement;
    // columnIndex = cell.cellIndex;
    // clickedElement = e.target;

    selectedSalah =
      clickedElement.parentElement.parentElement.cells[0].innerText;

    // if (e.target.tagName === "TD") {
    //   clickedElement = e.target;
    //   selectedSalah = e.target.parentElement.cells[0].innerText;
    // } else if (
    //   e.target.tagName === "svg" ||
    //   e.target.tagName === "circle" ||
    //   e.target.tagName === "path"
    // ) {
    //   // e.target.closest("td").click();
    //   clickedElement = e.target.closest("td");
    //   selectedSalah = clickedElement.parentElement.cells[0].innerText;
    // }

    console.log(
      clickedElement.parentElement.parentElement.parentElement.parentElement
        .children[0].children[0].cells[columnIndex]
    );

    const tableHeadDate =
      clickedElement.parentElement.parentElement.parentElement.parentElement
        .children[0].children[0].cells[columnIndex].textContent;

    setSelectedSalah(selectedSalah);
    setTableHeadDate(tableHeadDate);
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
      if (cellIcon === "home") {
        cellIcon = (
          <FaHome
            onClick={(e: React.TouchEvent<HTMLDivElement>) => {
              // e.stopPropagation();

              if (e.currentTarget.tagName === "svg") {
                // setShowUpdateStatusModal(true);
              }
            }}
            className={`flex self-center justify-self-center pt-2 px-3 pb-4 w-[40px] h-[40px]`}
          />
        );
      } else if (cellIcon === "masjid") {
        cellIcon = (
          <FaMosque
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

      // else if (cellIcon === "Blank") {
      //   cellIcon = (
      //     <LuDot className="flex self-center text-2xl justify-self-center w-[100%]" />
      //   );
      // }
      return (
        <td className="h-full border-none">
          <div
            id="icon-wrap"
            onClick={(e) => {
              e.stopPropagation();
              setShowUpdateStatusModal(true);
              grabDate(e);
              console.log("grabDate clicked");
            }}
          >
            {cellIcon}
          </div>
        </td>
      );
    });
  }

  return (
    <>
      {/* <Modal
        setShowModal={setShowModal}
        showModal={showModal}
        changePrayerStatus={changePrayerStatus}
        // icon={icon}
        // setIcon={setIcon}
        selectedSalah={selectedSalah}
        tableHeadDate={tableHeadDate}
      /> */}
      {/* <img
        className="rounded-lg"
        src="/src/beautiful-sunset-background-river_203633-925.jpg"
        alt=""
        srcset=""
      /> */}
      {/* bg-[color:var(--card-bg-color)] */}
      {/* <button onClick={() => setOpen(true)}>Open sheet</button> */}

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
            <section className="flex justify-around text-5xl h-[200px]">
              <FaMosque
                onClick={() => {
                  console.log(tableHeadDate);
                  console.log(selectedSalah);
                  changePrayerStatus(tableHeadDate, selectedSalah, "masjid");

                  setShowUpdateStatusModal(false);
                }}
              />
              <FaHome
                onClick={() => {
                  changePrayerStatus(tableHeadDate, selectedSalah, "home");

                  setShowUpdateStatusModal(false);
                }}
              />
              <LuDot
                onClick={() => {
                  changePrayerStatus(tableHeadDate, selectedSalah, "blank");
                  // setOpen(false);

                  setShowUpdateStatusModal(false);
                }}
              />
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
            {" "}
            <section className="flex justify-around text-5xl h-[200px]">
              <h1>Hello</h1>
              {/* <CalenderMonthly
              salahName={salah.salahName}
              days={days}
              currentMonth={currentMonth}
              isDayInSpecificMonth={isDayInSpecificMonth}
              // salahName={salah.salahName}
              countCompletedDates={countCompletedDates}
              setSalahTrackingArray={setSalahTrackingArray}
              salahTrackingArray={salahTrackingArray}
              startDate={startDate}
              setCurrentWeek={setCurrentWeek}
              currentWeek={currentWeek}
              modifySingleDaySalah={modifySingleDaySalah}
            /> */}
            </section>
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
              return <td className="text-xs border-none">{item}</td>;
            })}
          </tr>
          <tr className="h-12">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item) => {
              const parsedDate = parse(item, "dd.MM.yy", new Date());
              const formattedDate = format(parsedDate, "EEE dd");
              const splitFormattedDate: string[] = formattedDate.split(" ");

              return (
                <td className="border-none text-[#c4c4c4] text-center">
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
                onClick={(e) => {
                  // setShowMonthlyCalenderModal(true);
                  // e.stopPropagation();

                  if (e.currentTarget.tagName !== "svg") {
                    setShowMonthlyCalenderModal(true);
                  }
                }}
                className="bg-[color:var(--card-bg-color)]"
              >
                <td className="border-none table-salah-name-td py-7">
                  <div className="flex flex-row items-center">
                    {/* <img
                      className="w-8 mr-4"
                      src="/src/assets/icons/night.png"
                      alt=""
                      srcset=""
                    /> */}
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
    </>
  );
};

export default PrayerMainView;
