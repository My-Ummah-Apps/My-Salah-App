import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { subDays, format } from "date-fns";
import { render } from "react-dom";

// import { v4 as uuidv4 } from "uuid";

const today = new Date();

// Array to hold the last five dates
// This needs to potentially be put in a useEffect so it doesn't continously rerun
const pastDates = Array.from({ length: 5 }, (_, index) => {
  const date = subDays(today, index);
  return format(date, "dd.MM.yy");
});

const HabitsView = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");
  //   const [salahStatus, setSalahStatus] = useState("");

  let salahStatus: string;
  const [salahObjects, setSalahObjects]: any[] = useState([
    {
      salahName: "Fajr",
      completedDates: [
        { "23.12.23": "Home" },
        { "22.12.23": "Masjid" },
        { "20.12.23": "Masjid" },
        { "19.12.23": "Home" },
      ],
    },
    {
      salahName: "Zohar",
      completedDates: [
        { "24.12.23": "Masjid" },
        { "22.12.23": "Home" },
        { "20.12.23": "Masjid" },
      ],
    },
    {
      salahName: "Asar",
      completedDates: [
        { "23.12.23": "Home" },
        { "22.12.23": "Masjid" },
        { "21.12.23": "Home" },
      ],
    },
    {
      salahName: "Maghrib",
      completedDates: [
        { "24.12.23": "Masjid" },
        { "21.12.23": "Masjid" },
        { "18.12.23": "Home" },
      ],
    },
    {
      salahName: "Isha",
      completedDates: [{ "23.12.23": "Home" }, { "21.12.23": "Masjid" }],
    },
  ]);
  const [showModal, setShowModal] = useState(false);

  let updatedCompletedDatesArray;

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

    console.log(...newSalahObjects);
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
    return pastDates.map((date: any) => {
      let iconTest = "-";
      const matchedObject = salahObjects[index].completedDates.find(
        (obj) => date === Object.keys(obj)[0]
      );
      if (matchedObject !== undefined) {
        iconTest = matchedObject[date];
      }
      return <td>{iconTest}</td>;
    });
  }

  return (
    <section>
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
        onClick={(e) => {
          grabDate(e);
          forceUpdate();
          setShowModal(true);
        }}
        className=""
      >
        <thead className="">
          <tr>
            <th className=""></th>
            {pastDates.map((item) => {
              return <td>{item}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fajr</td>
            {renderCells(0)}
          </tr>
          <tr>
            <td>Zohar</td>
            {renderCells(1)}
          </tr>
          <tr>
            <td>Asar</td>
            {renderCells(2)}
          </tr>
          <tr>
            <td>Maghrib</td>
            {renderCells(3)}
          </tr>
          <tr>
            <td>Isha</td>
            {renderCells(4)}
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default HabitsView;
