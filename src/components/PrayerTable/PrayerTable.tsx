import React, { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import {
  DBConnectionStateType,
  DBResultDataObjType,
  SalahNamesType,
  SelectedSalahAndDateArrayType,
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
    useState<SelectedSalahAndDateArrayType>([]);
  const [isMultiEditMode, setIsMultiEditMode] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<number | null>(null);
  const [selectedCells, setSelectedCells] = useState({});
  // const [toggleCheckbox, setToggleCheckbox] = useState<boolean>(false);

  // const rowGetter = ({ index }: any) => {
  //   return fetchedSalahData[index];
  // };

  const resetSelectedSalahAndDate = () => {
    setSelectedSalahAndDate([]);
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

  // console.log("isMultiEditMode: ", isMultiEditMode);

  // const handleCheckboxChange = () => {

  // }

  // useEffect(() => {
  //   console.log("selectedSalahAndDate: ", selectedSalahAndDate);
  // }, [selectedSalahAndDate]);

  const handleTableCellClick = (
    salahName: SalahNamesType,
    rowDataDate: string
  ) => {
    // console.log("rowDataDate: ", rowDataDate);

    // setToggleCheckbox((prev) => !prev);
    setSelectedSalahAndDate((prev) => {
      let newArr = [...prev];

      const findDateIndex = newArr.findIndex((obj) => rowDataDate in obj);

      if (findDateIndex > -1) {
        let dateArr = newArr[findDateIndex][rowDataDate];

        if (dateArr.includes(salahName)) {
          // const updatedArr = dateArr.filter((item) => item !== salahName);
          dateArr = dateArr.filter((item) => item !== salahName);
          // newArr[findDateIndex][rowDataDate] = dateArr;
          newArr[findDateIndex] = {
            ...newArr[findDateIndex],
            [rowDataDate]: dateArr,
          };
          if (dateArr.length === 0) {
            newArr = newArr.filter((obj) => {
              return !(rowDataDate in obj);
            });
          }
        } else {
          newArr[findDateIndex][rowDataDate].push(salahName);
        }
      } else {
        newArr.push({ [rowDataDate]: [salahName] });
      }
      return newArr;
    });
    // console.log("selectedSalahAndDate: ", selectedSalahAndDate);

    // setSelectedSalahAndDate((prev) => {
    //   return prev.selectedSalahs.includes(salahName)
    //     ? {
    //         ...prev,
    //         selectedSalahs: prev.selectedSalahs.filter(
    //           (salah) => salahName !== salah
    //         ),
    //       }
    //     : { ...prev, selectedSalahs: [...prev.selectedSalahs, salahName] };
    // });

    if (!isMultiEditMode) {
      setShowUpdateStatusModal(true);
    } else if (isMultiEditMode) {
    }
  };

  useEffect(() => {
    console.log("UPDATED CELLS STATE: ", selectedCells);
  }, [selectedCells]);

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
              cellRenderer={({
                rowData,
                rowIndex,
                columnData,
                columnIndex,
              }) => {
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
                            const dateArrLength = selectedSalahAndDate.length;
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
                cellRenderer={({ rowData, rowIndex, columnIndex }) => {
                  return (
                    <section
                      onClick={(e) => {
                        console.log("columnIndex: ", columnIndex);
                        console.log("rowIndex: ", rowIndex);

                        if (isMultiEditMode) return;
                        handleTableCellClick(salahName, rowData.date);
                      }}
                      // className="flex flex-col"
                    >
                      {rowData.salahs[salahName] === "" ? (
                        <LuDot
                          className={`w-[24px] h-[24px]`}
                          // onClick={() => {
                          //   handleTableCellClick(salahName, rowData);
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
                          className={`w-[24px] h-[24px] ${iconStyles} prayer-status-color-box`}
                          // onClick={() => {
                          //   console.log("SQUARE CLICKED");
                          //   handleTableCellClick(salahName, rowData);
                          // }}
                        ></div>
                      )}
                      {/* {isSelectedRow === rowIndex && ( */}
                      {isMultiEditMode && (
                        <div
                          // onClick={() => {
                          //   handleTableCellClick(salahName, rowData);
                          // }}
                          className={`checkbox-wrap ${
                            isSelectedRow === rowIndex
                              ? "checkbox--wrap-slide-in"
                              : ""
                          } `}
                        >
                          <label className="p-5">
                            <input
                              type="checkbox"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onChange={() => {
                                handleTableCellClick(salahName, rowData.date);
                                setSelectedCells((prev) => {
                                  // ! Continue from here
                                  // if (Object.keys(prev).length === 0) return {};
                                  for (let [key, value] of Object.entries(
                                    prev
                                  )) {
                                    console.log("key: ", key, "value: ", value);

                                    if (
                                      key === rowIndex &&
                                      value === columnIndex
                                    ) {
                                      console.log("OBJECT EXISTS");

                                      // ! Delete object
                                    } else {
                                      // ! Add object
                                      console.log("OBJECT DOES NOT EXIST");

                                      const obj = { [rowIndex]: columnIndex };
                                      return { ...prev, obj };
                                    }
                                  }
                                });
                              }}
                              // checked={toggleCheckbox}
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
