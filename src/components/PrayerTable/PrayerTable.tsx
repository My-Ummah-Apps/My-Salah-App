import React, { useEffect, useState, useReducer, useRef } from "react";

import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer, InfiniteLoader } from "react-virtualized";
AutoSizer;

import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArray } from "../../types/types";

// import StreakCount from "../Stats/StreakCount";
const PrayerTable = ({
  dbConnection,
  renderTable,
  setSIndex,
  setEIndex,
  sIndex,
  eIndex,
  setData,
  data,
  setReasonsArray,
  reasonsArray,
  datesFormatted,
  fetchSalahTrackingDataFromDB,
  userGender,
  userStartDate,
  startDate,
}: {
  dbConnection: any;
  renderTable: boolean;
  setSIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  setEIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  sIndex: number;
  eIndex: number;
  setData: React.Dispatch<React.SetStateAction<SalahRecordsArray>>;
  data: SalahRecordsArray;
  setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  reasonsArray: string[];
  datesFormatted: string[];
  fetchSalahTrackingDataFromDB: (
    startIndex: number,
    endIndex: number
  ) => Promise<any>;
  userGender: string;
  userStartDate: string;
  startDate: Date;
}) => {
  console.log("PRAYER TABLE COMPONENT RENDERED AND DATA IS: ", data);
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);
  // const [salahStatus, setSalahStatus] = useState<string | undefined>();
  // userStartDate = "05.05.22";
  let [cellColor, setCellColor] = useState<JSX.Element>();
  // let sIndex: number = 0;
  // let eIndex: number = 0;

  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const [clickedDate, setClickedDate] = useState<string>("");
  const [clickedSalah, setClickedSalah] = useState<string>("");

  const rowGetter = ({ index }: any) => {
    // if (data[index] === undefined) {
    //   console.log("ROWGETTER HAS RUN, Looking for index: ", index);
    //   console.log("ROWGETTER HAS RUN", data);
    // }
    console.log("ROWGETTER HAS RUN, Looking for index: ", index);
    console.log("ROWGETTER HAS RUN", data);
    return data[index];
    // return data[index] || { date: "Loading...", salahs: {} };
  };

  const isRowLoaded = ({ index }: any) => {
    // console.log("ISROWLOADED HAS RUN AND BOOLEAN IS: " + !!data[index]);
    return !!data[index];
  };

  const loadMoreRows = async ({ startIndex, stopIndex }: any) => {
    try {
      // const moreRows = await fetchSalahTrackingDataFromDB(startIndex, stopIndex + 500);
      const moreRows = await fetchSalahTrackingDataFromDB(
        startIndex,
        stopIndex
      );
      // sIndex = startIndex;
      // eIndex = stopIndex;
      setSIndex(startIndex);
      setEIndex(stopIndex);
      setData((prevData: SalahRecordsArray) => [...prevData, ...moreRows]);
      console.log("Data within loadmorerows: ", data);
      console.log("loadmorerows has run");
    } catch (error) {
      console.error("Error loading more rows:", error);
    }
  };

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
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={datesFormatted.length}
          threshold={100} // Threshold at which to pre-fetch data. A threshold X means that data will start loading when a user scrolls within X rows. Defaults is 15.
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
                className="text-sm text-left"
                label=""
                dataKey="date"
                width={120}
                flexGrow={1}
                // cellRenderer={({ rowData }) => {
                //   console.log("ROWDATA IN DATE COLUMN:");
                //   console.log(rowData);
                //   // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                //   // const formattedDay = format(rowData, "EEEE");
                //   {
                //     return rowData.date ? (
                //       <div>{rowData.date}</div>
                //     ) : (
                //       <div>{"Loading..."}</div>
                //     );
                //   }
                // }}
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
                    // console.log("ROW DATA IS:");
                    // console.log(rowData);
                    // console.log(typeof rowData.salahs[salahName]);
                    // const dateObject = parse(rowData, "dd.MM.yy", new Date());
                    // const formattedDay = format(rowData, "EEEE");
                    // return rowData ? (
                    // console.log("RENDERING COLUMN, SALAH STATUS IS:");
                    // console.log(rowData.salahs[salahName]);
                    return rowData.salahs[salahName] === "" ? (
                      <LuDot
                        className="w-[24px] h-[24px]"
                        onClick={() => {
                          setShowUpdateStatusModal(true);
                          setClickedDate(rowData.date);
                          setClickedSalah(salahName);
                          setHasUserClickedDate(true);
                          // console.log("SALAH INFO IS:");
                          // console.log(rowData.salahs[salahName]);
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => {
                          setShowUpdateStatusModal(true);
                          setClickedDate(rowData.date);
                          setClickedSalah(salahName);
                          setHasUserClickedDate(true);
                        }}
                        // There's an issue where, when a salah status is added OR modified with reasons etc or without, the table cell color does NOT change or isn't updated ie it remains as a dot, only upon page refresh does it change, HOWEVER, if the cell is clicked on even without a refresh all the details are there ie salah status, any reasons or notes... so its literally just the cell color thats not changing, unsure if the below is the cause of this, this component is re-rendering and the below should be dealing with the table cell color but it isn't for some reasons
                        className={`${iconStyles}
                        ${dict[rowData.salahs[salahName]]}
                        `}
                      >
                        {/* {cellData} */}
                      </div>
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
      {showUpdateStatusModal && (
        <PrayerStatusBottomSheet
          sIndex={sIndex}
          eIndex={eIndex}
          setCellColor={setCellColor}
          fetchSalahTrackingDataFromDB={fetchSalahTrackingDataFromDB}
          setData={setData}
          data={data}
          setReasonsArray={setReasonsArray}
          reasonsArray={reasonsArray}
          // salahName={salahName}
          // cellDate={cellDate}
          clickedDate={clickedDate}
          clickedSalah={clickedSalah}
          dbConnection={dbConnection}
          userGender={userGender}
          setShowUpdateStatusModal={setShowUpdateStatusModal}
          showUpdateStatusModal={showUpdateStatusModal}
          setHasUserClickedDate={setHasUserClickedDate}
          hasUserClickedDate={hasUserClickedDate}
          // setSalahStatus={setSalahStatus}
          // salahStatus={salahStatus}
        />
      )}
    </section>
  );
};

export default PrayerTable;
