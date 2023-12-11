import React, { useState } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";

// import { v4 as uuidv4 } from "uuid";

const dates: string[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const HabitsView = () => {
  6;
  const [salahObjects, setSalahObjects]: any[] = useState([
    {
      salahName: "Fajr",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        "",
        { "04.12": "Masjid" },
        "",
      ],
    },
    {
      salahName: "Zohar",
      completedDates: [
        "",
        { "02.12": "Masjid" },
        "",
        { "04.12": "Masjid" },
        "",
      ],
    },
    {
      salahName: "Asar",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        "",
        { "04.12": "Masjid" },
        "",
      ],
    },
    {
      salahName: "Maghrib",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        "",
        { "04.12": "Masjid" },
        "",
      ],
    },
    {
      salahName: "Isha",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        "",
        { "04.12": "Masjid" },
        "",
      ],
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [dateAndSalah, setDateAndSalah]: any = useState("");

  function grabDate(e: any) {
    const cell = e.target as HTMLTableCellElement;
    const columnIndex = cell.cellIndex;
    const selectedSalah: string = e.target.parentElement.cells[0].innerText;
    const tableHeadDate =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .cells[columnIndex].textContent;
    console.log(selectedSalah, tableHeadDate);
    const salahName: any = salahObjects.find(
      (salah) => salah.salahName === selectedSalah
    );
    if (salahName.completedDates.includes(tableHeadDate)) {
      console.log("date exists");
      setDateAndSalah({ date: tableHeadDate, salah: selectedSalah });
      //   console.log(dateAndSalah);
    } else {
      console.log("date does not exist");
    }
  }

  return (
    <section>
      <ModalOptions
        setShowModal={setShowModal}
        showModal={showModal}
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
      />
      <table
        onClick={(e) => {
          grabDate(e);
          setShowModal(true);
        }}
        className=""
      >
        <thead className="">
          <tr>
            <th className=""></th>
            {dates.map((item) => {
              return <td>{item}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fajr</td>
            {salahObjects[0].completedDates.map((date: any) => {
              if (typeof date === "object" && date !== null) {
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else {
                return <td>X</td>;
              }
            })}
          </tr>
          <tr>
            <td>Zohar</td>
            {salahObjects[1].completedDates.map((date: any) => {
              if (typeof date === "object" && date !== null) {
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else {
                return <td>X</td>;
              }
            })}
          </tr>
          <tr>
            <td>Asar</td>
            {salahObjects[2].completedDates.map((date: any) => {
              if (typeof date === "object" && date !== null) {
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else {
                return <td>X</td>;
              }
            })}
          </tr>
          <tr>
            <td>Maghrib</td>
            {salahObjects[3].completedDates.map((date: any) => {
              if (typeof date === "object" && date !== null) {
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else {
                return <td>X</td>;
              }
            })}
          </tr>
          <tr>
            <td>Isha</td>
            {salahObjects[4].completedDates.map((date: any) => {
              if (typeof date === "object" && date !== null) {
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else {
                return <td>X</td>;
              }
            })}
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default HabitsView;
