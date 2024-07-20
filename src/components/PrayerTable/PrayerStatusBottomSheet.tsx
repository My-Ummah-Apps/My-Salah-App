import Sheet from "react-modal-sheet";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { PiFlower } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { v4 as uuidv4 } from "uuid";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";

const PrayerStatusBottomSheet = ({
  dbConnection,
  fetchDataFromDatabase,
  setData,
  data,
  setCellColor,
  startIndex,
  endIndex,
  clickedDate,
  clickedSalah,
  // cellDate,
  userGender,
  showUpdateStatusModal,
  setShowUpdateStatusModal,
  setHasUserClickedDate,
  hasUserClickedDate, // customReason,
  // setSalahStatus,
} // salahStatus,
: {
  dbConnection: any;
  fetchDataFromDatabase: (startIndex: number, endIndex: number) => Promise<any>;
  setData: React.Dispatch<any>;
  data: any;
  setCellColor: React.Dispatch<React.SetStateAction<JSX.Element>>;
  startIndex: number;
  endIndex: number;
  clickedDate: string;
  clickedSalah: string;
  // cellDate: string;
  userGender: string;
  showUpdateStatusModal: boolean;

  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  hasUserClickedDate: boolean;
  // setSalahStatus: React.Dispatch<React.SetStateAction<string>>;
  // salahStatus: string;
  // customReason: string;
}) => {
  console.log("CLICKED DATE IS: ");
  console.log(clickedDate);
  console.log("clickedSalah");
  console.log(clickedSalah);
  const [updatingDatabase, setUpdatingDatabase] = useState<boolean>();
  const sheetRef = useRef<HTMLDivElement>(null);
  const modalSheetPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  const modalSheetHiddenPrayerReasonsWrap = useRef<HTMLDivElement>(null);
  // const [selectedSalah, setSelectedSalah] = useState("");
  const [salahStatus, setSalahStatus] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reasonsArray, setReasonsArray] = useState<string[]>([]);
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
  // console.log("BOTTOM SHEET HAS BEEN TRIGGERED");
  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";
  const dict = {
    group: "bg-[color:var(--jamaah-status-color)]",
    "male-alone": "bg-[color:var(--alone-male-status-color)]",
    "female-alone": "bg-[color:var(--alone-female-status-color)]",
    excused: "bg-[color:var(--excused-status-color)]",
    late: "bg-[color:var(--late-status-color)]",
    missed: "bg-[color:var(--missed-status-color)]",
  };

  let isDatabaseUpdating: boolean;

  const doesSalahAndDateExists = async (
    clickedSalah: string,
    date: string
  ): Promise<boolean> => {
    // console.log("UPDATING DATABASE? " + updatingDatabase);
    // if (isDatabaseUpdating) return;

    try {
      const isDatabaseOpen = await dbConnection.current?.isDBOpen();
      if (isDatabaseOpen?.result === false) {
        await dbConnection.current?.open();
        // console.log("DB CONNECTION OPENED IN doesSalahAndDateExists FUNCTION");
      }

      //   const query = `
      //   SELECT * FROM salahtrackingtable
      //   WHERE clickedSalah = ? AND date = ?;
      // `;
      //   const values = [clickedSalah, date];
      const res = await dbConnection.current?.query(
        `
      SELECT * FROM salahtrackingtable 
      WHERE salahName = ? AND date = ?;
    `,
        [clickedSalah, date]
      );
      console.log("res is: ");
      console.log(res);

      if (res && res.values && res.values.length > 0) {
        console.log("DATA FOUND");
        console.log("SETDATA IS:");
        console.log(data);

        // setSelectedSalah(clickedSalah);
        setSalahStatus(res.values[0].salahStatus);
        setNotes(res.values[0].notes);
        // setReasonsArray
        return true;
      } else if (res && res.values && res.values.length === 0) {
        setSalahStatus("");
        setNotes("");
        // setReasonsArray
        console.log("DATE DOES NOT EXIST, SETTING TO FALSE...");
        console.log("SETDATA IS:");
        console.log(data);
        return false;
      }
    } catch (error) {
      console.log(
        "ERROR OPENING CONNECTION IN doesSalahAndDateExists FUNCTION:"
      );
      console.log(error);
    } finally {
      try {
        const isDbOpen = await dbConnection.current?.isDBOpen();
        if (isDbOpen?.result && !isDatabaseUpdating) {
          await dbConnection.current?.close();
          // console.log("Database connection closed within addSalah function");
        }
      } catch (error) {
        console.log(
          "ERROR CLOSING DATABASE IN doesSalahAndDateExists FUNCTION:"
        );
        console.log(error);
      }
    }
    console.log("DOES SALAH EXIST HAS RUN TO THE END");
    return false;
  };

  const addOrModifySalah = async (
    clickedSalah: string,
    salahStatus: string,
    date: string,
    reasons?: string[],
    notes?: string
  ) => {
    console.log("DATA WITHIN ADDORMODIFY FUNCTION");
    // console.log(clickedSalah, salahStatus, date, reasons, notes);
    console.log("clickedSalah:", clickedSalah);
    isDatabaseUpdating = true;
    // console.log("UPDATING DATABASE STATE IS: " + updatingDatabase);

    try {
      const isDbOpen = await dbConnection.current?.isDBOpen();
      if (isDbOpen?.result === false) {
        await dbConnection.current?.open();
        // console.log(
        //   "DB Connection within addOrModifySalah function opened successfully"
        // );
      }

      // console.log("Is DB Open within addOrModifySalah Function: ");
      // console.log(isDbOpen.result);

      const salahAndDateExist = await doesSalahAndDateExists(
        clickedSalah,
        date
      );

      console.log("Does salah and date exist:");
      console.log(salahAndDateExist);

      if (!salahAndDateExist) {
        console.log("ADDING ITEM...");
        let query = `INSERT INTO salahtrackingtable(date, salahName, salahStatus`;
        const values = [clickedSalah, salahStatus, date];

        if (reasons !== undefined && reasons.length > 0) {
          console.log("REASONS ARE NOT UNDEFINED");
          query += `, reasons`;
          values.push(...reasons);
        }
        if (notes !== undefined && notes !== "") {
          console.log("NOTES ARE NOT UNDEFINED");
          query += `, notes`;
          values.push(notes);
        }

        query += `) VALUES (${values.map(() => "?").join(", ")})`;

        await dbConnection.current?.query(query, values); // If .query isn't working, try .execute instead
        // await db?.execute(query, values);
      } else if (salahAndDateExist) {
        console.log("EDITING ITEM...");
      }

      // console.log("DATA INSERTED INTO DATABASE");
    } catch (error) {
      console.log("ERROR WITHIN addOrModifySalah function:");
      console.log(error);
    } finally {
      try {
        const isDatabaseOpen = await dbConnection.current?.isDBOpen();
        if (isDatabaseOpen?.result) {
          await dbConnection.current?.close();
          // console.log(
          //   "Database connection closed within addOrModifySalah function"
          // );
          // setUpdatingDatabase(false);
          isDatabaseUpdating = false;
        }
      } catch (error) {
        console.log(
          "ERROR WHEN TRYING TO CLOSE DATABASE IN addOrModifySalah FUNCTION:"
        );
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   doesSalahAndDateExists(clickedSalah, cellDate);
  // }, []);

  useEffect(() => {
    const storedReasonsArray = localStorage.getItem("storedReasonsArray");
    if (storedReasonsArray) {
      setReasonsArray(JSON.parse(storedReasonsArray));
    } else if (storedReasonsArray === null) {
      const defaultReasonsArray = [
        "Alarm",
        "Education",
        "Family",
        "Friends",
        "Gaming",
        "Guests",
        "Leisure",
        "Movies",
        "Shopping",
        "Sleep",
        "Sports",
        "Travel",
        "TV",
        "Work",
      ];
      localStorage.setItem(
        "storedReasonsArray",
        JSON.stringify(defaultReasonsArray)
      );
      setReasonsArray(defaultReasonsArray);
    }
  }, []);

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
  }, [hasUserClickedDate, salahStatus]);

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
    <div className="sheet-prayer-update-wrap">
      <Sheet
        // rootId="root"
        isOpen={showUpdateStatusModal}
        onClose={() => {
          setShowUpdateStatusModal(false);
          setHasUserClickedDate(false);
        }}
        detent="content-height"
        tweenConfig={{ ease: "easeOut", duration: 0.3 }} // Adjust duration to slow down or speed up the animation
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
                  {userGender === "male" ? (
                    <>
                      <div
                        onClick={() => {
                          setSalahStatus("group");
                          // setShowReasons(false);
                          setSelectedReasons([]);
                          setNotes("");
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
                  {userGender === "male" ? (
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
                    {reasonsArray.map((item) => (
                      <p
                        key={uuidv4()}
                        // style={{
                        //   backgroundColor: selectedReasons.includes(item)
                        //     ? "#2563eb"
                        //     : "",
                        // }}
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
                          ...reasonsArray,
                          customReason,
                        ];

                        setReasonsArray(updatedReasonsArray);
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
                    className="w-full p-1 mt-3 bg-transparent border rounded-md border-amber-600"
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
                      // setCellColor(
                      //   <div
                      //     className={`${iconStyles} ${dict[salahStatus]} `}
                      //   ></div>
                      // );
                      console.log(
                        "START AND STOP INDEX: " + startIndex,
                        endIndex
                      );
                      setData(
                        await fetchDataFromDatabase(startIndex, endIndex)
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
        <Sheet.Backdrop onTap={close} />
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
          {reasonsArray.map((item) => (
            <p
              key={uuidv4()}
              // style={{
              //   backgroundColor: selectedReasons.includes(item)
              //     ? "#2563eb"
              //     : "",
              // }}
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
    </div>
  );
};

export default PrayerStatusBottomSheet;
