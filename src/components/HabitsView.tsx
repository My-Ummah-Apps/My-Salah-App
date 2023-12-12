import React, { useState } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";

// import { v4 as uuidv4 } from "uuid";

const dates: string[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const HabitsView = () => {
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

  let selectedSalah;
  let tableHeadDate: any;

  function grabDate(e: any) {
    const cell = e.target as HTMLTableCellElement;
    const columnIndex = cell.cellIndex;
    selectedSalah = e.target.parentElement.cells[0].innerText;
    tableHeadDate =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .cells[columnIndex].textContent;
    // console.log(selectedSalah, tableHeadDate);

    const salahName: any = salahObjects.find(
      (salah) => salah.salahName === selectedSalah
    );

    const newSalahObjects = salahObjects.map((item) => {
      if (item.salahName == selectedSalah) {
        item.completedDates.map((item) => {
          //   console.log(item);
          if (item[tableHeadDate]) {
            console.log((item[tableHeadDate] = "test"));
          }
        });

        console.log(item.completedDates);
      }
    });

    // setSalahObjects(newSalahObjects)

    // console.log(salahName);

    // console.log(salahName);
    // setSalahObjects(...salahObjects);
    // console.log(salahObjects);
    // setSalahObjects();

    // console.log(
    //   Object.entries(salahName)[1][1].some((object) => {
    //     // console.log("Object being looped: ", Object.keys(object));
    //     // console.log("tableHeadDate ", tableHeadDate);
    //     if (Object.keys(object) == tableHeadDate) {
    //       //   setDateAndSalah({ date: tableHeadDate, salah: selectedSalah });
    //       // setSalahObjects(...salahObjects, )
    //       console.log("Date exits");
    //       console.log(Object.entries(salahName)[1]);
    //     } else {
    //       console.log("Date does not exist");
    //     }
    //     return Object.keys(object) == tableHeadDate;
    //   })
    // );
    // if (salahName.completedDates.includes(tableHeadDate)) {
    //   console.log("date exists");
    //   setDateAndSalah({ date: tableHeadDate, salah: selectedSalah });
    //   //   console.log(dateAndSalah);
    // } else {
    //   console.log("date does not exist");
    // }
  }

  return (
    <section>
      <ModalOptions
        setShowModal={setShowModal}
        showModal={showModal}
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
        selectedSalah={selectedSalah}
        tableHeadDate={tableHeadDate}
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
