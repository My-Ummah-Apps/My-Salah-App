import React, { useState } from "react";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import {
  DBConnectionStateType,
  DBResultDataObjType,
  SalahNamesType,
  SelectedSalahAndDateType,
  userPreferencesType,
} from "../../types/types";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArrayType } from "../../types/types";
import { prayerStatusColorsHexCodes } from "../../utils/constants";
import { format, parse } from "date-fns";

// import StreakCount from "../Stats/StreakCount";

interface PrayerTableProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  renderTable: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  handleSalahTrackingDataFromDB: (
    DBResultAllSalahData: DBResultDataObjType[]
  ) => Promise<void>;
  fetchedSalahData: SalahRecordsArrayType;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const PrayerTable = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setFetchedSalahData,
  fetchedSalahData,
  handleSalahTrackingDataFromDB,
  setUserPreferences,
  userPreferences,
}: PrayerTableProps) => {
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<SelectedSalahAndDateType>({
      selectedDates: [],
      selectedSalahs: [],
    });
  const [isRowEditMode, setIsRowEditMode] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<number | null>(null);
  // const [toggleCheckbox, setToggleCheckbox] = useState<boolean>(false);

  // const rowGetter = ({ index }: any) => {
  //   return fetchedSalahData[index];
  // };

  const resetSelectedSalahAndDate = () => {
    setSelectedSalahAndDate({ selectedDates: [], selectedSalahs: [] });
  };

  const resetSelectedRow = () => {
    setIsSelectedRow(null);
  };

  const iconStyles =
    "inline-block rounded-md text-white w-[24px] h-[24px] shadow-md";

  const salahNamesArr: SalahNamesType[] = [
    "Fajr",
    "Dhuhr",
    "Asar",
    "Maghrib",
    "Isha",
  ];

  // console.log("isRowEditMode: ", isRowEditMode);

  // const handleCheckboxChange = () => {

  // }

  const handleTableCellSelection = (
    salahName: SalahNamesType,
    rowData: any
  ) => {
    console.log("CLICKED: ", salahName, rowData);
    // setToggleCheckbox((prev) => !prev);
    setSelectedSalahAndDate((prev) => ({
      ...prev,
      selectedDates: [rowData.date],
    }));

    setSelectedSalahAndDate((prev) => {
      return prev.selectedSalahs.includes(salahName)
        ? {
            ...prev,
            selectedSalahs: prev.selectedSalahs.filter(
              (salah) => salahName !== salah
            ),
          }
        : { ...prev, selectedSalahs: [...prev.selectedSalahs, salahName] };
    });

    if (!isRowEditMode) {
      setShowUpdateStatusModal(true);
    } else if (isRowEditMode) {
    }
  };

  return (
    <section className="h-[80vh]">
      {/* <section className="relative h-[80vh]"> */}
      {isRowEditMode && (
        <section className="absolute top-0 left-0 h-[9vh] z-20 flex w-full p-5">
          <section className="w-full text-right">
            <button
              className="pr-2"
              onClick={() => {
                // TODO: Improve the alert below to something more native
                const dateArrLength =
                  Object.values(selectedSalahAndDate)[1].length;
                dateArrLength > 0
                  ? setShowUpdateStatusModal(true)
                  : alert("Please select atleast one Salah");
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setIsRowEditMode(false);
                // setSelectedSalahAndDate({
                //   selectedDates: [],
                //   selectedSalahs: [],
                // });
                resetSelectedRow();
                resetSelectedSalahAndDate();
              }}
            >
              Cancel
            </button>
          </section>
        </section>
      )}

      {/* {renderTable === true ? ( */}
      <AutoSizer>
        {({ height, width }) => (
          <Table
            style={{
              textTransform: "none",
              fontSize: "3rem",
            }}
            className="text-center"
            // rowCount={datesFromStartToToday.length}
            rowCount={fetchedSalahData.length}
            // rowGetter={rowGetter}
            rowGetter={({ index }) => fetchedSalahData[index]}
            // onRowClick={(obj) => {
            //   console.log("INDEX: ", obj.index);
            //   // setIsSelectedRow(obj.index);
            // }}
            rowClassName={({ index }) => {
              if (!isRowEditMode) {
                return "";
              } else {
                return isSelectedRow === index
                  ? "selected-row"
                  : "not-selected-row";
              }
            }}
            rowHeight={100}
            headerHeight={40}
            height={height}
            width={width}
          >
            <Column
              style={{ marginLeft: "0" }}
              className="items-center text-left"
              label=""
              dataKey="date"
              cellRenderer={({ rowData, rowIndex }) => {
                const parsedDate = parse(
                  rowData.date,
                  "yyyy-MM-dd",
                  new Date()
                );
                const userLocale = navigator.language || "en-US";
                const formattedParsedDate = new Intl.DateTimeFormat(
                  userLocale,
                  {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )
                  .format(parsedDate)
                  .replace(/\//g, ".");
                const day = format(parsedDate, "EE");
                return (
                  <section
                    onClick={() => {
                      if (isRowEditMode) return;
                      setIsSelectedRow(rowIndex);
                      setIsRowEditMode(true);
                      setSelectedSalahAndDate((prev) => ({
                        ...prev,
                        selectedDates: [rowData.date],
                      }));
                    }}
                  >
                    <p className="text-sm">{formattedParsedDate}</p>
                    <p className="text-sm">{day}</p>
                  </section>
                );
              }}
              width={120}
              flexGrow={1}
            />
            {salahNamesArr.map((salahName) => (
              <Column
                key={salahName}
                style={{ marginLeft: "0" }}
                className="items-center text-sm"
                label={salahName}
                dataKey={""}
                width={120}
                flexGrow={1}
                cellRenderer={({ rowData, rowIndex }) => {
                  return (
                    <section
                      onClick={() => {
                        if (isRowEditMode) return;
                        handleTableCellSelection(salahName, rowData);
                      }}
                      className="flex flex-col h-full"
                    >
                      {rowData.salahs[salahName] === "" ? (
                        <LuDot
                          className={`w-[24px] h-[24px]`}
                          // onClick={() => {
                          //   handleTableCellSelection(salahName, rowData);
                          // }}
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
                          // onClick={() => {
                          //   console.log("SQUARE CLICKED");
                          //   handleTableCellSelection(salahName, rowData);
                          // }}
                        ></div>
                      )}
                      {isSelectedRow === rowIndex && (
                        <div
                          // onClick={() => {
                          //   handleTableCellSelection(salahName, rowData);
                          // }}
                          className="mt-2"
                        >
                          <input
                            className="appearance-none w-4 h-4 rounded-full border-2 border-[#646464] bg-white checked:bg-[#4938ab] checked:border-transparent cursor-pointer"
                            type="checkbox"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onChange={() => {
                              handleTableCellSelection(salahName, rowData);
                            }}
                            // checked={toggleCheckbox}
                          ></input>
                        </div>
                      )}
                    </section>
                  );
                }}
              />
            ))}
          </Table>
        )}
      </AutoSizer>

      <PrayerStatusBottomSheet
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        setFetchedSalahData={setFetchedSalahData}
        fetchedSalahData={fetchedSalahData}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        handleSalahTrackingDataFromDB={handleSalahTrackingDataFromDB}
        // setSelectedSalahAndDate={setSelectedSalahAndDate}
        selectedSalahAndDate={selectedSalahAndDate}
        resetSelectedSalahAndDate={resetSelectedSalahAndDate}
        resetSelectedRow={resetSelectedRow}
        setIsRowEditMode={setIsRowEditMode}
        isRowEditMode={isRowEditMode}
        dbConnection={dbConnection}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        showUpdateStatusModal={showUpdateStatusModal}
        // setHasUserClickedDate={setHasUserClickedDate}
        // hasUserClickedDate={hasUserClickedDate}
      />
    </section>
  );
};

export default PrayerTable;
