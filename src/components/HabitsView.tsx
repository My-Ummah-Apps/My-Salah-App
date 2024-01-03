import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { subDays, format } from "date-fns";
import { render } from "react-dom";

// import { v4 as uuidv4 } from "uuid";

const today = new Date();

const HabitsView = ({ setSalahObjects, salahObjects }) => {
  // console.log("COMPONENT RENDERED");
  const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState(0);
  const [dateRange, setDateRange] = useState();

  useEffect(() => {}, [currentStartDate]);

  // Array to hold the last five dates
  let currentDisplayedWeek;
  function generateDisplayedWeek(currentStartDate) {
    const today = new Date();
    const startDate = subDays(today, currentStartDate);

    currentDisplayedWeek = Array.from({ length: 5 }, (_, index) => {
      const date = subDays(startDate, index);

      return format(date, "dd.MM.yy");
    });
  }

  generateDisplayedWeek(currentStartDate);

  let salahStatus: string;

  const [showModal, setShowModal] = useState(false);

  const changeSalahStatus = (
    tableHeadDate,
    selectedSalah,
    salahStatus,
    icon
  ) => {
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
      console.log(item);
      return item;
    });
    console.log("newSalahObjects", newSalahObjects);
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

    // const selectedSalah = e.target.parentElement.cells[0].innerText;
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
      let iconTest = (
        <LuDot className="text-[grey] flex self-center text-2xl justify-self-center w-[100%]" />
      );
      const matchedObject = salahObjects[index]?.completedDates.find(
        (obj) => date === Object.keys(obj)[0]
      );
      if (matchedObject !== undefined) {
        iconTest = matchedObject[date];
      }
      if (iconTest == "Home") {
        iconTest = (
          <FaHome className="flex self-center text-2xl justify-self-center w-[100%]" />
        );
      } else if (iconTest == "Masjid") {
        iconTest = (
          <FaMosque className="flex self-center text-2xl justify-self-center w-[100%]" />
        );
      }
      return <td className="h-full border-none">{iconTest}</td>;
    });
  }

  return (
    <>
      <ModalOptions
        setShowModal={setShowModal}
        showModal={showModal}
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
        changeSalahStatus={changeSalahStatus}
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
          <tr className="">
            <th className="border-none"></th>
            {currentDisplayedWeek.map((item, index) => {
              const date = subDays(new Date(), index - currentStartDate);
              const formattedDate = format(date, "EEE dd");
              return <td className="px-2 py-5 border-none">{item}</td>;
              // Below is causing issues since when the cell is clicked it relies on the date being in the DD.MM.YY format
              return <td className="px-5 border-none">{formattedDate}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="border-blue-50">
            <td className="py-5 border-none rounded-md">Fajr</td>
            {renderCells(0)}
          </tr>
          <tr>
            <td className="py-5 border-none rounded-md">Zohar</td>
            {renderCells(1)}
          </tr>
          <tr>
            <td className="py-5 border-none rounded-md">Asar</td>
            {renderCells(2)}
          </tr>
          <tr>
            <td className="py-5 border-none rounded-md">Maghrib</td>
            {renderCells(3)}
          </tr>
          <tr>
            <td className="py-5 border-none rounded-md">Isha</td>
            {renderCells(4)}
          </tr>
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
