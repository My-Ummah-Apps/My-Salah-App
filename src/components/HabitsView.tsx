import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { subDays, format } from "date-fns";
import { render } from "react-dom";

// import { v4 as uuidv4 } from "uuid";

const today = new Date();

// // Array to hold the last five dates
// // This needs to potentially be put in a useEffect so it doesn't continously rerun
// const currentDisplayedWeek = Array.from({ length: 5 }, (_, index) => {
//   const date = subDays(today, index);
//   return format(date, "dd.MM.yy");
// });

const HabitsView = ({ setSalahObjects, salahObjects }) => {
  console.log("COMPONENT RENDERED");
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

    currentDisplayedWeek = Array.from({ length: 7 }, (_, index) => {
      const date = subDays(startDate, index);

      return format(date, "dd.MM.yy");
    });
  }

  generateDisplayedWeek(currentStartDate);

  let salahStatus: string;

  const [showModal, setShowModal] = useState(false);

  function changeSalahStatus(tableHeadDate, selectedSalah, salahStatus, icon) {
    const newSalahObjects = salahObjects.map((item) => {
      if (item.salahName == selectedSalah) {
        const doesDateExist = item.completedDates.find((date) => {
          return Object.keys(date)[0] === tableHeadDate;
        });

        if (doesDateExist === undefined) {
          console.log("DATE DOES NOT EXIST!");

          item.completedDates.push({
            [tableHeadDate]: salahStatus,
          });
        } else if (doesDateExist !== undefined) {
          item.completedDates.map((item) => {
            item[tableHeadDate] = icon;
          });
        }
      }
    });
    localStorage.setItem(
      "storedSalahTrackingData",
      JSON.stringify(newSalahObjects)
    );
    console.log(salahObjects);
  }

  function grabDate(e: any) {
    const cell = e.target as HTMLTableCellElement;
    const columnIndex = cell.cellIndex;
    const selectedSalah = e.target.parentElement.cells[0].innerText;

    const tableHeadDate =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .cells[columnIndex].textContent;
    setSelectedSalah(selectedSalah);
    setTableHeadDate(tableHeadDate);
  }

  function renderCells(index) {
    return currentDisplayedWeek.map((date: any) => {
      let iconTest = <LuDot className="text-[grey]" />;
      const matchedObject = salahObjects[index]?.completedDates.find(
        (obj) => date === Object.keys(obj)[0]
      );
      if (matchedObject !== undefined) {
        iconTest = matchedObject[date];
      }
      if (iconTest == "Home") {
        iconTest = <FaHome className="text-2xl text-center" />;
      } else if (iconTest == "Masjid") {
        iconTest = <FaMosque className="text-2xl text-center" />;
      }
      return <td className="justify-center border-none">{iconTest}</td>;
    });
  }

  function handleForwardBtn() {
    console.log("FORWARD");
  }

  function handleBackBtn() {
    console.log("BACKWARD");
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
              return <td className="p-5 border-none">{item}</td>;
              // Below is causing issues since when the cell is clicked it relies on the date being in the DD.MM.YY format
              return <td className="p-5 border-none">{formattedDate}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="border-blue-50">
            <td className="p-5 border-none rounded-md">Fajr</td>
            {renderCells(0)}
          </tr>
          <tr>
            <td className="p-5 border-none rounded-md">Zohar</td>
            {renderCells(1)}
          </tr>
          <tr>
            <td className="p-5 border-none rounded-md">Asar</td>
            {renderCells(2)}
          </tr>
          <tr>
            <td className="p-5 border-none rounded-md">Maghrib</td>
            {renderCells(3)}
          </tr>
          <tr>
            <td className="p-5 border-none rounded-md">Isha</td>
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
          BACK
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
          FORWARD
        </button>
      </div>
    </>
  );
};

export default HabitsView;
