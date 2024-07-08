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
  console.log("DATA::");
  console.log(data);
  const [renderTable, setRenderTable] = useState(false);
  const INITIAL_LOAD_SIZE = 50;
  const LOAD_MORE_SIZE = 50;
  useEffect(() => {
    console.log("isDatabaseInitialised useEffect has run");
    const initialiseAndLoadData = async () => {
      if (isDatabaseInitialised === true) {
        console.log("DATABASE HAS INITIALISED");
        // setRenderTableCell(true);
        setData(await fetchDataFromDatabase(1, INITIAL_LOAD_SIZE));
        console.log("setData within useEffect has run and its data is: ");
        console.log(data);
      }
    };
    initialiseAndLoadData();
  }, [isDatabaseInitialised]);

  useEffect(() => {
    console.log("DATA WITHIN USEEFFECT");
    console.log(data);
    if (data.length > 0) {
      console.log("RENDERTABLE TRUE");
      setRenderTable(true);
    }
  }, [data]);

  const [isLoading, setIsLoading] = useState(false);
  console.log(data);

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
  let holdArr: any = [];
  // let currentDisplayedDates: string[] = [];
  const fetchDataFromDatabase = async (
    startIndex: number,
    endIndex: number
  ) => {
    console.log("fetchDataFromDatabase FUNCTION HAS EXECUTED");
    try {
      const isDbOpen = await dbConnection.current?.isDBOpen();
      console.log("START AND END INDEX: " + startIndex, endIndex);
      if (isDbOpen?.result === false) {
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
      const staticDateAndDatabaseDataCombined = res?.values?.map(
        (obj, index) => {
          // console.log("OBJ:");
          // console.log(obj);
          const dateFromDatesFormattedArr = datesFormatted[startIndex + index];
          // const dateFromDatesFormattedArr = slicedDatesFormattedArr[index];

          console.log("dateFromDatesFormattedArr: ");
          console.log(dateFromDatesFormattedArr);

          type Salahs = {
            [key: string]: string;
          };

          let singleSalahObj = {
            date: dateFromDatesFormattedArr,
            salahs: {
              Fajr: "",
              Dhuhr: "",
              Asr: "",
              Maghrib: "",
              Isha: "",
            } as Salahs,
          };

          if (res?.values?.[index].date === dateFromDatesFormattedArr) {
            console.log("DATE MATCH DETECTED");
            let salahName: any = res?.values?.[index].salahName;
            let salahStatus: string = res?.values?.[index].salahStatus;
            singleSalahObj.salahs[salahName] = salahStatus;
            // console.log("salahName::");
            // console.log(singleSalahObj.salahs[salahName]);
          }
          // console.log("singleSalahObj");
          // console.log(singleSalahObj);
          holdArr.push(singleSalahObj);
        }
      );

      console.log("holdArr data is:");
      console.log(holdArr);
      console.log("holdArr length is:");
      console.log(holdArr.length);
      return holdArr;
      console.log("DATA WITHIN FETCH FUNC:");
      console.log(data);
    } catch (error) {
      console.log("ERROR IN fetchDataFromDatabase FUNCTION: ");
      console.log(error);
    }
  };

  const [selectedSalah, setSelectedSalah] = useState("");
  const [tableRowDate, setTableRowDate] = useState("");

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

    setSelectedSalah(salahName);
    setTableRowDate(tableRowDate);
  }

  // const wreathStyles = {
  //   // height: "30%",
  //   width: "35%",
  // };
  // let isDateColumn: boolean;

  // const generateData = (numberOfDays: number) => {
  //   const data = [];
  //   const salahStatuses = ["group", "male-alone", "missed", "late"];

  //   for (let i = 0; i < numberOfDays; i++) {
  //     const date = format(subDays(new Date(), i), "dd.MM.yy");
  //     const salahs = {
  //       Fajr: salahStatuses[Math.floor(Math.random() * salahStatuses.length)],
  //       Dhuhr: salahStatuses[Math.floor(Math.random() * salahStatuses.length)],
  //       Asar: salahStatuses[Math.floor(Math.random() * salahStatuses.length)],
  //       Maghrib:
  //         salahStatuses[Math.floor(Math.random() * salahStatuses.length)],
  //       Isha: salahStatuses[Math.floor(Math.random() * salahStatuses.length)],
  //     };

  //     data.push({ date, salahs });
  //   }

  //   return data;
  // };

  // const data = generateData(10000); // Generate 10,000 days of data
  // const [isDateColumn, setIsDateColumn] = useState<boolean>(true);
  const rowGetter = ({ index }: any) => {
    console.log("ROWGETTER HAS RUN");
    // console.log(dataArr[index]["01.01.24"][0].date);
    return data[index];
  };

  // console.log("DATES FORMATTED ARRAY:");
  // console.log(datesFormatted);

  const isRowLoaded = ({ index }: any) => {
    console.log("ISROWLOADED HAS RUN AND BOOLEAN IS: " + !!data[index]);
    console.log("data amout is: " + data.length);
    return !!data[index];
  };

  async function loadMoreRows({ startIndex, stopIndex }: any) {
    console.log("LOADMOREROWS HAS RUN");
    console.log(startIndex, stopIndex);
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
                dataKey="date"
                width={120}
                flexGrow={1}
                cellRenderer={({ rowData }) => {
                  console.log("ROWDATA");
                  console.log(rowData.date);
                  // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                  // const formattedDay = format(rowData, "EEEE");

                  return <div>{rowData.date}</div>;
                }}
              />
              {salahNamesArr.map((salahName) => (
                <Column
                  style={{ marginLeft: "0" }}
                  className="text-sm text-left "
                  label={salahName}
                  dataKey="date"
                  width={120}
                  flexGrow={1}
                  cellRenderer={({ rowData }) => {
                    console.log("ROWDATA");
                    console.log(rowData.salahs[salahName]);
                    // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                    // const formattedDay = format(rowData, "EEEE");
                    // return <div>{rowData}</div>;
                    return rowData ? (
                      <div>{rowData.salahs[salahName]}</div>
                    ) : (
                      <div>No Data</div>
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
