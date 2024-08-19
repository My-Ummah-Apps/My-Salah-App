import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer, InfiniteLoader } from "react-virtualized";
AutoSizer;
import { DBConnectionStateType } from "../../types/types";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArray } from "../../types/types";

// import StreakCount from "../Stats/StreakCount";
const PrayerTable = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  renderTable,
  setTableData,
  tableData,
  fetchCalendarData,
  setReasonsArray,
  reasonsArray,
  datesFormatted,
  fetchSalahTrackingDataFromDB,
  userGender, // userStartDate,
  // startDate,
}: {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  renderTable: boolean;
  setTableData: React.Dispatch<React.SetStateAction<SalahRecordsArray>>;
  tableData: SalahRecordsArray;
  fetchCalendarData: () => Promise<void>;
  setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  reasonsArray: string[];
  datesFormatted: string[];
  fetchSalahTrackingDataFromDB: (
    startIndex: number,
    endIndex: number
  ) => Promise<any>;
  userGender: string;
  // userStartDate: string;
  // startDate: Date;
}) => {
  // ! BUG: If the user scrolls too fast, the table doesn't crash, however, cells cannot be updated, and the table stops at a particular date, it doesn't go all the way back to the userstartdate as it should, if scrolling is done at a normal speed then these issues do not occur
  // console.log("PRAYER TABLE COMPONENT RENDERED AND DATA IS: ", tableData);
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const [clickedDate, setClickedDate] = useState<string>("");
  const [clickedSalah, setClickedSalah] = useState<string>("");

  const rowGetter = ({ index }: any) => {
    // console.log("ROWGETTER HAS RUN", tableData);
    // return tableData[index];
    return tableData[index];
  };

  // const isRowLoaded = ({ index }: any) => {
  //   // console.log("ISROWLOADED HAS RUN AND BOOLEAN IS: " + !!tableData[index]);
  //   return !!tableData[index];
  // };

  // const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>();

  // const loadMoreRows = async ({ startIndex, stopIndex }: any) => {
  //   setShowPlaceHolder(true);
  //   try {
  //     const moreRows = await fetchSalahTrackingDataFromDB(
  //       startIndex,
  //       stopIndex
  //     );

  //     console.log("START AND STOP INDEX: ", startIndex, stopIndex);
  //     setTableData((prevData: SalahRecordsArray) => [...prevData, ...moreRows]);
  //     setShowPlaceHolder(true);
  //     console.log("Data within loadmorerows: ", tableData);
  //     console.log("loadmorerows has run");
  //   } catch (error) {
  //     console.error("Error loading more rows:", error);
  //   }
  // };

  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";
  const dict = {
    group: "bg-[color:var(--jamaah-status-color)]",
    "male-alone": "bg-[color:var(--alone-male-status-color)]",
    "female-alone": "bg-[color:var(--alone-female-status-color)]",
    excused: "bg-[color:var(--excused-status-color)]",
    late: "bg-[color:var(--late-status-color)]",
    missed: "bg-[color:var(--missed-status-color)]",
  };

  const salahNamesArr = ["Fajr", "Dhuhr", "Asar", "Maghrib", "Isha"];

  return (
    <section className="relative">
      {/* <div style={{ width: "100vw !important" }}> */}
      {renderTable === true ? (
        // <InfiniteLoader
        //   isRowLoaded={isRowLoaded}
        //   loadMoreRows={loadMoreRows}
        //   rowCount={datesFormatted.length}
        //   threshold={1000} // Threshold at which to pre-fetch tableData. A threshold X means that tableData will start loading when a user scrolls within X rows. Defaults is 15.
        // >
        //   {({ onRowsRendered, registerChild }) => (
        <Table
          style={{
            textTransform: "none",
          }}
          className="text-center"
          // onRowsRendered={onRowsRendered}
          // ref={registerChild}
          rowCount={datesFormatted.length}
          rowGetter={rowGetter}
          rowHeight={100}
          headerHeight={40}
          height={800}
          width={510}
        >
          <Column
            style={{ marginLeft: "0" }}
            className="text-sm text-left"
            label=""
            dataKey="date"
            width={120}
            flexGrow={1}
          />
          {salahNamesArr.map((salahName) => (
            <Column
              key={salahName + uuidv4}
              style={{ marginLeft: "0" }}
              className="text-sm"
              label={salahName}
              // dataKey="rowData.salahs[salahName]"
              dataKey={""}
              width={120}
              flexGrow={1}
              cellRenderer={({ rowData }) => {
                // console.log("ROW DATA IS: ", rowData);
                // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                // const formattedDay = format(rowData, "EEEE");
                // return rowData ? (
                // console.log("RENDERING COLUMN, SALAH STATUS IS:");
                // console.log(rowData.salahs[salahName]);
                return rowData.salahs[salahName] === "" ? (
                  <LuDot
                    className={`w-[24px] h-[24px]`}
                    onClick={() => {
                      setShowUpdateStatusModal(true);
                      setClickedDate(rowData.date);
                      setClickedSalah(salahName);
                      setHasUserClickedDate(true);
                    }}
                  />
                ) : (
                  <div
                    className={`w-[24px] h-[24px] ${iconStyles}
                        ${
                          dict[rowData.salahs[salahName] as keyof typeof dict]
                        }`}
                    onClick={() => {
                      setShowUpdateStatusModal(true);
                      setClickedDate(rowData.date);
                      setClickedSalah(salahName);
                      setHasUserClickedDate(true);
                    }}
                  >
                    {/* {cellData} */}
                  </div>
                );
              }}
            />
          ))}
        </Table>
      ) : (
        // )}
        // </InfiniteLoader>
        <div>Loading Data...</div>
      )}

      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
      {showUpdateStatusModal && (
        <PrayerStatusBottomSheet
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          setTableData={setTableData}
          tableData={tableData}
          fetchCalendarData={fetchCalendarData}
          setReasonsArray={setReasonsArray}
          reasonsArray={reasonsArray}
          clickedDate={clickedDate}
          clickedSalah={clickedSalah}
          dbConnection={dbConnection}
          userGender={userGender}
          setShowUpdateStatusModal={setShowUpdateStatusModal}
          showUpdateStatusModal={showUpdateStatusModal}
          setHasUserClickedDate={setHasUserClickedDate}
          hasUserClickedDate={hasUserClickedDate}
        />
      )}
    </section>
  );
};

export default PrayerTable;
