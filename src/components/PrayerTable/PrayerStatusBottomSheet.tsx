import Sheet from "react-modal-sheet";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { PiFlower } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { SalahRecordsArrayType, userPreferencesType } from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import { TWEEN_CONFIG } from "../../utils/constants";

interface PrayerStatusBottomSheetProps {
  dbConnection: any;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: any;
  // setClickedSalah: React.Dispatch<React.SetStateAction<string>>;
  // setClickedDate: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  clickedDate: string;
  clickedSalah: string;
  showUpdateStatusModal: boolean;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  // setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  // hasUserClickedDate: boolean;
}

const PrayerStatusBottomSheet = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setFetchedSalahData,
  fetchedSalahData,
  // setClickedSalah,
  // setClickedDate,
  setUserPreferences,
  userPreferences,
  clickedDate,
  clickedSalah,
  showUpdateStatusModal,
  setShowUpdateStatusModal,
}: // setHasUserClickedDate,
// hasUserClickedDate,
PrayerStatusBottomSheetProps) => {
  console.log("BOTTOM SHEET HAS BEEN TRIGGERED");
  const sheetRef = useRef<HTMLDivElement>(null);
  const modalSheetPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  const modalSheetHiddenPrayerReasonsWrap = useRef<HTMLDivElement>(null);
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

  // const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";

  // let isDatabaseUpdating: boolean = false;

  const doesSalahAndDateExists = async (
    clickedSalah: string,
    clickedDate: string
  ): Promise<boolean> => {
    // console.log("doesSalahAndDateExists HAS RUN ", clickedSalah, clickedDate);
    // console.log("isDatabaseUpdating? ", isDatabaseUpdating);

    try {
      await checkAndOpenOrCloseDBConnection("open");

      const res = await dbConnection.current.query(
        `
      SELECT * FROM salahDataTable 
      WHERE salahName = ? AND date = ?;
    `,
        [clickedSalah, clickedDate]
      );

      console.log("res is: ", res);

      if (res && res.values && res.values.length === 0) {
        setSalahStatus("");
        setNotes("");
        setSelectedReasons([]);
        return false;
      } else if (res && res.values && res.values.length > 0) {
        // console.log("SALAH DATA FOUND, RES.VALUES IS: ", res.values);
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
    console.log("Running checkDBForSalah()");
    try {
      await doesSalahAndDateExists(clickedSalah, clickedDate);
    } catch (error) {
      console.error(error);
    }
  };

  const addOrModifySalah = async (
    clickedDate: string,
    clickedSalah: string,
    salahStatus: string,
    selectedReasons?: string[],
    notes?: string
  ) => {
    // console.log("addOrModifySalah HAS RUN");

    const findDateWithinData = fetchedSalahData.find(
      (obj: any) => obj.date === clickedDate
    );

    try {
      await checkAndOpenOrCloseDBConnection("open");

      const salahAndDateExist = await doesSalahAndDateExists(
        clickedSalah,
        clickedDate
      );

      // const DBResultAllSalahData = await dbConnection.current.query(
      //   `SELECT * FROM salahDataTable`
      // );

      if (!salahAndDateExist) {
        let query = `INSERT INTO salahDataTable(date, salahName, salahStatus`;
        const values = [clickedDate, clickedSalah, salahStatus];

        if (selectedReasons !== undefined && selectedReasons.length > 0) {
          // console.log("REASONS ARE NOT UNDEFINED");
          query += `, reasons`;
          const stringifiedReasons = selectedReasons.join(", ");
          // values.push(...reasons);
          values.push(stringifiedReasons);
        }

        if (notes !== undefined && notes !== "") {
          query += `, notes`;
          values.push(notes);
        }

        query += `) VALUES (${values.map(() => "?").join(", ")})`;
        // ? Is better to use .query or .execute?
        await dbConnection.current.query(query, values); // If .query isn't working, try .execute instead
        // await db?.execute(query, values);

        if (findDateWithinData) {
          findDateWithinData.salahs[clickedSalah] = salahStatus;
        } else {
          console.error(`Date ${clickedDate} not found in fetchedSalahData`);
        }

        setFetchedSalahData((prev) => [...prev]);
      } else if (salahAndDateExist) {
        let query = `UPDATE salahDataTable SET salahStatus = ?`;
        const values = [salahStatus];

        // await dbConnection.current?.run(query, [salahStatus, clickedDate]);

        if (selectedReasons !== undefined && selectedReasons.length > 0) {
          const stringifiedReasons = selectedReasons.join(", ");
          query += `, reasons = ?`;
          // values.push(...reasons);

          values.push(stringifiedReasons);
        }

        if (notes !== undefined && notes !== "") {
          query += `, notes = ?`;
          values.push(notes);
        }

        query += ` WHERE date = ? AND salahName = ?`;
        values.push(clickedDate, clickedSalah);

        await dbConnection.current.query(query, values);

        if (findDateWithinData) {
          findDateWithinData.salahs[clickedSalah] = salahStatus;
        } else {
          console.error(`Date ${clickedDate} not found in fetchedSalahData`);
        }

        setFetchedSalahData((prev) => [...prev]);
      }
      console.log("fetchedSalahData in sheet: ", fetchedSalahData);
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
    console.log("REASONS USEEFFECT HAS RUN");

    // console.log(modalSheetPrayerReasonsWrap.current);
    // console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
    if (
      modalSheetPrayerReasonsWrap.current &&
      modalSheetHiddenPrayerReasonsWrap.current
    ) {
      console.log(modalSheetPrayerReasonsWrap.current);
      console.log(modalSheetHiddenPrayerReasonsWrap.current.offsetHeight);
      if (
        salahStatus === "male-alone" ||
        salahStatus === "late" ||
        salahStatus === "missed"
      ) {
        console.log("SHOWING REASONS");
        modalSheetPrayerReasonsWrap.current.style.maxHeight =
          modalSheetHiddenPrayerReasonsWrap.current.offsetHeight + "px";
        modalSheetPrayerReasonsWrap.current.style.opacity = "1";
      } else {
        console.log("HIDING REASONS");
        modalSheetPrayerReasonsWrap.current.style.maxHeight = "0";
      }
    } else {
      console.log("REASONS WRAP IS NULL");
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

  return (
    <>
      <Sheet
        // rootId="root"
        onOpenStart={checkDBForSalah}
        isOpen={showUpdateStatusModal}
        onClose={() => {
          setShowUpdateStatusModal(false);
          // setHasUserClickedDate(false);
          // setClickedDate("");
          // setSalahStatus("");
          // setClickedSalah("");
        }}
        detent="content-height"
        // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
        tweenConfig={TWEEN_CONFIG}
      >
        <Sheet.Container
          className="react-modal-sheet-container"
          ref={sheetRef}
          style={{ backgroundColor: "rgb(33, 36, 38)" }}
        >
          <Sheet.Header />
          <Sheet.Content>
            <Sheet.Scroller>
              {" "}
              <section className="w-[90%] mx-auto mt-5 mb-20 rounded-lg text-white">
                <h1 className="mb-5 text-3xl text-center">
                  How did you pray {clickedSalah}?
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
                        className={`${
                          salahStatus === "group" ? "border border-white" : ""
                        } px-5 py-3 bg-[color:var(--jamaah-status-color)] icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                        className={`${
                          salahStatus === "female-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3 bg-[color:var(--alone-female-status-color)] icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                        className={`${
                          salahStatus === "male-alone"
                            ? "border border-white"
                            : ""
                        } px-5 py-3  bg-[color:var(--alone-male-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                        className={`${
                          salahStatus === "excused" ? "border border-white" : ""
                        } px-5 py-3  bg-[color:var(--excused-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                    className={`${
                      salahStatus === "late" ? "border border-white" : ""
                    } px-5 py-3 bg-[color:var(--late-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                    className={`${
                      salahStatus === "missed" ? "border border-white" : ""
                    } px-5 py-3 bg-[color:var(--missed-status-color)] icon-and-text-wrap rounded-2xl mx-auto text-center flex flex-col items-center justify-around w-full`}
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
                  className="my-8 overflow-x-hidden prayer-status-modal-reasons-wrap"
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
                  <div className="flex flex-wrap ">
                    {/* {missedReasonsArray.map((item) => ( */}
                    {userPreferences.reasonsArray.map((item) => (
                      <p
                        key={item}
                        style={{
                          backgroundColor: selectedReasons.includes(item)
                            ? "#2563eb"
                            : "",
                        }}
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
                        className="p-2 m-1 text-xs bg-[rgba(0, 0, 0, 1)] bg-gray-800/70 rounded-xl"
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
                  <h2 className="mt-3">Notes (Optional)</h2>
                  <textarea
                    value={notes}
                    onChange={handleNotes}
                    style={{ resize: "vertical" }}
                    // wrap="hard"
                    rows={3}
                    // cols={1}
                    className="w-full p-1 mt-3 bg-transparent border rounded-md "
                  />
                </div>
                <button
                  onClick={async () => {
                    if (salahStatus) {
                      addOrModifySalah(
                        clickedDate,
                        clickedSalah,
                        salahStatus,
                        selectedReasons,
                        notes
                      );

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
          onTap={() => setShowUpdateStatusModal(false)}
        />
      </Sheet>
      <div
        className="absolute z-[-100]"
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
          {userPreferences.reasonsArray.map((item) => (
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
