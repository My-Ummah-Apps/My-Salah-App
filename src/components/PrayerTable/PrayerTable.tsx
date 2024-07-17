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
const PrayerTable = ({
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

  const [data, setData] = useState<any>([]);
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

  let holdArr: any;
  holdArr = [];
  const fetchDataFromDatabase = async (
    startIndex: number,
    endIndex: number
  ) => {
    // holdArr = [];
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

      const query = `SELECT * FROM salahtrackingtable WHERE date IN (${placeholders})`;
      const res = await dbConnection.current?.query(
        query,
        slicedDatesFormattedArr
      );

      console.log("RES IS: ");
      console.log(res);
      console.log(slicedDatesFormattedArr);

      // console.log("staticDateAndDatabaseDataCombined HAS RUN");
      for (let i = 0; i < slicedDatesFormattedArr.length; i++) {
        const dateFromDatesFormattedArr = datesFormatted[startIndex + i];

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

        if (res?.values && res.values.length > 0) {
          for (let i = 0; i < res.values.length; i++) {
            if (res.values?.[i]?.date === dateFromDatesFormattedArr) {
              // console.log("DATE MATCH DETECTED");
              let salahName: any = res?.values?.[i].salahName;
              let salahStatus: string = res?.values?.[i].salahStatus;
              singleSalahObj.salahs[salahName] = salahStatus;
            }
          }
        }

        holdArr.push(singleSalahObj);
      }

      console.log("holdArr data is:");
      console.log(holdArr);
      console.log("holdArr length is:");
      console.log(holdArr.length);

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

  const rowGetter = ({ index }: any) => {
    console.log("ROWGETTER HAS RUN");
    console.log(data[index]);
    return data[index];
    // return data[index] || { date: "Loading...", salahs: {} };
  };

  const isRowLoaded = ({ index }: any) => {
    console.log("ISROWLOADED HAS RUN AND BOOLEAN IS: " + !!data[index]);
    return !!data[index];
  };

  const loadMoreRows = async ({ startIndex, stopIndex }: any) => {
    try {
      const moreRows = await fetchDataFromDatabase(startIndex, stopIndex + 500);
      setData((prevData: any) => [...prevData, ...moreRows]);
    } catch (error) {
      console.error("Error loading more rows:", error);
    }
  };

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
                  console.log("ROWDATA IN DATE COLUMN:");
                  console.log(rowData);
                  // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  // const formattedDay = format(rowData, "EEEE");
                  {
                    return rowData.date ? (
                      <div>{rowData.date}</div>
                    ) : (
                      <div>{"Loading..."}</div>
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
                    console.log(rowData.salahs[salahName]);
                    // console.log(typeof rowData.salahs[salahName]);
                    // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                    // const formattedDay = format(rowData, "EEEE");
                    return rowData ? (
                      <PrayerTableCell
                        dbConnection={dbConnection}
                        salahStatusFromCell={rowData.salahs[salahName]}
                        cellDate={rowData.date}
                        salahName={salahName}
                        userGender={userGender}
                      />
                    ) : (
                      <div>{"Loading..."}</div>
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

export default PrayerTable;
