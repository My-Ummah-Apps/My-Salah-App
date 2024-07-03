import React, { useEffect, useState, useReducer, useRef } from "react";

import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer, InfiniteLoader } from "react-virtualized";
AutoSizer;
import PrayerTableCell from "./PrayerTableCell";
import { salahTrackingEntryType } from "../../types/types";
import { subDays, format, parse, eachDayOfInterval } from "date-fns";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../../utils/useSqLiteDB";
import { SQLiteConnection, CapacitorSQLite } from "@capacitor-community/sqlite";

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

  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const [renderTableCell, setRenderTableCell] = useState(false);

  // isDatabaseInitialised is never set to false, so can probably be removed safely

  // const loadData = async () => {
  //   try {
  //     // query db
  //     console.log("PERFORMSQLACTION IS RUNNING WITHIN TABLE COMPONENT!");
  //     await performSQLAction(
  //       async (dbConnection: SQLiteDBConnection | undefined) => {
  //         const respSelect = await dbConnection?.query(
  //           `SELECT * FROM salahtrackingtable`
  //         );
  //         console.log("TABLE DATA: ");
  //         console.log(respSelect);
  //         const result = await dbConnection?.query(
  //           `SELECT * FROM salahtrackingtable WHERE date = ? AND salahName = ?`,
  //           ["26.06.24", "Dhuhr"]
  //         );
  //         console.log("RESULT IS: ");
  //         console.log(result);
  //         // put a usestate here to set the items
  //         // setNotes("123"); // Remove this for debugging purposes only
  //       }
  //     );
  //   } catch (error) {
  //     alert((error as Error).message);
  //     console.log("ERROR IS COMING FROM LINE 67 in PrayerTableDisplay.tsx");
  //     // Put a usestate here such as setItems([]);
  //   }
  // };

  const [data, setData] = useState<any>([]);
  const [renderTable, setRenderTable] = useState(false);

  useEffect(() => {
    console.log("isDatabaseInitialised useEffect has run");
    const initialiseAndLoadData = async () => {
      if (isDatabaseInitialised === true) {
        console.log("DATABASE HAS INITIALISED");
        // setRenderTableCell(true);
        setData(await fetchDataFromDatabase(1, 50));
        setRenderTable(true);
        // console.log("setData");
      }
    };
    initialiseAndLoadData();
  }, [isDatabaseInitialised]);

  const INITIAL_LOAD_SIZE = 50;
  const LOAD_MORE_SIZE = 50;

  const [isLoading, setIsLoading] = useState(false);
  console.log(data);

  // let currentDisplayedDates: string[] = [];
  // function generateTableRowDates() {
  //   currentDisplayedDates = Array.from(
  //     { length: datesBetweenUserStartDateAndToday.length },
  //     (_, index) => {
  //       const date = subDays(startDate, index);
  //       return format(date, "dd.MM.yy");
  //     }
  //   );
  // }

  // let currentDisplayedDates: string[] = [];
  const fetchDataFromDatabase = async (start: number, end: number) => {
    console.log("fetchDataFromDatabase FUNCTION HAS EXECUTED");
    try {
      const isDbOpen = await dbConnection.current?.isDBOpen();
      // console.log("isDbOpen:");
      // console.log(isDbOpen);
      if (isDbOpen?.result === false) {
        await dbConnection.current?.open();
        console.log(
          "DB Connection within fetchDataFromDatabase function opened successfully"
        );
      }

      const res = await dbConnection.current?.query(
        `SELECT * FROM salahtrackingtable WHERE id BETWEEN ? AND ?`,
        [start, end]
      );
      // console.log("RES IS: ");
      // console.log(res);
      // setData(res);
      return res?.values;

      // Despite fetchDataFromDatabase only being called after database is initialised,
      // for some reason establishDBConnection still returns undefined
      // const query = `SELECT date, salahName, salahStatus, reasons, notes
      //     FROM salahtrackingtable
      //     LIMIT ? OFFSET ?`;

      // const rows = await dbConnection?.all(query, [end - start, start]);
    } catch (error) {
      console.log("ERROR IN fetchDataFromDatabase FUNCTION: ");
      console.log(error);
    }
    // return Array.from({ length: end - start }, (_, index) => {
    //   const date = subDays(startDate, index);
    //   return {
    //     date: format(date, "dd.MM.yy"),
    //   };
    // });
  };

  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableRowDate, setTableRowDate] = useState("");

  // userStartDate = "05.05.22";
  const userStartDateFormatted = parse(userStartDate, "dd.MM.yy", new Date());
  const endDate = new Date(); // Current date
  const datesBetweenUserStartDateAndToday = eachDayOfInterval({
    start: userStartDateFormatted,
    end: endDate,
  });
  // console.log(datesBetweenUserStartDateAndToday.length);
  const datesFormatted = datesBetweenUserStartDateAndToday.map((date) =>
    format(date, "dd.MM.yy")
  );
  datesFormatted.reverse();

  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [salahStatus, setSalahStatus] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reasonsArray, setReasonsArray] = useState<string[]>([]);
  // const [showReasons, setShowReasons] = useState(false);
  const [showAddCustomReasonInputBox, setShowAddCustomReasonInputBox] =
    useState(false);
  let selectedReasonsArray = selectedReasons;
  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [customReason, setCustomReason] = useState("");
  const handleCustomReason = (e: any) => {
    setCustomReason(e.target.value);
  };
  const [notes, setNotes] = useState("");
  const handleNotes = (e: any) => {
    setNotes(e.target.value);
  };

  // const [showMonthlyCalenderModal, setShowMonthlyCalenderModal] =
  //   useState(false);

  const doesSalahAndDateExists = async (
    salahName: string,
    formattedDate: string
  ): Promise<string | null> => {
    // console.log("SALAH NAME IS: " + salahName);
    // console.log("formattedDate DATE IS: " + formattedDate);
    // let doesSalahAndDateExistsResult = false;
    let currentSalahStatus = null;
    try {
      await performSQLAction(
        async (dbConnection: SQLiteDBConnection | undefined) => {
          // const count = await dbConnection?.query(
          //   `SELECT COUNT(*) AS count FROM salahtrackingtable WHERE date = ? AND salahName = ?`,
          //   [formattedDate, salahName]
          // );
          // console.log("COUNT IS: ");
          // console.log(count);
          const result = await dbConnection?.query(
            `SELECT * FROM salahtrackingtable WHERE date = ? AND salahName = ?`,
            [formattedDate, salahName]
          );
          // console.log("RESULT IS: ");
          // console.log(result);

          if (result && result.values && result.values.length > 0) {
            // console.log("RESULT IS: ");
            // console.log(result.values[0].salahStatus);
            setSalahStatus(result.values[0].salahStatus);
            setSelectedReasons(result.values[0].reasons);
            setNotes(result.values[0].notes);
            currentSalahStatus = result.values[0].salahStatus;
          } else {
            // console.log("RESULT DOES NOT EXIST");
            setSalahStatus("");
            setSelectedReasons([]);
            setNotes("");
          }

          // console.log("SALAH STATS IS:");
          // console.log(salahStatus);

          // if (count && count.values && count.values[0].count > 0) {
          //   // doesSalahAndDateExistsResult = true;
          //   console.log("COUNT EXISTS");
          //   console.log("COUNT IS: ");
          //   console.log(count);
          //   // alert("Entry exists");
          // } else {
          //   console.log("COUNT DOES NOT EXIST");
          //   // doesSalahAndDateExistsResult = false;
          //   // alert("Entry does not exist");
          // }

          // // update ui
          // const databaseData = await db?.query(
          //   `SELECT * FROM salahtrackingtable;`
          // );
          // console.log("DATABASE DATA:");
          // console.log(databaseData);
          // setItems(respSelect?.values);
        },
        async () => {
          // setInputName("");
          // setEditItem(undefined);
        }
      );
    } catch (error) {
      alert((error as Error).message);
      console.log("ERROR ON LINE 192 PrayerTableDisplay.tsx");
    }

    // console.log("STATUS OF SALAH: ");
    // console.log(salahStatus);
    return currentSalahStatus;
  };

  console.log("TABLE RERENDERED");
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  async function handleTableCellClick(
    salahName: string,
    formattedDate: string
  ) {
    setSalahStatus("");
    setSelectedReasons([]);
    setNotes("");

    let tableRowDate = formattedDate;
    // Does salahAndDateExist need to exists in two places?
    // const salahAndDateExist = await doesSalahAndDateExists(
    //   salahName,
    //   tableRowDate
    // );
    // await doesSalahAndDateExists(salahName, tableRowDate); // ADD THIS BACK IN

    // if (salahAndDateExist === true) {
    // } else if (salahAndDateExist === false) {
    //   setSalahStatus("");
    //   setSelectedReasons([]);
    //   setNotes("");
    // }

    // salahTrackingArray.forEach((item) => {
    //   if (item.salahName === salahName) {
    //     for (let i = 0; i < item.completedDates.length; i++) {
    //       // console.log(item.completedDates[i]);
    //       if (item.completedDates[i][tableRowDate]) {
    //         // console.log("TRUE");
    //         // setSalahStatus(item.completedDates[i][tableRowDate].status);
    //         // setSelectedReasons(item.completedDates[i][tableRowDate].reasons);
    //         // setNotes(item.completedDates[i][tableRowDate].notes);
    //       }
    //     }
    //   }
    // });

    setSelectedSalah(salahName);
    setTableRowDate(tableRowDate);
  }

  useEffect(() => {
    const storedReasonsArray = localStorage.getItem("storedReasonsArray");
    if (storedReasonsArray) {
      setReasonsArray(JSON.parse(storedReasonsArray));
    } else if (storedReasonsArray === null) {
      const defaultReasonsArray = [
        "Alarm",
        "Education",
        "Family",
        "Friends",
        "Gaming",
        "Guests",
        "Leisure",
        "Movies",
        "Shopping",
        "Sleep",
        "Sports",
        "Travel",
        "TV",
        "Work",
      ];
      localStorage.setItem(
        "storedReasonsArray",
        JSON.stringify(defaultReasonsArray)
      );
      setReasonsArray(defaultReasonsArray);
    }
  }, []);

  // const wreathStyles = {
  //   // height: "30%",
  //   width: "35%",
  // };
  // let isDateColumn: boolean;
  const [isDateColumn, setIsDateColumn] = useState<boolean>();
  const rowGetter = ({ index }: any) => {
    console.log("ROWGETTER HAS RUN");
    // return currentDisplayedDates[index]; // Return data for the row at the specified index
    // if (isDatabaseInitialised === true) {
    if (isDateColumn) {
      console.log("datesFormatted[index]");
      console.log(datesFormatted[index]);
      console.log("ROWGETTER INDEX IS:");
      console.log(index);
      return datesFormatted[index];
    } else {
      return data[index];
    }

    // }
  };

  console.log("DATES FORMATTED ARRAY:");
  console.log(datesFormatted);

  const isRowLoaded = ({ index }: any) => {
    console.log("ISROWLOADED HAS RUN");
    // return !!currentDisplayedDates[index];
    // if (isDatabaseInitialised === true) {
    return !!data[index];
    // }
  };

  function loadMoreRows({ startIndex, stopIndex }: any) {
    console.log("LOADMOREROWS HAS RUN");
    if (isDateColumn) {
      return datesFormatted[startIndex];
    } else {
      return fetchDataFromDatabase(startIndex, stopIndex);
    }
    // if (isDatabaseInitialised === true) {

    // }
  }

  return (
    <section className="relative">
      {/* <div style={{ width: "100vw !important" }}> */}
      {renderTable ? (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={50}
        >
          {({ onRowsRendered, registerChild }) => (
            <Table
              style={{
                textTransform: "none",
              }}
              className="text-center"
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={50}
              // rowCount={currentDisplayedDates.length}
              rowGetter={rowGetter}
              rowHeight={100}
              headerHeight={40}
              height={800}
              width={510}
            >
              <Column
                style={{ marginLeft: "0" }}
                className="text-sm text-left "
                label="Date"
                dataKey="date"
                width={120}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  setIsDateColumn(true);

                  console.log("YOOOO");
                  console.log(rowData);
                  // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  // const formattedDay = format(rowData, "EEEE");

                  return typeof rowData === "string" ? (
                    <>
                      <p>{rowData}</p>
                      <p>{"Day"}</p>
                    </>
                  ) : (
                    <div>No Date</div>
                  );
                }}
              />

              {/* <Column
                className="text-center"
                label="Fajr"
                dataKey="date"
                width={80}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  const formattedDate = format(dateObject, "dd.MM.yy");
                  return renderTableCell ? (
                    <PrayerTableCell
                      salahStatus={salahStatus}
                      handleTableCellClick={handleTableCellClick}
                      setShowUpdateStatusModal={setShowUpdateStatusModal}
                      setHasUserClickedDate={setHasUserClickedDate}
                      doesSalahAndDateExists={doesSalahAndDateExists}
                      formattedDate={formattedDate}
                      salahName="Fajr"
                    />
                  ) : (
                    <>nil</>
                  );
                }}
              />
              <Column
                className="text-center"
                label="Dhuhr"
                dataKey="date"
                width={80}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  const formattedDate = format(dateObject, "dd.MM.yy");
                  return renderTableCell ? (
                    <PrayerTableCell
                      salahStatus={salahStatus}
                      handleTableCellClick={handleTableCellClick}
                      setShowUpdateStatusModal={setShowUpdateStatusModal}
                      setHasUserClickedDate={setHasUserClickedDate}
                      doesSalahAndDateExists={doesSalahAndDateExists}
                      formattedDate={formattedDate}
                      salahName="Dhuhr"
                    />
                  ) : (
                    <>nil</>
                  );
                }}
              />
              <Column
                className="text-center"
                label="Asar"
                dataKey="date"
                width={80}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  const formattedDate = format(dateObject, "dd.MM.yy");
                  return renderTableCell ? (
                    <PrayerTableCell
                      salahStatus={salahStatus}
                      handleTableCellClick={handleTableCellClick}
                      setShowUpdateStatusModal={setShowUpdateStatusModal}
                      setHasUserClickedDate={setHasUserClickedDate}
                      doesSalahAndDateExists={doesSalahAndDateExists}
                      formattedDate={formattedDate}
                      salahName="Asar"
                    />
                  ) : (
                    <>nil</>
                  );
                }}
              />
              <Column
                className="text-center"
                label="Maghrib"
                dataKey="date"
                width={80}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  const formattedDate = format(dateObject, "dd.MM.yy");
                  return renderTableCell ? (
                    <PrayerTableCell
                      salahStatus={salahStatus}
                      handleTableCellClick={handleTableCellClick}
                      setShowUpdateStatusModal={setShowUpdateStatusModal}
                      setHasUserClickedDate={setHasUserClickedDate}
                      doesSalahAndDateExists={doesSalahAndDateExists}
                      formattedDate={formattedDate}
                      salahName="Maghrib"
                    />
                  ) : (
                    <>nil</>
                  );
                }}
              />
              <Column
                className="text-center"
                label="Isha"
                dataKey="date"
                width={80}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  const formattedDate = format(dateObject, "dd.MM.yy");
                  return renderTableCell ? (
                    <PrayerTableCell
                      salahStatus={salahStatus}
                      handleTableCellClick={handleTableCellClick}
                      setShowUpdateStatusModal={setShowUpdateStatusModal}
                      setHasUserClickedDate={setHasUserClickedDate}
                      doesSalahAndDateExists={doesSalahAndDateExists}
                      formattedDate={formattedDate}
                      salahName="Isha"
                    />
                  ) : (
                    <>Nil</>
                  );
                }}
              /> */}
            </Table>
          )}
        </InfiniteLoader>
      ) : (
        <div>Loading Data...</div>
      )}

      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
      <PrayerStatusBottomSheet
        performSQLAction={performSQLAction}
        tableRowDate={tableRowDate}
        setSalahStatus={setSalahStatus}
        setSelectedReasons={setSelectedReasons}
        setReasonsArray={setReasonsArray}
        selectedReasonsArray={selectedReasonsArray}
        selectedReasons={selectedReasons}
        reasonsArray={reasonsArray}
        handleCustomReason={handleCustomReason}
        setNotes={setNotes}
        notes={notes}
        handleNotes={handleNotes}
        selectedSalah={selectedSalah}
        userGender={userGender}
        showUpdateStatusModal={showUpdateStatusModal}
        salahStatus={salahStatus}
        // handleTableCellClick={handleTableCellClick}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        setHasUserClickedDate={setHasUserClickedDate}
        hasUserClickedDate={hasUserClickedDate}
        customReason={customReason}
        setShowAddCustomReasonInputBox={setShowAddCustomReasonInputBox}
        showAddCustomReasonInputBox={showAddCustomReasonInputBox}
        doesSalahAndDateExists={doesSalahAndDateExists}
        // formattedDate={formattedDate}
      />
    </section>
  );
};

export default PrayerTableDisplay;
