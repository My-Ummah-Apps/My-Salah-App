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
  SalahRecordsArrayType,
  SalahRecordType,
  userPreferencesType,
} from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import {
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
  // setClickedSalah: React.Dispatch<React.SetStateAction<string>>;
  // setClickedDate: React.Dispatch<React.SetStateAction<string>>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  singleSalahObjArr: any;
  handleSalahTrackingDataFromDB: (
    DBResultAllSalahData: DBResultDataObjType[]
  ) => Promise<void>;
  showUpdateStatusModal: boolean;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  // TODO: Change the below types from any to relevant types
  setSelectedSalahAndDate: any;
  selectedSalahAndDate: any;
  isMultiEditMode: boolean;
  // setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  // hasUserClickedDate: boolean;
}

const PrayerStatusBottomSheet = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setFetchedSalahData,
  fetchedSalahData,
  handleSalahTrackingDataFromDB,
  setSelectedSalahAndDate,
  selectedSalahAndDate,
  isMultiEditMode,
  setUserPreferences,
  userPreferences,
  singleSalahObjArr,
  showUpdateStatusModal,
  setShowUpdateStatusModal,
}: // setHasUserClickedDate,
// hasUserClickedDate,
PrayerStatusBottomSheetProps) => {
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

  // const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";

  // let isDatabaseUpdating: boolean = false;

  const doesSalahAndDateExists = async (): Promise<boolean> => {
    const selectedDate = Object.keys(selectedSalahAndDate)[0];
    const selectedSalah = Object.values(selectedSalahAndDate)[0][0];
    console.log("selectedDate: ", selectedDate);

    try {
      await checkAndOpenOrCloseDBConnection("open");

      // TODO: Need to alter below functionality so that multiple dates and salah can be handled at the same time
      const res = await dbConnection.current.query(
        `SELECT * FROM salahDataTable 
      WHERE date = ? AND salahName = ?;`,
        [selectedDate, selectedSalah]
      );

      if (res && res.values && res.values.length === 0) {
        // setSalahStatus("");
        // setNotes("");
        // setSelectedReasons([]);
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
    if (isMultiEditMode) return;
    try {
      await doesSalahAndDateExists();
    } catch (error) {
      console.error(error);
    }
  };

  const addOrModifySalah = async () =>
    // salahStatus: string,
    // selectedReasons?: string[],
    // notes?: string
    {
      const salahDBValues = [];
      // const findDateWithinData = fetchedSalahData.find(
      //   (obj: any) => obj.date === clickedDate
      // );

      try {
        await checkAndOpenOrCloseDBConnection("open");
        // await dbConnection.current.execute("BEGIN TRANSACTION");
        // await dbConnection.current.run("BEGIN TRANSACTION");

        // INSERT OR REPLACE INTO salahDataTable (date, salahName, salahStatus, reasons, notes)
        // VALUES
        //   ("2024-01-01", "Fajr", "completed"),
        //   ("2024-01-02", "Dhuhr", "completed"),
        //   ("2024-01-03", "Asr", "completed");
        // await dbConnection.current.run("COMMIT");

        const date = Object.keys(selectedSalahAndDate)[0];
        const salahArr = Object.values(selectedSalahAndDate).flat();
        const reasonsToInsert =
          selectedReasons.length > 0 ? selectedReasons.join(", ") : "";
        for (let i = 0; i < salahArr.length; i++) {
          salahDBValues.push([
            date,
            salahArr[i],
            salahStatus,
            reasonsToInsert,
            notes,
          ]);
        }

        let query = `INSERT OR REPLACE INTO salahDataTable(date, salahName, salahStatus, reasons, notes`;
        // const values = [clickedDate, clickedSalah, salahStatus];

        // if (selectedReasons !== undefined && selectedReasons.length > 0) {
        if (selectedReasons.length > 0) {
          // !Have had to comment below out as its causing an empty string to be added to salahDBValues, requires further investigation
          // console.log("SELECTED REASONS EXIST: ", selectedReasons);
          // query += `, reasons`;
          // const stringifiedReasons = selectedReasons.join(", ");
          // salahDBValues.push(stringifiedReasons);
        }

        // if (notes !== undefined && notes !== "") {
        // if (notes) {
        //   query += `, notes`;
        //   console.log("NOTES: ", notes);

        //   salahDBValues.push(notes);
        // }
        let salahDBValuesSubArr = "";
        let placeholder = "";
        let placeholders = "";
        let flattenedSalahDBValues = "";
        salahDBValuesSubArr = salahDBValues[0];
        placeholder = salahDBValuesSubArr.map((item) => "?").join(", ");
        placeholders = salahDBValues
          .map((item) => `(${placeholder})`)
          .join(",");

        query += `) VALUES ${placeholders}`;
        flattenedSalahDBValues = salahDBValues.flat();
        console.log("QUERY: ", query);
        console.log("salahDBValues: ", salahDBValues);
        console.log("FALTTENED VALUES: ", flattenedSalahDBValues);
        await dbConnection.current.run(query, flattenedSalahDBValues);

        // await dbConnection.current.execute("COMMIT");
        console.log("ROWS INSERTED SUCCESSFULLY");
        const DBResultAllSalahData = await dbConnection.current.query(
          `SELECT * FROM salahDataTable`
        );
        console.log("UPDATED DATABASE: ", DBResultAllSalahData);
        console.log("FETCHED DATA BEFORE: ", fetchedSalahData);

        // setFetchedSalahData((prev) => [...prev]);
        // ! The below works somewhat, but unsure if this is the best way to get the page to re-render, as this re-fetches everything from the database and then updates the state
        // await handleSalahTrackingDataFromDB(DBResultAllSalahData.values);

        const salahsToInsert = salahArr.reduce((acc, item) => {
          acc[item] = salahStatus;
          return acc;
        }, {});
        console.log("salahsToInsert: ", salahsToInsert);

        const singleSalahObj: SalahRecordType = {
          date: date,
          salahs: salahsToInsert,
        };
        console.log("SINGLE OBJ: ", singleSalahObj);
        console.log("FETCHED DATA BEFORE: ", fetchedSalahData);

        const newData = fetchedSalahData.map((item) => {
          if (Object.values(item)[0] === date) {
            console.log("DATE MATCHED: ", date);
            console.log("YO: ", Object.values(item)[1]);
          } else {
            console.log("DATE NOT MATCHED");
            return item;
          }
        });
        //! Issue with the below state is that it isn't updating the salah status property in the fetchedSalahData object, trying to change this above by diving into the object and making the changes needed
        setFetchedSalahData((prev) => [...prev, singleSalahObj]);
        // const test = [...newData, singleSalahObj];
        // setFetchedSalahData(test);
        // singleSalahObjArr.push(singleSalahObj);
        // setFetchedSalahData([...singleSalahObjArr]);

        console.log("FETCHED DATA AFTER: ", fetchedSalahData);
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
    if (isMultiEditMode === false) {
      setSelectedSalahAndDate({});
    }
    setShowUpdateStatusModal(false);
    setSalahStatus("");
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
                <h1 className="mb-10 text-3xl text-center">
                  {/* How did you pray {clickedSalah}? */}
                  How did you pray sort this out?
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
                      addOrModifySalah();
                      // clickedDate,
                      // clickedSalah,
                      // salahStatus,
                      // selectedReasons,
                      // notes

                      setShowUpdateStatusModal(false);
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
