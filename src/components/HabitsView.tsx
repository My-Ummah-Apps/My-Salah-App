import React, { useEffect, useState, useReducer } from "react";
import ModalOptions from "./ModalOptions";
import ReactModal from "react-modal";
import { FaMosque, FaHome } from "react-icons/fa";
import { subDays, format } from "date-fns";

// import { v4 as uuidv4 } from "uuid";

// const dates: string[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const today = new Date();

// Array to hold the last five dates
// This needs to potentially be put in a useEffect so it doesn't continously rerun
const pastDates = Array.from({ length: 5 }, (_, index) => {
  const date = subDays(today, index);
  return format(date, "dd.MM");
});

console.log(pastDates);

const HabitsView = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [icon, setIcon] = useState("");
  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableHeadDate, setTableHeadDate] = useState("");

  const [salahObjects, setSalahObjects]: any[] = useState([
    {
      salahName: "Fajr",
      completedDates: [
        { "17.12": "Home" },
        { "14.12": "Masjid" },
        { "13.12": "Masjid" },
      ],
    },
    {
      salahName: "Zohar",
      completedDates: [{ "02.12": "Masjid" }, { "04.12": "Masjid" }],
    },
    {
      salahName: "Asar",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        { "04.12": "Masjid" },
      ],
    },
    {
      salahName: "Maghrib",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        { "04.12": "Masjid" },
      ],
    },
    {
      salahName: "Isha",
      completedDates: [
        { "01.12": "Home" },
        { "02.12": "Masjid" },
        { "04.12": "Masjid" },
      ],
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
            {pastDates.map((date: any) => {
              let returning;
              for (let i = 0; i < salahObjects[0].completedDates.length; i++) {
                console.log(Object.keys(salahObjects[0].completedDates[i])[0]);

                if (
                  pastDates.includes(
                    Object.keys(salahObjects[0].completedDates[i])[0]
                  )
                ) {
                  console.log("Date exists: ");
                  console.log(
                    Object.keys(salahObjects[0].completedDates[i])[0]
                  );
                  //   console.log(
                  //     Object.keys(salahObjects[0].completedDates[2])[0]
                  //   );
                  //   const [key, value]: any = Object.entries(date)[0];
                  let value = "test";
                  //   return <td>{value}</td>;
                  returning = <td>{value}</td>;
                } else if (
                  !pastDates.includes(
                    Object.keys(salahObjects[0].completedDates[i])[0]
                  )
                ) {
                  console.log("date does not exist: ");
                  console.log(
                    Object.keys(salahObjects[0].completedDates[i])[0]
                  );
                  //   return <td>-</td>;

                  returning = <td>-</td>;
                }
              }
              console.log("EXITING....");
              return returning;
            })}
            {/* {salahObjects[0].completedDates.map((date: any) => {
              // What needs to be done here, is that datefns need to be brought in to populate the table headings,
              // then, the completed dates array from each salah needs to be compared to the datefns array i.e. the table
              // headings, if a date matches then populate the cell accordingly, if a date is missing i.e. a date in the datefns
              // array is not available in the salah completed array, create a blank cell
              //   if (typeof date === "object" && date !== null) {

              console.log(Object.keys(date)[0]);
              console.log(pastDates);
              console.log(pastDates.includes(Object.keys(date)[0]));
              if (pastDates.includes(Object.keys(date)[0])) {
                // console.log(Object.keys(date)[0]);
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else if (!pastDates.includes(Object.keys(date)[0])) {
                return <td>-</td>;
              }
            })} */}
          </tr>
          <tr>
            <td>Zohar</td>
            {salahObjects[1].completedDates.map((date: any) => {
              if (typeof date === "object" && date !== null) {
                const [key, value]: any = Object.entries(date)[0];
                return <td>{value}</td>;
              } else {
                return <td>-</td>;
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
                return <td>-</td>;
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
                return <td>-</td>;
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
                return <td>-</td>;
              }
            })}
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default HabitsView;
