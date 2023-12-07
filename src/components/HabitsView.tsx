import { useState } from "react";

useState;

const salahObjects: any[] = [
  {
    salahName: "Fajr",
    completedDates: ["01.12", "", "03.12", "", "05.12"],
  },
];
salahObjects;

const dates: any[] = ["01.12", "02.12", "03.12", "04.12", "05.12"];

const completedDates: any[] = ["01.12", "", "03.12", "04.12", "05.12"];
let newArray: number[] = [];
for (let i = 0; i < dates.length; i++) {
  if (dates[i] == completedDates[i]) {
    console.log(i);
    newArray.push(dates[i]);
    console.log(newArray);
  }
}

function grabDate(e: any) {
  const cell = e.target as HTMLTableCellElement;
  const columnIndex = cell.cellIndex;
  const tableHeadDate =
    e.target.parentElement.parentElement.parentElement.children[0].children[0]
      .cells[columnIndex].textContent;
  console.log(tableHeadDate);
}

const HabitsView = () => {
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

          {dates.map((date: any) => {
            date;
            return (
              <td>
                {salahObjects[0].completedDates.map((date: any) => {
                  return date !== "" && date ? <td>T</td> : <td>X</td>;
                })}
              </td>
            );
          })}
        </tr>
        <tr>
          <td>Zohar</td>
          {completedDates.map((date) => {
            return date !== "" ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Asar</td>
          {completedDates.map((date) => {
            return date !== "" ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Maghrib</td>
          {completedDates.map((date) => {
            return date !== "" ? <td>T</td> : <td>X</td>;
          })}
        </tr>
        <tr>
          <td>Isha</td>
          {completedDates.map((date) => {
            return date !== "" ? <td>T</td> : <td>X</td>;
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default HabitsView;
