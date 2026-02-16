import "react-virtualized/styles.css";
import { Column, Table, AutoSizer } from "react-virtualized";
import { motion, AnimatePresence } from "framer-motion";
import Joyride, { CallBackProps, Step } from "react-joyride";

import {
  SalahNamesType,
  SalahByDateObjType,
  userPreferencesType,
} from "../../types/types";
import BottomSheetSalahStatus from "../BottomSheets/BottomSheetSalahStatus";

import { LuDot } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import { SalahRecordsArrayType } from "../../types/types";
import {
  salahStatusColorsHexCodes,
  salahNamesArr,
} from "../../utils/constants";
// import { TbEdit } from "react-icons/tb";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useEffect, useRef, useState } from "react";
import {
  createLocalisedDate,
  salahTableIndividualSquareStyles,
  showAlert,
  // updateUserPrefs,
} from "../../utils/helpers";
import { IonButton } from "@ionic/react";

interface SalahTableProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  // setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
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
  // setUserPreferences,
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
  const [multiEditIconAnimation, setMultiEditIconAnimation] = useState(true);

  useEffect(() => {
    clonedSelectedSalahAndDate.current = { ...selectedSalahAndDate };
  }, [selectedSalahAndDate]);

  const handleTableCellClick = (
    salahName: SalahNamesType,
    rowDataDate: string,
  ) => {
    setSelectedSalahAndDate((prev) => {
      let newArr = { ...prev };

      if (prev[rowDataDate]?.includes(salahName)) {
        newArr[rowDataDate] = prev[rowDataDate].filter(
          (item) => item !== salahName,
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
      content:
        "Alternatively, you can update a Salah individually by tapping on a specific cell.",
      disableBeacon: true,
      placement: "center",
    },
  ];

  const handleJoyRide = async (data: CallBackProps) => {
    console.log("handleJoyRide HAS RUN");

    console.log("IS EXISTING USER SET TO 1");

    if (data.action === "next") {
      console.log("TURNING OFF ANIMATION");
      setMultiEditIconAnimation(false);
    }

    // await updateUserPrefs(
    //   dbConnection,
    //   "isExistingUser",
    //   "1",
    //   setUserPreferences,
    // );

    // if (data.action === "prev") {
    //   setMultiEditIconAnimation(true);
    // }

    if (data.status === "ready") {
      // console.log("JOYRIDE COMPLETE");

      setShowJoyRideEditIcon(false);

      // console.log("EXISTING USER FLAG CHANGED TO 1 IN DB");
    }
  };

  return (
    <section className="salah-table-wrap hide-scrollbar">
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
        callback={handleJoyRide}
        styles={{
          options: {
            backgroundColor: "#27272a",
            arrowColor: "#ffffff",
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
            animate={{ y: "-15vh", scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.5, opacity: 0 }}
            // transition={{ type: "ease-out" }}
            className="absolute bottom-0 z-10 flex shadow-2xl text-sm text-white border border-stone-500 transform -translate-x-1/2 rounded-2xl bg-[#414141] left-1/2"
          >
            <button
              className="py-4 pl-4 pr-2 mr-1 text-white"
              onClick={() => {
                setIsMultiEditMode(false);
                resetSelectedSalahAndDate();
              }}
            >
              <p className="">Cancel</p>
            </button>
            <button
              className="p-2 py-4 pr-4 text-white"
              onClick={() => {
                const dateArrLength = Object.keys(selectedSalahAndDate).length;
                dateArrLength > 0
                  ? setShowUpdateStatusModal(true)
                  : showAlert(
                      "No Salah Selected",
                      "Please select atleast one Salah",
                    );
              }}
            >
              <p className="">Edit</p>
            </button>
          </motion.section>
        )}
      </AnimatePresence>
      <div className="h-[95%]">
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
                // className="items-center text-left"
                className="text-left"
                label=""
                dataKey="date"
                headerRenderer={() => (
                  <IonButton
                    fill="clear"
                    size="large"
                    onClick={() => {
                      if (isMultiEditMode) return;
                      setIsMultiEditMode(true);
                    }}
                    // className={`flex items-center justify-center`}
                  >
                    {/* <IonIcon
                      className={`multi-edit-icon text-[var(--ion-text-color)] ${
                        showJoyRideEditIcon && multiEditIconAnimation
                          ? "animate-bounce"
                          : ""
                      }`}
                      size="small"
                      icon={createOutline}
                    /> */}

                    <TbEdit
                      className={`multi-edit-icon text-[var(--ion-text-color)] text-lg ${
                        showJoyRideEditIcon && multiEditIconAnimation
                          ? "animate-bounce"
                          : ""
                      }`}
                    />
                  </IonButton>
                )}
                cellRenderer={({ rowData }) => {
                  const [day, formattedParsedDate] = createLocalisedDate(
                    rowData.date,
                  );

                  return (
                    <section className="">
                      <p className="text-sm">{formattedParsedDate}</p>
                      <p className="text-sm">{day}</p>
                    </section>
                  );
                }}
                width={180}
                flexGrow={1}
              />
              {salahNamesArr.map((salahName) => (
                <Column
                  key={salahName}
                  style={{ marginLeft: "0" }}
                  className="items-center text-sm"
                  label={salahName === "Asar" ? "Asr" : salahName}
                  dataKey={""}
                  width={120}
                  flexGrow={1}
                  cellRenderer={({ rowData }) => {
                    let isChecked = selectedSalahAndDate[
                      rowData.date
                    ]?.includes(salahName)
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
                              color: "var(--table-dot-icon-color)",
                              backgroundColor:
                                salahName === "Asar" && showJoyRideEditIcon
                                  ? "white"
                                  : "",
                            }}
                            className={`${salahTableIndividualSquareStyles} ${
                              showJoyRideEditIcon && salahName === "Asar"
                                ? "single-table-cell animate-bounce"
                                : ""
                            } 
                                `}
                            // ${
                            //   showJoyRideEditIcon && salahName === "Asar"
                            //     ? "animate-bounce"
                            //     : ""
                            // }
                          />
                        ) : (
                          <AnimatePresence>
                            <motion.div
                              // key={`${i}-${rowData.date}`}
                              {...(showBoxAnimation &&
                              clonedSelectedSalahAndDate.current[
                                rowData.date
                              ]?.includes(salahName)
                                ? {
                                    initial: { scale: 0 },
                                    // animate: { scale: [1.3, 1] },
                                    animate: { scale: 1.3 },
                                    transition: {
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 10,
                                      mass: 1,
                                      delay: 0.3,
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
                              className={`${salahTableIndividualSquareStyles}`}
                            ></motion.div>
                          </AnimatePresence>
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
                                    handleTableCellClick(
                                      salahName,
                                      rowData.date,
                                    );
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
      </div>
      <BottomSheetSalahStatus
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
