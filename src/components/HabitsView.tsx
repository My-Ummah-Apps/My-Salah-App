import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { subDays, format } from "date-fns";
import { render } from "react-dom";

// import { v4 as uuidv4 } from "uuid";

// const dates: string[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const today = new Date();

// Array to hold the last five dates
// This needs to potentially be put in a useEffect so it doesn't continously rerun
const pastDates = Array.from({ length: 5 }, (_, index) => {
  const date = subDays(today, index);
  return format(date, "dd.MM.yy");
});

console.log("pasteDates array: ", pastDates);

const HabitsView = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");

  const [salahObjects, setSalahObjects]: any[] = useState([
    {
      salahName: "Fajr",
      completedDates: [
        { "17.12.23": "Home" },
        { "18.12.23": "Masjid" },
        { "15.12.23": "Home" },
        { "19.12.23": "Home" },
      ],
    },
    {
      salahName: "Zohar",
      completedDates: [{ "19.12.23": "Masjid" }, { "18.12.23": "Masjid" }],
    },
    {
      salahName: "Asar",
      completedDates: [
        { "17.12.23": "Home" },
        { "16.12.23": "Masjid" },
        { "15.12.23": "Masjid" },
      ],
    },
    {
      salahName: "Maghrib",
      completedDates: [
        { "19.12.23": "Home" },
        { "18.12.23": "Masjid" },
        { "16.12.23": "Masjid" },
      ],
    },
    {
      salahName: "Isha",
      completedDates: [{ "15.12.23": "Home" }, { "18.12.23": "Masjid" }],
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [dateAndSalah, setDateAndSalah]: any = useState("");

  function changeSalahStatus(tableHeadDate, selectedSalah, icon) {
    const newSalahObjects = salahObjects.map((item) => {
      if (item.salahName == selectedSalah) {
        // console.log(...item.completedDates, { hey: "test" });

        const test = item.completedDates;

        item.completedDates.map((item) => {
          //   console.log("item is...", item);
          if (typeof item != "object") {
            // console.log("not an object yo");
            // console.log(salahObjects);
            // console.log(...test, {
            //   tableHeadDate: icon,
            // });
            // console.log(...test);
            const testing = [...test, { tableHeadDate: icon }];
            // console.log(testing);
          }

          if (item[tableHeadDate]) {
            console.log(item[tableHeadDate]);

            if (typeof item == "object") {
              item[tableHeadDate] = icon;
              //   console.log(item);
              //   console.log("item is an object");
              setSalahObjects(salahObjects);
              return salahObjects;
            }
          }
        });
      }
    });
  }

  const updateClickedCellProperties = (
    columnIndex,
    selectedSalah,
    tableHeadDate
  ) => {
    return {
      columnIndex: columnIndex,
      selectedSalah: selectedSalah,
      tableHeadDate: tableHeadDate,
    };
  };

  function grabDate(e: any) {
    const cell = e.target as HTMLTableCellElement;
    const columnIndex = cell.cellIndex;
    const selectedSalah = e.target.parentElement.cells[0].innerText;

    const tableHeadDate =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .cells[columnIndex].textContent;
    setSelectedSalah(selectedSalah);
    setTableHeadDate(tableHeadDate);
    console.log(selectedSalah);
    console.log(tableHeadDate);

    updateClickedCellProperties(columnIndex, selectedSalah, tableHeadDate);

    // console.log(
    //   updateClickedCellProperties(columnIndex, selectedSalah, tableHeadDate)
    // );

    // console.log(selectedSalah, tableHeadDate);

    const salahName: any = salahObjects.find(
      (salah) => salah.salahName === selectedSalah
    );

    // changeSalahStatus(tableHeadDate, selectedSalah);

    // const newSalahObjects = salahObjects.map((item) => {
    //   if (item.salahName == selectedSalah) {
    //     item.completedDates.map((item) => {
    //       if (item[tableHeadDate]) {
    //         item[tableHeadDate] = "test";
    //       }
    //     });
    //     console.log("salahObjects before return:", salahObjects);
    //     setSalahObjects(salahObjects);
    //     return salahObjects;
    //   }
    // });
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
        updateClickedCellProperties={updateClickedCellProperties}
        icon={icon}
        setIcon={setIcon}
        selectedSalah={selectedSalah}
        tableHeadDate={tableHeadDate}
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
