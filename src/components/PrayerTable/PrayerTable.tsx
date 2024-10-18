import React, { useState } from "react";
import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
AutoSizer;
import { DBConnectionStateType, userPreferencesType } from "../../types/types";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArrayType } from "../../types/types";
import { prayerStatusColorsHexCodes } from "../../utils/prayerStatusColors";
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
  setUserPreferences,
  userPreferences,
}: PrayerTableProps) => {
  console.log("Prayer Table Has Re-rendered");

  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  // const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const [clickedDate, setClickedDate] = useState<string>("");
  const [clickedSalah, setClickedSalah] = useState<string>("");

  const rowGetter = ({ index }: any) => {
    // console.log("fetchedSalahData in rowGetter: ", fetchedSalahData[index]);
    return fetchedSalahData[index];
  };

  const iconStyles =
    "inline-block rounded-md text-white w-[24px] h-[24px] shadow-md";

  const salahNamesArr = ["Fajr", "Dhuhr", "Asar", "Maghrib", "Isha"];

  return (
    <section className="relative">
      {/* {renderTable === true ? ( */}
      <Table
        style={{
          textTransform: "none",
        }}
        className="text-center"
        // rowCount={datesFromStartToToday.length}
        rowCount={fetchedSalahData.length}
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
          cellRenderer={({ rowData }) => {
            const parsedDate = parse(rowData.date, "yyyy-MM-dd", new Date());
            // const formattedParsedDate = format(parsedDate, "dd.MM.yy");
            // const formattedParsedDate = new Date(rowData.date);
            const userLocale = navigator.language || "en-US";

            const formattedParsedDate = new Intl.DateTimeFormat(userLocale, {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })
              .format(parsedDate)
              .replace(/\//g, ".");
            const day = format(parsedDate, "EE");
            return (
              <section>
                <p>{formattedParsedDate}</p>
                <p>{day}</p>
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
                    setShowUpdateStatusModal(true);
                    setClickedDate(rowData.date);
                    setClickedSalah(salahName);
                    // setHasUserClickedDate(true);
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
                    // setHasUserClickedDate(true);
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

      <PrayerStatusBottomSheet
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        setFetchedSalahData={setFetchedSalahData}
        fetchedSalahData={fetchedSalahData}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        setClickedDate={setClickedDate}
        clickedDate={clickedDate}
        setClickedSalah={setClickedSalah}
        clickedSalah={clickedSalah}
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
