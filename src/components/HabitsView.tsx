import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

const salahObjects: any[] = [
  {
    salahName: "Fajr",
    completedDates: ["01.12", "02.12", "", "04.12", ""],
  },
  {
    salahName: "Zohar",
    completedDates: ["01.12", "", "03.12", "04.12", "05.12"],
  },
  {
    salahName: "Asar",
    completedDates: ["01.12", "", "", "", "05.12"],
  },
  {
    salahName: "Maghrib",
    completedDates: ["01.12", "02.12", "03.12", "", ""],
  },
  {
    salahName: "Isha",
    completedDates: ["01.12", "", "03.12", "", "05.12"],
  },
];

const dates: any[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const HabitsView = () => {
  // const [salahStatus, setSalahStatus] = useState("");

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
    } else {
      console.log("date does not exist");
    }
  }

  return (
    <table
      onClick={(e) => {
        grabDate(e);
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
          {salahObjects[0].completedDates.map((date: string) => {
            return date !== "" && date ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Zohar</td>
          {salahObjects[1].completedDates.map((date: string) => {
            return date !== "" && date ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Asar</td>
          {salahObjects[2].completedDates.map((date: string) => {
            return date !== "" && date ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Maghrib</td>
          {salahObjects[3].completedDates.map((date: string) => {
            return date !== "" && date ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Isha</td>
          {salahObjects[4].completedDates.map((date: string) => {
            return date !== "" && date ? <td>T</td> : <td>X</td>;
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default HabitsView;
