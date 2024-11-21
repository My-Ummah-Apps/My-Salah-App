import Sheet from "react-modal-sheet";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { PiFlower } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import {
  DBResultDataObjType,
  SalahNamesType,
  SalahRecordsArrayType,
  SalahRecordType,
  SelectedSalahAndDateObjType,
  userPreferencesType,
} from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import {
  createLocalisedDate,
  // createLocalisedDate,
  prayerStatusColorsHexCodes,
  reasonsStyles,
  TWEEN_CONFIG,
} from "../../utils/constants";
import { sheetHeaderHeight } from "../../utils/constants";

interface PrayerStatusBottomSheetProps {
  dbConnection: any;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  handleSalahTrackingDataFromDB: (
    DBResultAllSalahData: DBResultDataObjType[]
  ) => Promise<void>;
  showUpdateStatusModal: boolean;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetSelectedRow: () => void;
  selectedSalahAndDate: SelectedSalahAndDateObjType;
  resetSelectedSalahAndDate: () => void;
  setIsMultiEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMultiEditMode: boolean;
}

const PrayerStatusBottomSheet = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setFetchedSalahData,
  fetchedSalahData,
  selectedSalahAndDate,
  resetSelectedRow,
  resetSelectedSalahAndDate,
  setIsMultiEditMode,
  isMultiEditMode,
  setUserPreferences,
  userPreferences,
  showUpdateStatusModal,
  setShowUpdateStatusModal,
}: PrayerStatusBottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const modalSheetPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  const modalSheetHiddenPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  const notesTextArea = useRef<HTMLTextAreaElement | null>(null);
  const [salahStatus, setSalahStatus] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");
  const handleCustomReason = (e: any) => {
    setCustomReason(e.target.value);
  };
  const [notes, setNotes] = useState("");
  const handleNotes = (e: any) => {
    setNotes(e.target.value);
  };
  const [showAddCustomReasonInputBox, setShowAddCustomReasonInputBox] =
    useState(false);

  let selectedReasonsArray = selectedReasons;

  useEffect(() => {
    if (notesTextArea.current) {
      notesTextArea.current.style.height = "1px";
      notesTextArea.current.style.height = `${
        notesTextArea.current.scrollHeight + 0.5
      }px`;
    } else {
      console.log("notesTextArea.current does not exist");
    }
  });

  const increaseTextAreaHeight = (e: any) => {
    if (notesTextArea.current) {
      // notesTextArea.current.style.height = "auto";
      notesTextArea.current.style.height = `${e.target.scrollHeight}px`;
    } else {
      console.error("notesTextArea.current does not exist");
    }
  };

  const resetStatusReasonsNotes = () => {
    setSalahStatus("");
    setSelectedReasons([]);
    setNotes("");
  };

  // const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";

  const doesSalahAndDateExists = async (): Promise<boolean> => {
    const selectedDate = Object.keys(selectedSalahAndDate).toString();
    const selectedSalah = Object.values(selectedSalahAndDate).toString();

    console.log("SELECTED DATE AND SALAH: ", selectedDate, selectedSalah);

    try {
      await checkAndOpenOrCloseDBConnection("open");

      const res = await dbConnection.current.query(
        `SELECT * FROM salahDataTable 
      WHERE date = ? AND salahName = ?;`,
        [selectedDate, selectedSalah]
      );

      if (res && res.values && res.values.length === 0) {
        return false;
      } else if (res && res.values && res.values.length > 0) {
        setSalahStatus(res.values[0].salahStatus);
        setNotes(res.values[0].notes);
        setSelectedReasons(res.values[0].reasons.split(", "));
        return true;
      }
    } catch (error) {
      console.error(error);
    } finally {
      try {
        // TODO: Below is stopping the database from being updated so have commented it out for now, this needs to be debugged
        // await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }

    return false;
  };

  const checkDBForSalah = async () => {
    // TODO: Place the below conditional statement in the onOpenStart prop on the sheet
    if (isMultiEditMode) return;
    try {
      await doesSalahAndDateExists();
    } catch (error) {
      console.error(error);
    }
  };

  const addOrModifySalah = async () => {
    const salahDataToInsertIntoDB = [];

    try {
      await checkAndOpenOrCloseDBConnection("open");

      const reasonsToInsert =
        selectedReasons.length > 0 ? selectedReasons.join(", ") : "";

      for (let [key, value] of Object.entries(selectedSalahAndDate)) {
        console.log("KEY, VALUE: ", key, value);

        const date = key;
        const salahArr = value;

        for (let i = 0; i < salahArr.length; i++) {
          salahDataToInsertIntoDB.push([
            date,
            salahArr[i],
            salahStatus,
            reasonsToInsert,
            notes,
          ]);
        }
      }
      console.log("salahDataToInsertIntoDB: ", salahDataToInsertIntoDB);

      let query = `INSERT OR REPLACE INTO salahDataTable(date, salahName, salahStatus, reasons, notes`;
      // TODO: See if below can be refactored
      const salahDBValuesSubArr = salahDataToInsertIntoDB[0];
      console.log("salahDBValuesSubArr: ", salahDBValuesSubArr);

      const placeholder = salahDBValuesSubArr.map(() => "?").join(", ");
      console.log("PLACEHOLDER: ", placeholder);

      const placeholders = salahDataToInsertIntoDB
        .map(() => `(${placeholder})`)
        .join(",");

      query += `) VALUES ${placeholders}`;
      const flattenedSalahDBValues = salahDataToInsertIntoDB.flat();
      console.log("DATA BEING INSERTED INTO DB: ", flattenedSalahDBValues);

      await dbConnection.current.run(query, flattenedSalahDBValues);

      fetchedSalahData.forEach((item: SalahRecordType) => {
        const dateFromAlreadyFetchedSalahData = item.date;
        const salahsFromAlreadyFetchedSalahData = Object.keys(item.salahs);
        console.log("ITEM: ", item);
        // ! CONTINUE FROM HERE
        if (
          selectedSalahAndDate[item.date] &&
          selectedSalahAndDate[item.date].includes(
            salahsFromAlreadyFetchedSalahData
          )
        ) {
        }

        // selectedSalahAndDate.some((obj) => {
        //   const dateFromSelectedSalahAndDate = Object.keys(obj)[0];

        //   if (
        //     dateFromSelectedSalahAndDate === dateFromAlreadyFetchedSalahData
        //   ) {
        //     const selectedSalahsFromSelectedSalahAndDate =
        //       Object.values(obj).flat();

        //     salahsFromAlreadyFetchedSalahData.forEach((element) => {
        //       if (selectedSalahsFromSelectedSalahAndDate.includes(element)) {
        //         item.salahs[element] = salahStatus;
        //       }
        //     });
        //   }
        // });
      });

      setFetchedSalahData((prev) => [...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    // console.log(modalSheetPrayerReasonsWrap.current);
    // console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
    if (
      modalSheetPrayerReasonsWrap.current &&
      modalSheetHiddenPrayerReasonsWrap.current
    ) {
      // console.log(modalSheetPrayerReasonsWrap.current);
      // console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
      if (
        salahStatus === "male-alone" ||
        salahStatus === "late" ||
        salahStatus === "missed"
      ) {
        modalSheetPrayerReasonsWrap.current.style.maxHeight =
          modalSheetHiddenPrayerReasonsWrap.current.offsetHeight + "px";
        modalSheetPrayerReasonsWrap.current.style.opacity = "1";
      } else {
        modalSheetPrayerReasonsWrap.current.style.maxHeight = "0";
      }
    }
  }, [showUpdateStatusModal, salahStatus]);

  if (Capacitor.getPlatform() === "ios") {
    Keyboard.setResizeMode({
      mode: KeyboardResize.None,
    });

    window.addEventListener("keyboardWillShow", (e) => {
      if (sheetRef.current) {
        let height = (e as any).keyboardHeight;
        sheetRef.current.style.setProperty(
          "margin-bottom",
          height + "px",
          "important"
        );
      }
    });
    window.addEventListener("keyboardWillHide", (e) => {
      e;

      if (sheetRef.current) {
        sheetRef.current.style.setProperty(
          "margin-bottom",
          0 + "px",
          "important"
        );
      }
    });
  }

  const onSheetClose = () => {
    setShowUpdateStatusModal(false);
    resetSelectedSalahAndDate();
    resetStatusReasonsNotes();

    if (isMultiEditMode === true) {
      setIsMultiEditMode(false);
      resetSelectedRow();
    }
  };

  return (
    <>
      <Sheet
        // rootId="root"
        disableDrag={false}
        onOpenStart={checkDBForSalah}
        isOpen={showUpdateStatusModal}
        onClose={onSheetClose}
        detent="content-height"
        // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
        tweenConfig={TWEEN_CONFIG}
      >
        <Sheet.Container
          // className="react-modal-sheet-container"
          ref={sheetRef}
          style={{ backgroundColor: "rgb(33, 36, 38)" }}
        >
          <Sheet.Header style={sheetHeaderHeight} />
          <Sheet.Content>
            <Sheet.Scroller>
              {" "}
              <section className="w-[90%] mx-auto mb-20 rounded-lg text-white">
                <h1 className="mb-10 text-3xl font-light text-center">
                  {/* How did you pray {clickedSalah}? */}
                  How did you pray{" "}
                  {/* {selectedSalahAndDate.selectedSalahs.join(", ")} on {""}
                  {selectedSalahAndDate.selectedDates.length > 0
                    ? createLocalisedDate(
                        selectedSalahAndDate.selectedDates[0]
                      )[1]
                    : null} */}
                  ?
                </h1>
                <div
                  // ref={modalSheetPrayerStatusesWrap}
                  className={`grid grid-cols-4 grid-rows-1 gap-2 text-xs modal-sheet-prayer-statuses-wrap `}
                >
                  {userPreferences.userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("group");
                          // setShowReasons(false);
                          setSelectedReasons([]);
                          // setNotes("");
                          // setReasonsArray([]);
                        }}
                        style={{
                          backgroundColor: prayerStatusColorsHexCodes.group,
                        }}
                        className={`${
                          salahStatus === "group" ? "border border-white" : ""
                        } px-5 py-3 icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        {" "}
                        <GoPeople className="w-full mb-1 text-3xl" />
                        <p className="inline"> In Jamaah</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("female-alone");
                          // setShowReasons(false);
                          // setReasonsArray([]);
                        }}
                        style={{
                          backgroundColor:
                            prayerStatusColorsHexCodes["female-alone"],
                        }}
                        className={`${
                          salahStatus === "female-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3 icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        {" "}
                        <GoPerson className="w-full mb-1 text-3xl" />
                        <p className="inline">Prayed</p>
                      </div>
                    </>
                  )}
                  {userPreferences.userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("male-alone");
                          // setShowReasons(true);
                          // setReasonsArray(reasonsArray);
                        }}
                        style={{
                          backgroundColor:
                            prayerStatusColorsHexCodes["male-alone"],
                        }}
                        className={`${
                          salahStatus === "male-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3 icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        <GoPerson className="w-full mb-1 text-3xl" />
                        <p className="inline">On Time</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("excused");
                          // setShowReasons(false);
                          // setReasonsArray([]);
                        }}
                        style={{
                          backgroundColor: prayerStatusColorsHexCodes.excused,
                        }}
                        className={`${
                          salahStatus === "excused" ? "border border-white" : ""
                        } px-5 py-3 icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                      >
                        <PiFlower className="w-full mb-1 text-3xl" />
                        <p className="inline">Excused</p>
                      </div>{" "}
                    </>
                  )}
                  <div
                    onClick={() => {
                      setSalahStatus("late");
                      // setShowReasons(true);
                      // setReasonsArray(reasonsArray);
                    }}
                    style={{
                      backgroundColor: prayerStatusColorsHexCodes.late,
                    }}
                    className={`${
                      salahStatus === "late" ? "border border-white" : ""
                    } px-5 py-3 icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                  >
                    <GoClock className="w-full mb-1 text-3xl" />
                    <p className="inline">Late</p>
                  </div>
                  <div
                    onClick={() => {
                      setSalahStatus("missed");
                      // setShowReasons(true);
                      // setReasonsArray(reasonsArray);
                    }}
                    style={{
                      backgroundColor: prayerStatusColorsHexCodes.missed,
                    }}
                    className={`${
                      salahStatus === "missed" ? "border border-white" : ""
                    } px-5 py-3 icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
                  >
                    <GoSkip className="w-full mb-1 text-3xl" />
                    <p className="inline">Missed</p>
                  </div>
                </div>

                {/* {salahStatus === "male-alone" ||
              salahStatus === "late" ||
              salahStatus === "missed" ? ( */}
                <div
                  ref={modalSheetPrayerReasonsWrap}
                  className="mb-5 overflow-x-hidden mt-7 prayer-status-modal-reasons-wrap"
                >
                  <div className="flex justify-between">
                    <h2 className="mb-3 text-sm">Reasons (Optional): </h2>
                    <p
                      onClick={() => {
                        // prompt();
                        setShowAddCustomReasonInputBox(true);
                      }}
                    >
                      {/* + */}
                    </p>
                  </div>
                  <div className="flex flex-wrap">
                    {/* {missedReasonsArray.map((item) => ( */}
                    {userPreferences.reasonsArray.sort().map((item) => (
                      <p
                        key={item}
                        style={{
                          backgroundColor: selectedReasons.includes(item)
                            ? "#2563eb"
                            : "",
                        }}
                        className={reasonsStyles}
                        onClick={() => {
                          if (!selectedReasonsArray.includes(item)) {
                            selectedReasonsArray = [...selectedReasons, item];
                          } else if (selectedReasonsArray.includes(item)) {
                            let indexToRemove = selectedReasons.indexOf(item);
                            selectedReasonsArray = selectedReasons.filter(
                              (item) => {
                                return (
                                  selectedReasons.indexOf(item) !==
                                  indexToRemove
                                );
                              }
                            );
                          }
                          setSelectedReasons(selectedReasonsArray);
                        }}
                        // border border-gray-700 b-1 rounded-xl
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                {/* ) : null} */}
                {showAddCustomReasonInputBox ? (
                  <div className="absolute inline-block p-5 transform -translate-x-1/2 -translate-y-1/2 custom-input-box-wrap top-1/2 left-1/2 bg-slate-950">
                    <p className="mb-5">Enter Custom Reason:</p>
                    <input
                      className="bg-gray-800"
                      type="text"
                      maxLength={10}
                      value={customReason}
                      onChange={handleCustomReason}
                    />
                    <button
                      className="mt-10 bg-blue-700"
                      onClick={() => {
                        const updatedReasonsArray = [
                          ...userPreferences.reasonsArray,
                          customReason,
                        ];
                        // setReasonsArray(updatedReasonsArray);
                        setUserPreferences((userPreferences) => ({
                          ...userPreferences,
                          reasonsArray: updatedReasonsArray,
                        }));
                        setShowAddCustomReasonInputBox(false);
                        localStorage.setItem(
                          "storedReasonsArray",
                          JSON.stringify(updatedReasonsArray)
                        );
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : null}

                <div
                  className="text-sm notes-wrap"
                  //  useRef={notesBoxRef}
                >
                  {/* <h2 className="mt-3">Notes (Optional)</h2> */}
                  <textarea
                    dir="auto"
                    placeholder="Notes (Optional)"
                    ref={notesTextArea}
                    value={notes}
                    onChange={(e) => {
                      handleNotes(e);
                      increaseTextAreaHeight(e);
                    }}
                    style={{ resize: "vertical" }}
                    // wrap="hard"
                    rows={3}
                    // cols={1}
                    className="w-full p-2 border outline-none bg-[rgb(35,35,35)] border-hidden rounded-xl max-h-14 focus:border-gray-500"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (salahStatus) {
                      await addOrModifySalah();
                      // setSelectedSalahAndDate({
                      //   selectedDates: [],
                      //   selectedSalahs: [],
                      // });
                      resetSelectedSalahAndDate();
                      setIsMultiEditMode(false);
                      resetSelectedRow();
                      setShowUpdateStatusModal(false);
                      // setSelectedReasons([]);
                      // setNotes("");
                    }
                  }}
                  className={`w-full p-4 mt-5 rounded-2xl bg-blue-600 ${
                    salahStatus ? "opacity-100" : "opacity-20"
                  }`}
                >
                  Save
                </button>
              </section>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onTap={onSheetClose}
        />
      </Sheet>
      <div
        className="duplicate-reasons z-[-100] absolute bottom-0"
        ref={modalSheetHiddenPrayerReasonsWrap}
      >
        <div
          style={
            {
              // visibility: "hidden",
              // transform: "translateX(1000px)",
              // position: "absolute",
              // backgroundColor: "transparent",
              // color: "transparent",
              // border: "none",
              // left: "30%",
              // zIndex: "-100",
            }
          }
        >
          <div className="overflow-x-hidden prayer-status-modal-reasons-wrap">
            <div className="flex justify-between">
              <h2 className="mb-3 text-sm">Reasons (Optional): </h2>
              <p
                onClick={() => {
                  // prompt();
                  setShowAddCustomReasonInputBox(true);
                }}
              >
                {/* + */}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <h2 className="mb-3 text-sm">Reasons (Optional): </h2>
          <p
            onClick={() => {
              // prompt();
              setShowAddCustomReasonInputBox(true);
            }}
          >
            {/* + */}
          </p>
        </div>
        <div className="flex flex-wrap">
          {/* {missedReasonsArray.map((item) => ( */}
          {userPreferences.reasonsArray.sort().map((item) => (
            <p
              key={item} // TODO: Ensure item is going to be unique as this is being used as the key here
              style={{
                backgroundColor: selectedReasons.includes(item) ? "#fff" : "",
              }}
              onClick={() => {
                if (!selectedReasonsArray.includes(item)) {
                  selectedReasonsArray = [...selectedReasons, item];
                } else if (selectedReasonsArray.includes(item)) {
                  let indexToRemove = selectedReasons.indexOf(item);
                  selectedReasonsArray = selectedReasons.filter((item) => {
                    return selectedReasons.indexOf(item) !== indexToRemove;
                  });
                }
                setSelectedReasons(selectedReasonsArray);
              }}
              className="p-2 m-1 text-xs border border-gray-700 b-1 rounded-xl"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default PrayerStatusBottomSheet;
