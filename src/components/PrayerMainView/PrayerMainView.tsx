import React, { useEffect, useState, useReducer } from "react";
import Modal from "./Modal";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { RiSunFill } from "react-icons/ri";
import { FaMoon } from "react-icons/fa";
import { subDays, format, parse } from "date-fns";
import { render } from "react-dom";

// import { v4 as uuidv4 } from "uuid";

const today = new Date();

const PrayerMainView = ({
  setSalahObjects,
  salahObjects,
  setCurrentStartDate,
  currentStartDate,
  startDate,
}) => {
  const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");

  const SalahIcons: string[] = ["<RiSunFill />", "<FaMoon />"];

  // Array to hold the last five dates
  let currentDisplayedWeek;
  function generateDisplayedWeek(currentStartDate) {
    currentDisplayedWeek = Array.from({ length: 5 }, (_, index) => {
      const date = subDays(startDate, 4 - index);
      return format(date, "dd.MM.yy");
    });
  }

  generateDisplayedWeek(currentStartDate);

  let salahStatus: string;

  const [showModal, setShowModal] = useState(false);

  const changePrayerStatus = (
    tableHeadDate,
    selectedSalah,
    salahStatus,
    icon
  ) => {
    const newSalahObjects = salahObjects.map((item) => {
      console.log(item.salahName);
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
          // if (icon.type.name === "LuDot") {
          //   return {
          //     ...item,
          //     completedDates: [...filteredCompletedDatesArray],
          //   };
          // } else if (icon.type.name !== "LuDot") {
          //   return {
          //     ...item,
          //     completedDates: [
          //       ...filteredCompletedDatesArray,
          //       { [tableHeadDate]: salahStatus },
          //     ],
          //   };
          // }
        }
      }
      return item;
    });
    setSalahObjects(newSalahObjects);

    localStorage.setItem(
      "storedSalahTrackingData",
      JSON.stringify(newSalahObjects)
    );
  };
  let clickedElement;
  let columnIndex;
  function grabDate(e: any) {
    const cell = e.target as HTMLTableCellElement;
    columnIndex = cell.cellIndex;

    let selectedSalah;

    if (e.target.tagName === "TD") {
      clickedElement = e.target;
      selectedSalah = e.target.parentElement.cells[0].innerText;
    } else if (
      e.target.tagName === "svg" ||
      e.target.tagName === "circle" ||
      e.target.tagName === "path"
    ) {
      e.target.closest("td").click();
      clickedElement = e.target.closest("td");
      selectedSalah = clickedElement.parentElement.cells[0].innerText;
    }

    const tableHeadDate =
      clickedElement.parentElement.parentElement.parentElement.children[0]
        .children[0].cells[columnIndex].textContent;
    setSelectedSalah(selectedSalah);
    setTableHeadDate(tableHeadDate);
  }

  function renderCells(index) {
    console.log(selectedSalah);
    let test;
    // if (selectedSalah == "Zohar") {
    //   test = "text-amber-300";
    // }
    return currentDisplayedWeek.map((date: any) => {
      let cellIcon = (
        <LuDot className="flex self-center justify-self-center w-[100%]" />
      );
      const matchedObject = salahObjects[index]?.completedDates.find(
        (obj) => date === Object.keys(obj)[0]
      );

      if (matchedObject !== undefined) {
        cellIcon = matchedObject[date];
      }
      if (cellIcon === "home") {
        cellIcon = (
          <FaHome className={`flex self-center justify-self-center w-[100%]`} />
        );
      } else if (cellIcon === "masjid") {
        // test = "text-red-300";
        cellIcon = (
          <FaMosque
            className={`flex self-center justify-self-center w-[100%]`}
          />
        );
      }
      // else if (cellIcon === "Blank") {
      //   cellIcon = (
      //     <LuDot className="flex self-center text-2xl justify-self-center w-[100%]" />
      //   );
      // }
      return <td className="h-full border-none">{cellIcon}</td>;
    });
  }

  return (
    <>
      <Modal
        setShowModal={setShowModal}
        showModal={showModal}
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
        changePrayerStatus={changePrayerStatus}
        icon={icon}
        setIcon={setIcon}
        selectedSalah={selectedSalah}
        tableHeadDate={tableHeadDate}
        salahStatus={salahStatus}
      />
      {/* <img
        className="rounded-lg"
        src="/src/beautiful-sunset-background-river_203633-925.jpg"
        alt=""
        srcset=""
      /> */}
      {/* bg-[color:var(--card-bg-color)] */}
      <table
        className="w-full shadow-lg "
        onClick={(e) => {
          grabDate(e);
          setShowModal(true);
        }}
      >
        <thead className="">
          <tr className="hidden ">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item, index) => {
              return <td className="px-2 py-5 text-xs border-none">{item}</td>;
            })}
          </tr>
          <tr className="">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item, index) => {
              const parsedDate = parse(item, "dd.MM.yy", new Date());
              const formattedDate = format(parsedDate, "EEE dd");

              return (
                <td className="px-2 py-5 border-none text-[#c4c4c4]">
                  {formattedDate}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {salahObjects.map((item, index) => {
            return (
              <tr className="bg-[color:var(--card-bg-color)]">
                <td className="py-5 border-none">
                  <div className="flex flex-row items-center">
                    {/* <img
                      className="w-8 mr-4"
                      src="/src/assets/icons/night.png"
                      alt=""
                      srcset=""
                    /> */}
                    {/* <RiSunFill className="mr-4 text-4xl text-amber-300" /> */}
                    <p className="text-[#c4c4c4]">{item.salahName}</p>
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
            setCurrentStartDate((prevValue) => prevValue + 5);
          }}
        >
          <IoChevronBackSharp />
        </button>
        <div>
          {currentDisplayedWeek[currentDisplayedWeek.length - 1]} -
          {currentDisplayedWeek[0]}
        </div>
        <button
          onClick={() => {
            setCurrentStartDate((prevValue) => prevValue - 5);
          }}
        >
          <IoChevronForward />
        </button>
      </div>
    </>
  );
};

export default PrayerMainView;
