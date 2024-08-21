import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import { DBConnectionStateType } from "../../types/types";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArray } from "../../types/types";

// import StreakCount from "../Stats/StreakCount";

interface PrayerTableProps {
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
  userGender: string;
}

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
  userGender,
}: PrayerTableProps) => {
  // console.log("PRAYER TABLE COMPONENT RENDERED AND DATA IS: ", tableData);
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const [clickedDate, setClickedDate] = useState<string>("");
  const [clickedSalah, setClickedSalah] = useState<string>("");

  const rowGetter = ({ index }: any) => {
    return tableData[index];
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
      {renderTable === true ? (
        <Table
          style={{
            textTransform: "none",
          }}
          className="text-center"
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
                  ></div>
                );
              }}
            />
          ))}
        </Table>
      ) : (
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
