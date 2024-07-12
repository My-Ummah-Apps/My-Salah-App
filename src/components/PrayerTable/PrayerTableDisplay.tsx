import React, { useEffect, useState, useReducer, useRef } from "react";

import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer, InfiniteLoader } from "react-virtualized";
AutoSizer;
import PrayerTableCell from "./PrayerTableCell";
import { salahTrackingEntryType } from "../../types/types";
import { subDays, format, parse, eachDayOfInterval } from "date-fns";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../../utils/useSqLiteDB";
import { SQLiteConnection, CapacitorSQLite } from "@capacitor-community/sqlite";
import { LuDot } from "react-icons/lu";
// import StreakCount from "../Stats/StreakCount";
const PrayerTableDisplay = ({
  userGender,
  userStartDate,
  setSalahTrackingArray,
  salahTrackingArray,
  startDate,
}: {
  userGender: string;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  userStartDate: string;
  salahTrackingArray: salahTrackingEntryType[];
  startDate: Date;
}) => {
  const {
    performSQLAction,
    isDatabaseInitialised,
    sqliteConnection,
    dbConnection,
  } = useSQLiteDB();
  console.log("PRAYER TABLE COMPONENT RENDERED");
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  // userStartDate = "05.05.22";
  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  const endDate = new Date(); // Current date
  const datesBetweenUserStartDateAndToday = eachDayOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });

  const datesFormatted = datesBetweenUserStartDateAndToday.map((date) =>
    format(date, "dd.MM.yy")
  );
  datesFormatted.reverse();

  // const [selectedSalah, setSelectedSalah] = useState("");

  // const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  // const [salahStatus, setSalahStatus] = useState("");
  // const [showReasons, setShowReasons] = useState(false);
  // const [showAddCustomReasonInputBox, setShowAddCustomReasonInputBox] =
  //   useState(false);
  // const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  // const [reasonsArray, setReasonsArray] = useState<string[]>([]);
  // let selectedReasonsArray = selectedReasons;
  // const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  // const [customReason, setCustomReason] = useState("");
  // const handleCustomReason = (e: any) => {
  //   setCustomReason(e.target.value);
  // };
  // const [notes, setNotes] = useState("");
  // const handleNotes = (e: any) => {
  //   setNotes(e.target.value);
  // };

  const [data, setData] = useState<any>([]);
  // console.log("DATA::");
  // console.log(data);
  const [renderTable, setRenderTable] = useState(false);
  const INITIAL_LOAD_SIZE = 50;
  const LOAD_MORE_SIZE = 50;
  useEffect(() => {
    console.log("isDatabaseInitialised useEffect has run");
    const initialiseAndLoadData = async () => {
      if (isDatabaseInitialised === true) {
        console.log("DATABASE HAS INITIALISED");
        setData(await fetchDataFromDatabase(1, INITIAL_LOAD_SIZE));
        console.log("setData within useEffect has run and its data is: ");
        console.log(data);
        console.log(data.length);
        setRenderTable(true);
      }
    };
    initialiseAndLoadData();
  }, [isDatabaseInitialised]);
  // isDatabaseInitialised is only initialised once, so can probably be safely removed

  const [isLoading, setIsLoading] = useState(false);
  // console.log(data);

  let holdArr: any = [];
  const fetchDataFromDatabase = async (
    startIndex: number,
    endIndex: number
  ) => {
    console.log("fetchDataFromDatabase FUNCTION HAS EXECUTED");
    try {
      const isDatabaseOpen = await dbConnection.current?.isDBOpen();
      console.log("START AND END INDEX: " + startIndex, endIndex);
      if (isDatabaseOpen?.result === false) {
        await dbConnection.current?.open();
        console.log(
          "DB Connection within fetchDataFromDatabase function opened successfully"
        );
      }

      const slicedDatesFormattedArr = datesFormatted.slice(
        startIndex,
        endIndex
      );
      const placeholders = slicedDatesFormattedArr.map(() => "?").join(", ");
      console.log("slicedDatesFormattedArr");
      console.log(slicedDatesFormattedArr);

      const query = `SELECT * FROM salahtrackingtable WHERE date IN (${placeholders})`;
      const res = await dbConnection.current?.query(
        query,
        slicedDatesFormattedArr
      );

      console.log("RES IS: ");
      console.log(res);

      // const staticDateAndDatabaseDataCombined = res?.values?.map(
      const staticDateAndDatabaseDataCombined = slicedDatesFormattedArr.map(
        (_, index) => {
          // console.log("OBJ:");
          // console.log(obj);
          const dateFromDatesFormattedArr = datesFormatted[startIndex + index];
          // const dateFromDatesFormattedArr = slicedDatesFormattedArr[index];

          // console.log("dateFromDatesFormattedArr: ");
          // console.log(dateFromDatesFormattedArr);

          type Salahs = {
            [key: string]: string;
          };

          let singleSalahObj = {
            date: dateFromDatesFormattedArr,
            salahs: {
              Fajr: "",
              Dhuhr: "",
              Asar: "",
              Maghrib: "",
              Isha: "",
            } as Salahs,
          };

          if (res?.values?.length) {
            for (let i = 0; i < res.values.length; i++) {
              if (res.values[index].date === dateFromDatesFormattedArr) {
                console.log("DATE MATCH DETECTED");
                let salahName: any = res?.values?.[index].salahName;
                let salahStatus: string = res?.values?.[index].salahStatus;
                singleSalahObj.salahs[salahName] = salahStatus;
                // console.log("salahName::");
                // console.log(singleSalahObj.salahs[salahName]);
              }
            }
          }

          // console.log("singleSalahObj");
          // console.log(singleSalahObj);
          holdArr.push(singleSalahObj);
        }
      );

      // console.log("holdArr data is:");
      // console.log(holdArr);
      console.log("holdArr length is:");
      console.log(holdArr.length);
      // console.log("DATA WITHIN FETCH FUNC:");
      // console.log(data);
      return holdArr;
    } catch (error) {
      console.log("ERROR IN fetchDataFromDatabase FUNCTION: ");
      console.log(error);
    } finally {
      try {
        const isDatabaseOpen = await dbConnection.current?.isDBOpen();
        if (isDatabaseOpen?.result) {
          await dbConnection.current?.close();
          console.log("Database connection closed within fetch function");
        }
      } catch (finalError) {
        console.log("ERROR CLOSING DATABASE CONNECTION:");
        console.log(finalError);
      }
    }
  };

  // const [showMonthlyCalenderModal, setShowMonthlyCalenderModal] =
  //   useState(false);

  console.log("TABLE RERENDERED");

  const rowGetter = ({ index }: any) => {
    // console.log("ROWGETTER HAS RUN");
    // console.log(data[index]);
    // console.log(dataArr[index]["01.01.24"][0].date);
    // return data ? data[index] : "none";
    return data[index];
  };

  // console.log("DATES FORMATTED ARRAY:");
  // console.log(datesFormatted);

  const isRowLoaded = ({ index }: any) => {
    // console.log("ISROWLOADED HAS RUN AND BOOLEAN IS: " + !!data[index]);
    // console.log("data amout is: " + data.length);
    return !!data[index];
  };

  async function loadMoreRows({ startIndex, stopIndex }: any) {
    // console.log("LOADMOREROWS HAS RUN");
    // console.log(startIndex, stopIndex);
    const moreRows = await fetchDataFromDatabase(startIndex, stopIndex);
    setData((prevData: any) => [...prevData, ...moreRows]);
    // return fetchDataFromDatabase(startIndex, stopIndex);
  }

  const salahNamesArr = ["Fajr", "Dhuhr", "Asar", "Maghrib", "Isha"];

  return (
    <section className="relative">
      {/* <div style={{ width: "100vw !important" }}> */}
      {renderTable === true ? (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={datesFormatted.length}
        >
          {({ onRowsRendered, registerChild }) => (
            <Table
              style={{
                textTransform: "none",
              }}
              className="text-center"
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={datesFormatted.length}
              rowGetter={rowGetter}
              rowHeight={100}
              headerHeight={40}
              height={800}
              width={510}
            >
              <Column
                style={{ marginLeft: "0" }}
                className="text-sm text-left "
                label=""
                dataKey=""
                width={120}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  // console.log("ROWDATA IN DATE COLUMN:");
                  // console.log(rowData);
                  // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  // const formattedDay = format(rowData, "EEEE");
                  {
                    return rowData !== "none" ? (
                      <div>{rowData.date}</div>
                    ) : (
                      <div>{""}</div>
                    );
                  }
                }}
              />
              {salahNamesArr.map((salahName) => (
                <Column
                  key={salahName + uuidv4}
                  style={{ marginLeft: "0" }}
                  className="text-sm text-left "
                  label={salahName}
                  dataKey=""
                  width={120}
                  flexGrow={1}
                  cellRenderer={({ rowData }) => {
                    console.log("ROWDATA");
                    // console.log(rowData);
                    // console.log(typeof rowData.salahs[salahName]);
                    // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                    // const formattedDay = format(rowData, "EEEE");
                    return (
                      <PrayerTableCell
                        dbConnection={dbConnection}
                        salahStatusFromCell={rowData.salahs[salahName]}
                        cellDate={rowData.date}
                        salahName={salahName}
                        userGender={userGender}
                      />
                    );
                  }}
                />
              ))}
            </Table>
          )}
        </InfiniteLoader>
      ) : (
        <div>Loading Data...</div>
      )}

      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
    </section>
  );
};

export default PrayerTableDisplay;
