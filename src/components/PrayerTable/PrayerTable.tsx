import React, { useState } from "react";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import { DBConnectionStateType } from "../../types/types";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArray } from "../../types/types";
import { prayerStatusColorsHexCodes } from "../../utils/prayerStatusColors";

// import StreakCount from "../Stats/StreakCount";

interface PrayerTableProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  renderTable: boolean;
  setTableData: React.Dispatch<React.SetStateAction<SalahRecordsArray>>;
  tableData: SalahRecordsArray;
  handleCalendarData: () => Promise<void>;
  setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  reasonsArray: string[];
  datesFromStartToToday: string[];
  userGender: string;
}

const PrayerTable = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  renderTable,
  setTableData,
  tableData,
  handleCalendarData,
  setReasonsArray,
  reasonsArray,
  datesFromStartToToday,
  userGender,
}: PrayerTableProps) => {
  // console.log("PRAYER TABLE COMPONENT RENDERED AND DATA IS: ", tableData);
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const [clickedDate, setClickedDate] = useState<string>("");
  const [clickedSalah, setClickedSalah] = useState<string>("");

  const rowGetter = ({ index }: any) => {
    console.log("tableData: ", tableData);
    return tableData[index];
  };

  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";

  const salahNamesArr = ["Fajr", "Dhuhr", "Asar", "Maghrib", "Isha"];

  return (
    <section className="relative">
      {/* {renderTable === true ? ( */}
      <Table
        style={{
          textTransform: "none",
        }}
        className="text-center"
        rowCount={datesFromStartToToday.length}
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
            key={salahName}
            style={{ marginLeft: "0" }}
            className="text-sm"
            label={salahName}
            dataKey={""}
            width={120}
            flexGrow={1}
            cellRenderer={({ rowData }) => {
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
                  style={{
                    backgroundColor:
                      prayerStatusColorsHexCodes[
                        rowData.salahs[
                          salahName
                        ] as keyof typeof prayerStatusColorsHexCodes
                      ],
                  }}
                  className={`w-[24px] h-[24px] ${iconStyles}`}
                  onClick={() => {
                    setShowUpdateStatusModal(true);
                    setClickedDate(rowData.date);
                    setClickedSalah(salahName);
                    setHasUserClickedDate(true);
                  }}
                ></div>
              );
            }}
          />
        ))}
      </Table>
      {/* // ) : (
      //   <div>Loading Data...</div>
      // )} */}

      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}
      {showUpdateStatusModal && (
        <PrayerStatusBottomSheet
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          setTableData={setTableData}
          tableData={tableData}
          handleCalendarData={handleCalendarData}
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
