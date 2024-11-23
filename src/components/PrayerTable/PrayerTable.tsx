import React, { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import {
  DBConnectionStateType,
  DBResultDataObjType,
  SalahNamesType,
  SelectedSalahAndDateObjType,
  userPreferencesType,
} from "../../types/types";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArrayType } from "../../types/types";
import {
  createLocalisedDate,
  prayerStatusColorsHexCodes,
} from "../../utils/constants";

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
    useState<SelectedSalahAndDateObjType>({});
  const [isMultiEditMode, setIsMultiEditMode] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<number | null>(null);
  // const [selectedCells, setSelectedCells] = useState({});
  // const [toggleCheckbox, setToggleCheckbox] = useState<boolean>(false);

  // const rowGetter = ({ index }: any) => {
  //   return fetchedSalahData[index];
  // };

  const resetSelectedSalahAndDate = () => {
    setSelectedSalahAndDate({});
  };

  const resetSelectedRow = () => {
    setIsSelectedRow(null);
  };

  const iconStyles = "rounded-md text-white w-[24px] h-[24px] shadow-md";

  const salahNamesArr: SalahNamesType[] = [
    "Fajr",
    "Dhuhr",
    "Asar",
    "Maghrib",
    "Isha",
  ];

  useEffect(() => {
    console.log("selectedSalahAndDate: ", selectedSalahAndDate);
  }, [selectedSalahAndDate]);

  const handleTableCellClick = (
    salahName: SalahNamesType,
    rowDataDate: string
  ) => {
    // setToggleCheckbox((prev) => !prev);
    setSelectedSalahAndDate((prev) => {
      let newArr = { ...prev };

      if (prev[rowDataDate] && prev[rowDataDate].includes(salahName)) {
        newArr[rowDataDate] = prev[rowDataDate].filter(
          (item) => item !== salahName
        );

        if (newArr[rowDataDate].length === 0) {
          delete newArr[rowDataDate];
        }
      } else {
        newArr[rowDataDate] = prev[rowDataDate]
          ? [...prev[rowDataDate], salahName]
          : [salahName];
      }
      return newArr;
    });

    if (!isMultiEditMode) {
      setShowUpdateStatusModal(true);
    } else if (isMultiEditMode) {
    }
  };

  return (
    <section className="prayer-table-wrap h-[80vh]">
      {/* {isMultiEditMode && (
        <section className="">
          <section className="absolute text-sm text-right text-white">
            <button
              className="px-2 py-1.5 m-1 text-sm font-medium text-teal-800 bg-teal-200 rounded-lg"
              onClick={() => {
                setIsMultiEditMode(false);
                resetSelectedRow();
                resetSelectedSalahAndDate();
              }}
            >
              Cancel
            </button>
            <button
              className="px-2 py-1.5 m-1 text-sm font-medium text-white bg-teal-600 rounded-lg"
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
          </section>
        </section>
      )} */}

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
              if (!isMultiEditMode) {
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
              className="items-center text-left "
              label=""
              dataKey="date"
              cellRenderer={({ rowData, rowIndex }) => {
                const [day, formattedParsedDate] = createLocalisedDate(
                  rowData.date
                );
                // console.log("columnData: ", rowData);
                // console.log("columnIndex: ", columnIndex);

                // const parsedDate = parse(
                //   rowData.date,
                //   "yyyy-MM-dd",
                //   new Date()
                // );
                // const userLocale = navigator.language || "en-US";
                // const formattedParsedDate = new Intl.DateTimeFormat(
                //   userLocale,
                //   {
                //     year: "2-digit",
                //     month: "2-digit",
                //     day: "2-digit",
                //   }
                // )
                //   .format(parsedDate)
                //   .replace(/\//g, ".");
                // const day = format(parsedDate, "EE");
                return (
                  <section
                    className=""
                    onClick={() => {
                      if (isMultiEditMode) return;
                      setIsSelectedRow(rowIndex);
                      setIsMultiEditMode(true);
                      // setSelectedSalahAndDate((prev) => ({
                      //   ...prev,
                      //   selectedDates: [rowData.date],
                      // }));
                    }}
                  >
                    <p className="text-sm">{formattedParsedDate}</p>
                    <p className="text-sm">{day}</p>
                    {isMultiEditMode && (
                      <section className="fixed text-sm text-white top-[-2px] right-1">
                        <button
                          className="px-2 py-1.5 m-1 text-xs font-medium text-sky-900  bg-sky-400 rounded-md"
                          onClick={() => {
                            setIsMultiEditMode(false);
                            resetSelectedRow();
                            resetSelectedSalahAndDate();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-2 py-1.5 m-1 text-xs text-white bg-sky-700 rounded-md"
                          onClick={() => {
                            // TODO: Improve the alert below to something more native
                            const dateArrLength =
                              Object.keys(selectedSalahAndDate).length;
                            dateArrLength > 0
                              ? setShowUpdateStatusModal(true)
                              : alert("Please select atleast one Salah");
                          }}
                        >
                          Edit
                        </button>
                      </section>
                    )}
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
                  let isChecked =
                    selectedSalahAndDate[rowData.date]?.includes(salahName);

                  return (
                    <section
                      onClick={() => {
                        if (isMultiEditMode) return;
                        handleTableCellClick(salahName, rowData.date);
                      }}
                    >
                      {rowData.salahs[salahName] === "" ? (
                        <LuDot className={`w-[24px] h-[24px]`} />
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
                          className={`w-[24px] h-[24px] ${iconStyles} prayer-status-color-box`}
                        ></div>
                      )}

                      {isMultiEditMode && (
                        <div
                          className={`checkbox-wrap ${
                            isSelectedRow === rowIndex
                              ? "checkbox--wrap-slide-in"
                              : ""
                          } `}
                        >
                          <label className="p-5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onChange={() => {
                                handleTableCellClick(salahName, rowData.date);
                              }}
                            ></input>
                          </label>
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
