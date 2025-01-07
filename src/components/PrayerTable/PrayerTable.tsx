import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
import Joyride, { Step } from "react-joyride";
AutoSizer;
import {
  DBConnectionStateType,
  MissedSalahObjType,
  PreferenceType,
  SalahNamesType,
  SelectedSalahAndDateObjType,
  userPreferencesType,
} from "../../types/types";
import BottomSheetPrayerStatus from "../BottomSheets/BottomSheetPrayerStatus";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArrayType } from "../../types/types";
import {
  createLocalisedDate,
  prayerStatusColorsHexCodes,
  prayerTableIndividualSquareStyles,
  salahNamesArr,
} from "../../utils/constants";
import { TbEdit } from "react-icons/tb";

// import StreakCount from "../Stats/StreakCount";

interface PrayerTableProps {
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
  showJoyRideEditIcon: boolean;
  renderTable: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  setMissedSalahList: React.Dispatch<React.SetStateAction<MissedSalahObjType>>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setSelectedSalahAndDate: React.Dispatch<
    React.SetStateAction<SelectedSalahAndDateObjType>
  >;
  selectedSalahAndDate: SelectedSalahAndDateObjType;
  setIsMultiEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMultiEditMode: boolean;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  showUpdateStatusModal: boolean;
}

const PrayerTable = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  modifyDataInUserPreferencesTable,
  setShowJoyRideEditIcon,
  showJoyRideEditIcon,
  setFetchedSalahData,
  fetchedSalahData,
  setUserPreferences,
  userPreferences,
  setMissedSalahList,
  setSelectedSalahAndDate,
  selectedSalahAndDate,
  setIsMultiEditMode,
  isMultiEditMode,
  setShowUpdateStatusModal,
  showUpdateStatusModal,
}: PrayerTableProps) => {
  // const modalSheetPrayerStatusesWrap = useRef<HTMLDivElement>(null);

  const resetSelectedSalahAndDate = () => {
    setSelectedSalahAndDate({});
  };

  const handleTableCellClick = (
    salahName: SalahNamesType,
    rowDataDate: string
  ) => {
    // setToggleCheckbox((prev) => !prev);
    setSelectedSalahAndDate((prev) => {
      let newArr = { ...prev };

      // if (prev[rowDataDate] && prev[rowDataDate].includes(salahName)) {
      if (prev[rowDataDate]?.includes(salahName)) {
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

  const joyRideonBoardingSteps: Step[] = [
    {
      target: ".multi-edit-icon",
      content:
        "Tap this icon to edit multiple Salah entries across different dates at once (provided they share the same status, reasons, and notes).",
      disableBeacon: true,
    },

    {
      target: ".single-table-cell",
      // target: "",
      content:
        "Alternatively, you can update a Salah individually by tapping on a specific cell.",
      disableBeacon: true,
      placement: "center",
    },
  ];

  const handleJoyRideCompletion = async (data: any) => {
    if (data.status === "ready") {
      console.log("TOUR COMPLETE!");
      setShowJoyRideEditIcon(false);
      await modifyDataInUserPreferencesTable("isExistingUser", "1");
    }
  };

  return (
    <section className="prayer-table-wrap h-[80vh]">
      <Joyride
        disableOverlay={true}
        run={showJoyRideEditIcon}
        // run={userPreferences.isExistingUser === "0"}
        locale={{
          last: "Done",
          next: "Next",
          back: "Back",
        }}
        steps={joyRideonBoardingSteps}
        continuous
        disableScrolling={true}
        hideCloseButton={true}
        callback={handleJoyRideCompletion}
        styles={{
          options: {
            backgroundColor: "#27272a",
            arrowColor: "#27272a",
            textColor: "#fff",
            zIndex: 10000,
          },
          buttonNext: {
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 12px",
          },
          buttonBack: {
            backgroundColor: "#f44336",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 12px",
          },
        }}
      />

      {isMultiEditMode && (
        <section className="absolute z-10 flex p-3 text-sm text-white transform -translate-x-1/2 bg-gray-700 rounded-full prayer-table-edit-cancel-btn-wrap top-3/4 left-1/2">
          <button
            className="px-2 text-white"
            onClick={() => {
              setIsMultiEditMode(false);
              resetSelectedSalahAndDate();
            }}
          >
            Cancel
          </button>
          <button
            className="px-2  text-white border-l border-[#adadad]"
            onClick={() => {
              // TODO: Improve the alert below to something more native
              const dateArrLength = Object.keys(selectedSalahAndDate).length;
              dateArrLength > 0
                ? setShowUpdateStatusModal(true)
                : alert("Please select atleast one Salah");
            }}
          >
            Edit
          </button>
        </section>
      )}
      <AutoSizer>
        {({ height, width }) => (
          <Table
            style={{
              textTransform: "none",
              fontSize: "3rem",
            }}
            className="text-center"
            rowCount={fetchedSalahData.length}
            rowGetter={({ index }) => fetchedSalahData[index]}
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
              headerRenderer={() => (
                <div
                  onClick={() => {
                    if (isMultiEditMode) return;
                    setIsMultiEditMode(true);
                  }}
                  className={`flex items-center justify-center text-lg text-white multi-edit-icon`}
                >
                  <TbEdit />

                  {/* <svg
                    className=""
                    width="20px"
                    height="20px"
                    viewBox="0 0 23 23"
                    id="meteor-icon-kit__solid-bulk-edit"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 10H20C21.6569 10 23 11.3431 23 13V20C23 21.6569 21.6569 23 20 23H13C11.3431 23 10 21.6569 10 20V13C10 11.3431 11.3431 10 13 10ZM18 8H13C10.2386 8 8 10.2386 8 13V18C6.34315 18 5 16.6569 5 15V8C5 6.34315 6.34315 5 8 5H15C16.6569 5 18 6.34315 18 8ZM13 3H8C5.23858 3 3 5.23858 3 8V13C1.34315 13 0 11.6569 0 10V3C0 1.34315 1.34315 0 3 0H10C11.6569 0 13 1.34315 13 3Z"
                        fill="rgb(184, 184, 184)"
                      />
                    </g>
                  </svg> */}
                </div>
              )}
              cellRenderer={({ rowData }) => {
                const [day, formattedParsedDate] = createLocalisedDate(
                  rowData.date
                );

                return (
                  <section>
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
                cellRenderer={({ rowData }) => {
                  let isChecked = selectedSalahAndDate[rowData.date]?.includes(
                    salahName
                  )
                    ? true
                    : false;

                  return (
                    <section
                      onClick={() => {
                        if (isMultiEditMode) return;
                        handleTableCellClick(salahName, rowData.date);
                      }}
                    >
                      {rowData.salahs[salahName] === "" ? (
                        <LuDot
                          style={{
                            backgroundColor:
                              salahName === "Asar" &&
                              userPreferences.isExistingUser === "0"
                                ? "white"
                                : "",
                          }}
                          className={`${prayerTableIndividualSquareStyles} ${
                            userPreferences.isExistingUser &&
                            salahName === "Asar"
                              ? "single-table-cell"
                              : ""
                          } ${
                            userPreferences.isExistingUser === "0" &&
                            salahName === "Asar"
                              ? "animate-bounce"
                              : ""
                          }`}
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
                          className={`${prayerTableIndividualSquareStyles} prayer-status-color-box`}
                        ></div>
                      )}

                      {isMultiEditMode && (
                        <div className={`checkbox-wrap`}>
                          <label className="p-5">
                            <input
                              type="checkbox"
                              checked={isChecked}
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

      <BottomSheetPrayerStatus
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        setFetchedSalahData={setFetchedSalahData}
        fetchedSalahData={fetchedSalahData}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        setMissedSalahList={setMissedSalahList}
        selectedSalahAndDate={selectedSalahAndDate}
        resetSelectedSalahAndDate={resetSelectedSalahAndDate}
        setIsMultiEditMode={setIsMultiEditMode}
        isMultiEditMode={isMultiEditMode}
        dbConnection={dbConnection}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        showUpdateStatusModal={showUpdateStatusModal}
      />
    </section>
  );
};

export default PrayerTable;
