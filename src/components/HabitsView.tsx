import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";

// import { v4 as uuidv4 } from "uuid";

const dates: string[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const HabitsView = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [clickedCellDetails, setClickedCellDetails] = useState({});

  const [salahObjects, setSalahObjects]: any[] = useState([
    {
      salahName: "Fajr",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        "",
        { "04.12": "Masjid" },
        { "05.12": "Masjid" },
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

  function changeSalahStatus(tableHeadDate, selectedSalah) {
    const newSalahObjects = salahObjects.map((item) => {
      if (item.salahName == selectedSalah) {
        item.completedDates.map((item) => {
          if (item[tableHeadDate]) {
            item[tableHeadDate] = "test";
          }
        });
        setSalahObjects(salahObjects);
        console.log("salahObjects after setstate: ", salahObjects);
        return salahObjects;
      }
    });
  }

  function updateClickedCellProperties(
    cell,
    columnIndex,
    selectedSalah,
    tableHeadDate
  ) {
    setClickedCellDetails({
      columnIndex: columnIndex,
      selectedSalah: selectedSalah,
      tableHeadDate: tableHeadDate,
    });
  }

  function grabDate(e: any) {
    const cell = e.target as HTMLTableCellElement;
    const columnIndex = cell.cellIndex;
    const selectedSalah = e.target.parentElement.cells[0].innerText;
    const tableHeadDate =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .cells[columnIndex].textContent;

    updateClickedCellProperties(
      cell,
      columnIndex,
      selectedSalah,
      tableHeadDate
    );

    console.log(clickedCellDetails);

    // console.log(selectedSalah, tableHeadDate);

    const salahName: any = salahObjects.find(
      (salah) => salah.salahName === selectedSalah
    );
    changeSalahStatus(tableHeadDate, selectedSalah);

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

  return (
    <section>
      <ModalOptions
        setShowModal={setShowModal}
        showModal={showModal}
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
        changeSalahStatus={changeSalahStatus}
        // selectedSalah={selectedSalah}
        // tableHeadDate={tableHeadDate}
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
            {dates.map((item) => {
              return <td>{item}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fajr</td>
            {/* {console.log(salahObjects)} */}
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
