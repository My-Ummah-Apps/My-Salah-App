import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { subDays, format, parse } from "date-fns";
import { render } from "react-dom";

// import { v4 as uuidv4 } from "uuid";

const today = new Date();

const HabitsView = ({ setSalahObjects, salahObjects }) => {
  // console.log("COMPONENT RENDERED");
  const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState(0);
  // const [dateRange, setDateRange] = useState();

  // Array to hold the last five dates
  let currentDisplayedWeek;
  function generateDisplayedWeek(currentStartDate) {
    const today = new Date();
    const startDate = subDays(today, currentStartDate);

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
    // const originaldDate = format("20.12.23", "dd.MM.yy");
    // console.log(originaldDate);
    const newSalahObjects = salahObjects.map((item) => {
      if (item.salahName == selectedSalah) {
        const doesDateObjectExist = item.completedDates.find((date) => {
          return Object.keys(date)[0] === tableHeadDate;
        });

        if (doesDateObjectExist === undefined) {
          return {
            ...item,
            completedDates: [
              ...item.completedDates,
              { [tableHeadDate]: salahStatus },
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
              { [tableHeadDate]: salahStatus },
            ],
          };
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
    return currentDisplayedWeek.map((date: any) => {
      let cellIcon = (
        <LuDot className="text-[grey] flex self-center text-2xl justify-self-center w-[100%]" />
      );
      const matchedObject = salahObjects[index]?.completedDates.find(
        (obj) => date === Object.keys(obj)[0]
      );
      if (matchedObject !== undefined) {
        cellIcon = matchedObject[date];
      }
      if (cellIcon === "Home") {
        cellIcon = (
          <FaHome className="flex self-center text-2xl justify-self-center w-[100%]" />
        );
      } else if (cellIcon === "Masjid") {
        cellIcon = (
          <FaMosque className="flex self-center text-2xl justify-self-center w-[100%]" />
        );
      } else if (cellIcon === "Blank") {
        cellIcon = (
          <LuDot className="flex self-center text-2xl justify-self-center w-[100%]" />
        );
      }
      return <td className="h-full border-none">{cellIcon}</td>;
    });
  }

  return (
    <>
      <ModalOptions
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
      <table
        className="w-full shadow-lg rounded-xl bg-gray-50"
        onClick={(e) => {
          grabDate(e);
          setShowModal(true);
        }}
      >
        <thead className="">
          <tr className="hidden">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item, index) => {
              return <td className="px-2 py-5 border-none">{item}</td>;
            })}
          </tr>
          <tr className="">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item, index) => {
              const parsedDate = parse(item, "dd.MM.yy", new Date());
              const formattedDate = format(parsedDate, "EEE dd");

              return <td className="px-2 py-5 border-none">{formattedDate}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {salahObjects.map((item, index) => {
            return (
              <tr className="border-blue-50">
                <td className="py-5 border-none rounded-md">
                  {item.salahName}
                </td>
                {renderCells(index)}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-around pt-6 ">
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

export default HabitsView;
