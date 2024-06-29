import React, { useEffect, useState, useReducer } from "react";

import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import PrayerTableCell from "./PrayerTableCell";
import useSQLiteDB from "../../utils/useSqLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { salahTrackingEntryType } from "../../types/types";
import { subDays, format, parse, eachDayOfInterval } from "date-fns";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

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
  const { performSQLAction, isDatabaseInitialised } = useSQLiteDB();

  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const [renderTableCell, setRenderTableCell] = useState(false);

  useEffect(() => {
    const initialiseAndLoadData = async () => {
      if (isDatabaseInitialised === true) {
        // await loadData();
        console.log("DATABASE HAS INITIASLISED!!!");
        setRenderTableCell(true);
      }
    };
    initialiseAndLoadData();
  }, [isDatabaseInitialised]);

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
  let currentDisplayedDates: string[] = [];
  function generateTableRowDates() {
    currentDisplayedDates = Array.from(
      { length: datesBetweenUserStartDateAndToday.length },
      (_, index) => {
        const date = subDays(startDate, index);
        return format(date, "dd.MM.yy");
      }
    );
  }

  generateTableRowDates();

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
    console.log("SALAH NAME IS: " + salahName);
    console.log("formattedDate DATE IS: " + formattedDate);
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
            console.log("RESULT IS: ");
            console.log(result.values[0].salahStatus);
            setSalahStatus(result.values[0].salahStatus);
            setSelectedReasons(result.values[0].reasons);
            setNotes(result.values[0].notes);
            currentSalahStatus = result.values[0].salahStatus;
          } else {
            console.log("RESULT DOES NOT EXIST");
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
      console.log("ERROR ON LINE 274 PrayerTableDisplay.tsx");
    }

    console.log("STATUS OF SALAH: ");
    console.log(salahStatus);
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

  const rowGetter = ({ index }: any) => {
    return currentDisplayedDates[index]; // Return data for the row at the specified index
  };

  return (
    <section className="relative">
      <PrayerStatusBottomSheet
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

      {/* <div style={{ width: "100vw !important" }}> */}
      <Table
        style={{
          textTransform: "none",
        }}
        className="text-center "
        rowCount={currentDisplayedDates.length}
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
            const dateObject = parse(rowData, "dd.MM.yy", new Date());
            const formattedDate = format(dateObject, "dd.MM.yy");
            const formattedDay = format(dateObject, "EEEE");
            return (
              <>
                <p>{formattedDate}</p>
                <p>{formattedDay}</p>
              </>
            );
          }}
        />

        <Column
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
              <></>
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
              <></>
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
              <></>
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
              <></>
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
              <></>
            );
          }}
        />
      </Table>
      {/* </div> */}
      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
    </section>
  );
};

export default PrayerTableDisplay;
