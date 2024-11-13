import React, { useEffect, useState } from "react";
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
  const [isMultiEditMode, setIsMultiEditMode] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<number | null>(null);

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

  // console.log("isMultiEditMode: ", isMultiEditMode);

  const handleTableCellSelection = (salahName: SalahNamesType) => {
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

    if (!isMultiEditMode) {
      setShowUpdateStatusModal(true);
    } else if (isMultiEditMode) {
    }
  };

  return (
    <section className="h-[80vh]">
      {/* <section className="relative h-[80vh]"> */}
      {isMultiEditMode && (
        <section className="absolute top-0 left-0 h-[9vh] z-20 flex w-full p-5">
          <section className="w-full text-right">
            <button
              className="pr-2"
              onClick={() => {
                console.log(Object.values(selectedSalahAndDate)[1]);

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
                setIsMultiEditMode(false);
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
            onRowClick={(obj) => {
              console.log("INDEX: ", obj.index);
              // setIsSelectedRow(obj.index);
            }}
            rowClassName={({ index }) => {
              return isSelectedRow === index ? "selected-row" : "";
            }}
            rowHeight={100}
            headerHeight={40}
            height={height}
            width={width}
          >
            <Column
              style={{ marginLeft: "0" }}
              className="text-left"
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
                      setIsSelectedRow(rowIndex);
                      setIsMultiEditMode(true);
                      // setSelectedSalahAndDate({ [rowData.date]: [] });
                      setSelectedSalahAndDate((prev) => ({
                        ...prev,
                        selectedDates: [rowData.date],
                      }));

                      // const testing = "2";
                      // if (e.target.offsetParent.ariaRowIndex === testing) {
                      //   alert("hello");
                      // }
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
                        setSelectedSalahAndDate((prev) => ({
                          ...prev,
                          selectedDates: [rowData.date],
                        }));
                        handleTableCellSelection(salahName);
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
                        setSelectedSalahAndDate((prev) => ({
                          ...prev,
                          selectedDates: [rowData.date],
                        }));
                        handleTableCellSelection(salahName);
                        // setShowUpdateStatusModal(true);
                        // setHasUserClickedDate(true);
                      }}
                    ></div>
                  );
                }}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
      {/* // ) : (
      //   <div>Loading Data...</div>
      // )} */}

      {/* <div className="flex flex-wrap" ref={modalSheetHiddenPrayerReasonsWrap}> */}

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
        setIsMultiEditMode={setIsMultiEditMode}
        isMultiEditMode={isMultiEditMode}
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
