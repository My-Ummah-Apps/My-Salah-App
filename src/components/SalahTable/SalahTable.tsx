import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
import { motion, AnimatePresence } from "framer-motion";
import Joyride, { CallBackProps, Step } from "react-joyride";

import {
  DBConnectionStateType,
  PreferenceType,
  SalahNamesType,
  SalahByDateObjType,
  userPreferencesType,
} from "../../types/types";
import BottomSheetSalahStatus from "../BottomSheets/BottomSheetSalahStatus";

import { LuDot } from "react-icons/lu";
import { SalahRecordsArrayType } from "../../types/types";
import {
  createLocalisedDate,
  salahStatusColorsHexCodes,
  salahTableIndividualSquareStyles,
  salahNamesArr,
  showAlert,
} from "../../utils/constants";
import { TbEdit } from "react-icons/tb";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useEffect, useRef, useState } from "react";

interface SalahTableProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
  showJoyRideEditIcon: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  userPreferences: userPreferencesType;
  setSelectedSalahAndDate: React.Dispatch<
    React.SetStateAction<SalahByDateObjType>
  >;
  selectedSalahAndDate: SalahByDateObjType;
  setIsMultiEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMultiEditMode: boolean;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  showUpdateStatusModal: boolean;
  generateStreaks: (fetchedSalahData: SalahRecordsArrayType) => void;
}

const SalahTable = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  modifyDataInUserPreferencesTable,
  setShowJoyRideEditIcon,
  showJoyRideEditIcon,
  setFetchedSalahData,
  fetchedSalahData,
  userPreferences,
  setSelectedSalahAndDate,
  selectedSalahAndDate,
  setIsMultiEditMode,
  isMultiEditMode,
  setShowUpdateStatusModal,
  showUpdateStatusModal,
  generateStreaks,
}: SalahTableProps) => {
  const resetSelectedSalahAndDate = () => {
    setSelectedSalahAndDate({});
  };
  const [showBoxAnimation, setShowBoxAnimation] = useState(false);
  const clonedSelectedSalahAndDate = useRef<SalahByDateObjType>({});

  useEffect(() => {
    clonedSelectedSalahAndDate.current = { ...selectedSalahAndDate };
    console.log("selectedSalahAndDate: ", selectedSalahAndDate);
  }, [selectedSalahAndDate]);

  const handleTableCellClick = (
    salahName: SalahNamesType,
    rowDataDate: string
  ) => {
    setSelectedSalahAndDate((prev) => {
      let newArr = { ...prev };

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

  const handleJoyRideCompletion = async (data: CallBackProps) => {
    if (data.status === "ready") {
      setShowJoyRideEditIcon(false);
      await modifyDataInUserPreferencesTable("isExistingUser", "1");
    }
  };

  return (
    <section className="salah-table-wrap h-[80vh]">
      <Joyride
        disableOverlay={false}
        disableOverlayClose={true}
        run={showJoyRideEditIcon}
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
      <AnimatePresence>
        {isMultiEditMode && (
          <motion.section
            initial={{ x: "-50%", y: "100%", scale: 0.5, opacity: 0 }}
            animate={{ y: "-25vh", scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.5, opacity: 0 }}
            // transition={{ type: "ease-out" }}
            className="absolute bottom-0 z-10 flex p-3 shadow-2xl text-sm text-white border border-stone-700 transform -translate-x-1/2 rounded-2xl bg-[#232323] left-1/2"
          >
            <button
              className="text-white"
              onClick={() => {
                setIsMultiEditMode(false);
                resetSelectedSalahAndDate();
              }}
            >
              <p className="pl-1 pr-2">Cancel</p>
            </button>
            <button
              // border-l border-[#adadad]
              className="text-white"
              onClick={() => {
                const dateArrLength = Object.keys(selectedSalahAndDate).length;
                dateArrLength > 0
                  ? setShowUpdateStatusModal(true)
                  : showAlert(
                      "No Salah Selected",
                      "Please select atleast one Salah"
                    );
              }}
            >
              <p className="pl-2 pr-1">Edit</p>
            </button>
          </motion.section>
        )}
      </AnimatePresence>
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
                              salahName === "Asar" && showJoyRideEditIcon
                                ? "white"
                                : "",
                          }}
                          className={`${salahTableIndividualSquareStyles} ${
                            showJoyRideEditIcon && salahName === "Asar"
                              ? "single-table-cell"
                              : ""
                          } ${
                            showJoyRideEditIcon && salahName === "Asar"
                              ? "animate-bounce"
                              : ""
                          }`}
                        />
                      ) : (
                        <motion.div
                          // key={`${i}-${rowData.date}`}
                          initial={{ scale: 1 }}
                          {...(showBoxAnimation &&
                          clonedSelectedSalahAndDate.current[
                            rowData.date
                          ]?.includes(salahName)
                            ? {
                                animate: { scale: [0, 1.3, 1] },
                                transition: {
                                  duration: 0.5,
                                  ease: "easeInOut",
                                },
                              }
                            : {})}
                          onAnimationComplete={() => {
                            setShowBoxAnimation(false);
                            clonedSelectedSalahAndDate.current = {};
                          }}
                          style={{
                            backgroundColor:
                              salahStatusColorsHexCodes[
                                rowData.salahs[
                                  salahName
                                ] as keyof typeof salahStatusColorsHexCodes
                              ],
                          }}
                          className={`${salahTableIndividualSquareStyles} salah-status-color-box`}
                        ></motion.div>
                      )}
                      <AnimatePresence>
                        {isMultiEditMode && (
                          <motion.div
                            className={`checkbox-wrap`}
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                          >
                            <label className="p-5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  handleTableCellClick(salahName, rowData.date);
                                }}
                              ></input>
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  );
                }}
              />
            ))}
          </Table>
        )}
      </AutoSizer>

      <BottomSheetSalahStatus
        checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
        setFetchedSalahData={setFetchedSalahData}
        fetchedSalahData={fetchedSalahData}
        userPreferences={userPreferences}
        setShowBoxAnimation={setShowBoxAnimation}
        selectedSalahAndDate={selectedSalahAndDate}
        resetSelectedSalahAndDate={resetSelectedSalahAndDate}
        setIsMultiEditMode={setIsMultiEditMode}
        isMultiEditMode={isMultiEditMode}
        dbConnection={dbConnection}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        showUpdateStatusModal={showUpdateStatusModal}
        generateStreaks={generateStreaks}
      />
    </section>
  );
};

export default SalahTable;
