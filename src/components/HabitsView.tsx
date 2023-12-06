import { useState } from "react";

useState;

const salahObjects: any[] = [
  {
    salahName: "Fajr",
    datesCompleted: ["01.12, 03.12, 04.12, 05.12"],
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

const HabitsView = () => {
  return (
    <section className="">
      <table className="">
        <tr>
          <th></th>
          {dates.map((item) => {
            return <td>{item}</td>;
          })}
        </tr>
        <tr>
          <td>Fajr</td>
          {dates.map((date) => {
            date;
            return (
              <td
                onClick={() => {
                  alert("Completed");
                }}
              >
                {" "}
                {completedDates.map((item) => {
                  if (item != "") {
                    return "T";
                  } else {
                    return "X";
                  }
                })}
              </td>
            );
          })}
          {/* {completedDates.map((date) => {
            if (completedDates.includes(date)) return <td>{date}</td>;
          })} */}
        </tr>
        <tr>
          <td>Zohar</td>
        </tr>
        <tr>
          <td>Asar</td>
        </tr>
        <tr>
          <td>Maghrib</td>
        </tr>
        <tr>
          <td>Isha</td>
        </tr>
      </table>
    </section>
  );
};

export default HabitsView;
