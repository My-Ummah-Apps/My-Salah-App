import { useState, useRef, useEffect } from "react";
import { CSSProperties } from "react";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import styles from "./InfiniteLoader.example.css";
import InfiniteLoader from "react-window-infinite-loader";
import { prayerStatusColors } from "../../utils/prayerStatusColors";
import { v4 as uuidv4 } from "uuid";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { DBConnectionStateType } from "../../types/types";

import {
  format,
  parse,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  eachMonthOfInterval,
  // setMonth,
} from "date-fns";
import DailyOverviewBottomSheet from "../BottomSheets/DailyOverviewBottomSheet";

const Calendar = ({
  dbConnection,
  // setShowCalendarOneMonth,
  // showCalendarOneMonth,
  userStartDate,
  checkAndOpenOrCloseDBConnection,
}: {
  // setShowCalendarOneMonth: React.Dispatch<React.SetStateAction<boolean>>;
  // showCalendarOneMonth: boolean;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  data: any;
  userStartDate: string;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;

  startDate: Date;
}) => {
  const [salahData, setSalahData] = useState([]);

  useEffect(() => {
    const grabSalahData = async () => {};
    grabSalahData();
  }, []);

  const fetchSalahTrackingDataFromDB = async () => {
    console.log("fetchSalahTrackingDataFromDB FUNCTION HAS EXECUTED");
    try {
      await checkAndOpenOrCloseDBConnection("open");

      const res = await dbConnection.current?.query(
        `SELECT * FROM salahtrackingtable`
      );

      console.log("ress is: ", res);

      let emptyArr = [];

      // Grab a date
      // TODO: Create array of objects from the database data (res), this array will then be used for the radial functions
      if (res && res.values) {
        const resValues = res.values;
        resValues.forEach((obj) => {
          if (!salahData.some((obj1) => obj1.hasOwnProperty(obj.date))) {
            console.log(`Date ${obj.date} does not exist`);
            let currentDate = obj.date;
            // let date = obj.date;
            let singleSalahObj = {
              [obj.date]: [],
            };
            for (let i = 0; i < resValues.length; i++) {
              if (resValues[i].date === currentDate) {
                console.log(`res.values[i]:`);
                console.log(resValues[i]);

                let singleObj = {
                  salahName: resValues[i].salahName,
                  salahStatus: resValues[i].salahStatus,
                };
                singleSalahObj[obj.date].push(singleObj);
              }
            }
            console.log(`singleSalahObj:`);
            console.log(singleSalahObj);
            // if (!emptyArr.includes())

            emptyArr.push(singleSalahObj);
            // setSalahData((prevValue) => [...prevValue, ...emptyArr]);
          } else {
            console.log(`Date exists and is ${obj.date}`);
          }
        });
      }

      setSalahData(emptyArr);
      console.log("empty array: ", emptyArr);

      // return holdArr;
    } catch (error) {
      console.error(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchSalahTrackingDataFromDB();
  }, []);

  useEffect(() => {
    console.log("salahData: ", salahData);
  }, [salahData]);

  const calenderSingleMonthHeightRef = useRef<HTMLDivElement>(null);
  // const [singleMonthDivHeight, setSingleMonthDivHeight] = useState(0);
  useEffect(() => {
    // console.log(calenderSingleMonthHeightRef.current);
    // if (calenderSingleMonthHeightRef.current) {
    //   // console.log(calenderSingleMonthHeightRef.current.clientHeight);
    //   setSingleMonthDivHeight(
    //     calenderSingleMonthHeightRef.current.clientHeight
    //   );
    // }
  });

  const [showDailySalahDataModal, setShowDailySalahDataModal] = useState(false);
  // console.log(showDailySalahDataModal);
  const [clickedDate, setClickedDate] = useState<string>("");

  // useEffect(() => {
  //   setClickedDate(clickedDate);
  // }, [clickedDate]);

  // const getSingleMonthDivHeight = () => {
  //   // setSingleMonthDivHeight(e.target.clientHeight);
  //   console.log("hi");
  //   console.log(singleMonthDivHeight);
  // };

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  // let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const isDayInSpecificMonth = (dayToCheck: Date, currentMonth: string) => {
    // console.log(currentMonth);
    const parsedCurrentMonth = parse(currentMonth, "MMMM yyyy", new Date());
    const dayMonth = startOfMonth(dayToCheck);
    return (
      dayMonth.getMonth() === parsedCurrentMonth.getMonth() &&
      dayMonth.getFullYear() === parsedCurrentMonth.getFullYear()
    );
  };

  // const allDatesWithinSalahTrackingArray = salahTrackingArray.reduce<string[]>(
  //   (accumulatorArray, salah) => {
  //     salah.completedDates.forEach((item) => {
  //       accumulatorArray.push(Object.keys(item)[0]);
  //     });
  //     return accumulatorArray;
  //   },
  //   []
  // );
  // Need to modify the below so depending on the month being rendered, it either shows the overall statuses for each date for every salah or shows the status for the particular date for one salah only

  let fajrColor = "green";
  let zoharColor = "blue";
  let asarColor = "red";
  let maghribColor = "yellow";
  let ishaColor = "orange";

  // const countCompletedDates = (date: string, salahName?: string) => {
  //   const allDatesWithinSalahTrackingArray = salahTrackingArray.reduce<
  //     string[]
  //   >((accumulatorArray, salah) => {
  //     if (salah.salahName === salahName) {
  //       salah.completedDates.forEach((item) => {
  //         accumulatorArray.push(Object.keys(item)[0]);
  //       });
  //     } else if (!salahName) {
  //       salah.completedDates.forEach((item) => {
  //         accumulatorArray.push(Object.keys(item)[0]);
  //       });
  //     }
  //     return accumulatorArray;
  //   }, []);

  //   // let sameDatesArray = allDatesWithinSalahTrackingArray.filter(
  //   //   (currentDate) => currentDate === date
  //   // );

  //   // let sameDatesArrayLength = sameDatesArray.length;

  // };

  let todaysDate = new Date();
  // userStartDate = "17.01.11";

  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());

  const endDate = new Date();

  // Generate an array of all the months between the start and end dates
  const monthsBetween = eachMonthOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });

  // Format the months
  const formattedMonths = monthsBetween.map((month) =>
    format(month, "MMMM yyyy")
  );
  formattedMonths.reverse();

  // const monthStrings = monthsInYear.map((month) => format(month, "MMM-yyyy"));
  // console.log(monthStrings);
  let firstDayOfMonth;
  const monthlyDates = (month: string) => {
    firstDayOfMonth = parse(month, "MMMM yyyy", new Date()); // Returns the following type of object: Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time)

    const daysInMonth = eachDayOfInterval({
      // The eachDayOfInterval function gives dates between (and including) the two dates that are passed in.
      start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }), // Gives first day of month

      end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }), // Once we have the first day of the month, endOfMonth calculates the last day of the month, then, endOfWeek is used to find the end of the week for that particular date
    }); // The result here is an array of objects, object at 0 position is Sun Dec 31 2023 00:00:00 GMT+0000 (Greenwich Mean Time), array ends at index 34, which is Sat Feb 03 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
    return daysInMonth;
  };

  function generateRadialColor(status: string) {
    console.log("generateRadialColor: ", status);
    return status === "male-alone"
      ? prayerStatusColors.aloneMaleStatusColor
      : status === "group"
      ? prayerStatusColors.jamaahStatusColor
      : status === "female-alone"
      ? prayerStatusColors.aloneFemaleStatusColor
      : status === "excused"
      ? prayerStatusColors.excusedStatusColor
      : status === "missed"
      ? prayerStatusColors.missedStatusColor
      : status === "late"
      ? prayerStatusColors.lateStatusColor
      : "";
  }

  function determineRadialColors(date: Date) {
    if (date < userStartDateFormatted || date > todaysDate) {
      fajrColor = "transparent";
      zoharColor = "transparent";
      asarColor = "transparent";
      maghribColor = "transparent";
      ishaColor = "transparent";
      return;
    }
    fajrColor = "#585858";
    zoharColor = "#585858";
    asarColor = "#585858";
    maghribColor = "#585858";
    ishaColor = "#585858";

    let formattedDate = format(date, "dd.MM.yy");

    for (let key in salahData) {
      if (salahData[key].hasOwnProperty(formattedDate)) {
        console.log("formattedDate data is: ", salahData[key][formattedDate]);

        salahData[key][formattedDate].forEach((item) => {
          // console.log(item.salahName);
          if (item.salahName === "Fajr") {
            fajrColor = generateRadialColor(item.salahStatus);
          } else if (item.salahName === "Dhuhr") {
            zoharColor = generateRadialColor(item.salahStatus);
          } else if (item.salahName === "Asar") {
            asarColor = generateRadialColor(item.salahStatus);
          } else if (item.salahName === "Maghrib") {
            maghribColor = generateRadialColor(item.salahStatus);
          } else if (item.salahName === "Isha") {
            ishaColor = generateRadialColor(item.salahStatus);
          }
        });
      }
    }

    return null;
  }

  // const Column = ({ index, style }) => <div style={style}>Column {index}</div>;
  const Column = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div
      style={{
        ...style,
        width: monthsBetween.length === 1 ? "100%" : style.width,
        borderRight: "1px solid rgb(0, 0, 0, 0.2)",
      }}
      // bg-[color:var(--card-bg-color)]

      className={`bg-[color:var(--card-bg-color)] pb-5 calendar-single-month-wrap whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
    >
      <div
        ref={calenderSingleMonthHeightRef}
        className={`month-name-days-dates-wrap`}
      >
        <p className="py-4 font-semibold text-center">
          {formattedMonths[index]}
        </p>
        <div className="grid grid-cols-7 px-2 mb-3 place-items-center days-row-wrap">
          {days.map((day) => {
            return (
              <div
                key={uuidv4()}
                className="w-5 h-5 text-sm font-semibold text-center individual-day"
              >
                {day}
              </div>
            );
          })}
        </div>
        <div
          className="grid grid-cols-7 px-2 gap-y-5 place-items-center month-dates-wrap"
          key={uuidv4()}
        >
          {monthlyDates(formattedMonths[index]).map((day) => (
            <div
              onClick={() => {
                if (day <= todaysDate) {
                  const formattedDate = format(day, "dd.MM.yy");

                  setClickedDate(formattedDate);
                  // console.log("CLICKED DATE IS: " + clickedDate);
                  // showDailySalahData(clickedDate);
                  setShowDailySalahDataModal(true);
                  // console.log(showDailySalahDataModal);
                  console.log("TRIGGERED");
                }
              }}
              key={uuidv4()}
              className="relative flex items-center justify-center individual-date"
            >
              {determineRadialColors(day)}
              <svg
                className="absolute"
                xmlns="http://www.w3.org/2000/svg"
                id="svg"
                viewBox="0 0 150 150"
                style={{ height: "35px", width: "35px" }}
              >
                <desc>Created with Snap</desc>
                <defs />
                <path
                  d="M 86.1150408904588 8.928403485284022 A 67 67 0 0 1 134.40308587902058 44.011721763710284"
                  style={{
                    strokeWidth: "11px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={zoharColor}
                />
                <path
                  d="M 141.272558935669 65.15378589922615 A 67 67 0 0 1 122.82816700032245 121.91978731185029"
                  style={{
                    strokeWidth: "11px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={asarColor}
                />
                <path
                  d="M 104.84365305321519 134.98630153992926 A 67 67 0 0 1 45.15634694678482 134.98630153992926"
                  style={{
                    strokeWidth: "11px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={maghribColor}
                />
                <path
                  d="M 27.171832999677548 121.91978731185029 A 67 67 0 0 1 8.72744106433099 65.15378589922618"
                  style={{
                    strokeWidth: "11px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={ishaColor}
                />
                <path
                  d="M 15.596914120979442 44.01172176371027 A 67 67 0 0 1 63.884959109541164 8.928403485284022"
                  style={{
                    strokeWidth: "11px",
                    strokeLinecap: "round",
                  }}
                  fill="none"
                  stroke={fajrColor}
                />
              </svg>
              <p
                //
                className={` text-sm cursor-pointer flex items-center justify-center font-semibold h-6 w-6 hover:text-white  ${
                  isDayInSpecificMonth(day, formattedMonths[index])
                    ? "white"
                    : "text-gray-600"
                }
              `}
              >
                {format(day, "d")}
                {/* {format(day, "dd")} */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const isItemLoaded = (index) => !!itemStatusMap[index];
  const loadMoreItems = async (startIndex, stopIndex) => {
    try {
      // const moreRows = await fetchSalahTrackingDataFromDB(
      //   startIndex,
      //   stopIndex
      // );
      console.log("START AND STOP INDEX: ", startIndex, stopIndex);
      setSalahData((prevData) => [...prevData, ...moreRows]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <div
    //   // style={{ height: singleMonthDivHeight }}
    //   className="bg-[color:var(--card-bg-color)] calender-list-wrap mb-3 rounded-md"
    // >
    <>
      <InfiniteLoader
        // isRowLoaded={isRowLoaded}
        // loadMoreRows={loadMoreRows}
        // rowCount={monthsBetween.length}
        isItemLoaded={isItemLoaded}
        itemCount={monthsBetween.length}
        loadMoreItems={loadMoreItems}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                // style={{ borderRadius: "0.5rem" }}
                className="list rounded-2xl"
                // height={330}
                height={370}
                itemCount={monthsBetween.length}
                // itemCount
                itemSize={300}
                layout="horizontal"
                width={width}
                direction="rtl"
              >
                {Column}
              </List>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
      {/* <AutoSizer disableHeight className="auto-sizer">
        {({ width }) => (
          <List
            // style={{ borderRadius: "0.5rem" }}
            className="list rounded-2xl"
            // height={330}
            height={370}
            itemCount={monthsBetween.length}
            itemSize={300}
            layout="horizontal"
            width={width}
            direction="rtl"
          >
            {Column}
          </List>
        )}
      </AutoSizer> */}
      {/* <DailyOverviewBottomSheet
        setShowDailySalahDataModal={setShowDailySalahDataModal}
        showDailySalahDataModal={showDailySalahDataModal}
        salahTrackingArray={salahTrackingArray}
        clickedDate={clickedDate}
      /> */}
    </>
    // </div>
  );
};

export default Calendar;
