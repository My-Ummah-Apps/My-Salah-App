import { useState, useEffect } from "react";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import MonthlyCalender from "../components/MonthlyCalender";

const CalenderPage = ({ salahObjects }) => {
  return <MonthlyCalender salahObjects={salahObjects} />;
};

export default CalenderPage;
