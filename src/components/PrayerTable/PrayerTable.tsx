// @ts-nocheck
import React, { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import {
  DBConnectionStateType,
  SalahNamesType,
  selectedSalahAndDateType,
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

  // setReasonsArray: React.Dispatch<React.SetStateAction<string[]>>;
  // reasonsArray: string[];
  // userGender: string;
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
  console.log(
    "PRAYER TABLE COMPONENT HAS RENDERED, fetchedSalahData is: ",
    fetchedSalahData
  );

  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  // const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<selectedSalahAndDateType>({ "": [] });
  const [isMultiEditMode, setIsMultiEditMode] = useState<boolean>(false);

  console.log("selectedSalahAndDate ", selectedSalahAndDate);

  const rowGetter = ({ index }: any) => {
    return fetchedSalahData[index];
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

  // useEffect(() => {
  //   console.log(selectedSalahAndDate);
  // }, [selectedSalahAndDate]);

  const handleTableCellSelection = (
    date: string,
    salahName: SalahNamesType
  ) => {
    const selectedDatesArr = selectedSalahAndDate[date]
      ? selectedSalahAndDate[date]
      : [];
    setSelectedSalahAndDate({
      [date]: selectedDatesArr,
    });

    setSelectedSalahAndDate((prev) => {
      const updatedArr = selectedDatesArr.includes(salahName)
        ? selectedDatesArr.filter((salah) => salahName !== salah)
        : [...selectedDatesArr, salahName];

      return { ...prev, [date]: updatedArr };
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
                // TODO: Improve the alert below to something more native
                const dateArrLength =
                  Object.values(selectedSalahAndDate)[0].length;
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
                setSelectedSalahAndDate({});
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
            }}
            className="text-center"
            // rowCount={datesFromStartToToday.length}
            rowCount={fetchedSalahData.length}
            rowGetter={rowGetter}
            // rowGetter={({ index }) => fetchedSalahData[index]}
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
              cellRenderer={({ rowData }) => {
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
                    onClick={(e) => {
                      setIsMultiEditMode(true);
                      setSelectedSalahAndDate({ [rowData.date]: [] });
                      console.log(e.target.offsetParent.ariaRowIndex);
                      const testing = "2";
                      if (e.target.offsetParent.ariaRowIndex === testing) {
                        alert("hello");
                      }
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
                        handleTableCellSelection([rowData.date], salahName);
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
                        handleTableCellSelection([rowData.date], salahName);
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
        setSelectedSalahAndDate={setSelectedSalahAndDate}
        selectedSalahAndDate={selectedSalahAndDate}
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
