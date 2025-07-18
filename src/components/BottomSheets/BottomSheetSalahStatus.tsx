import { AnimatePresence, motion } from "framer-motion";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { PiFlower } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { InAppReview } from "@capacitor-community/in-app-review";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import {
  SalahNamesType,
  SalahRecordsArrayType,
  SalahStatusType,
  SalahByDateObjType,
  userPreferencesType,
} from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import {
  createLocalisedDate,
  isValidDate,
  salahStatusColorsHexCodes,
  reasonsStyles,
  salahNamesArr,
  showConfirmMsg,
  validSalahStatuses,
} from "../../utils/constants";

import { isToday, isYesterday, parse } from "date-fns";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { IonModal, IonTextarea } from "@ionic/react";

interface SalahStatusBottomSheetProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  userPreferences: userPreferencesType;
  setShowBoxAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  showUpdateStatusModal: boolean;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSalahAndDate: SalahByDateObjType;
  resetSelectedSalahAndDate: () => void;
  setIsMultiEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMultiEditMode: boolean;
  generateStreaks: (fetchedSalahData: SalahRecordsArrayType) => void;
}

const BottomSheetSalahStatus = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setFetchedSalahData,
  fetchedSalahData,
  selectedSalahAndDate,
  setShowBoxAnimation,
  resetSelectedSalahAndDate,
  setIsMultiEditMode,
  isMultiEditMode,
  userPreferences,
  showUpdateStatusModal,
  setShowUpdateStatusModal,
  generateStreaks,
}: SalahStatusBottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const notesTextArea = useRef<HTMLTextAreaElement | null>(null);
  const [salahStatus, setSalahStatus] = useState<SalahStatusType>("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const [notes, setNotes] = useState("");
  const handleNotes = (e: CustomEvent<{ value: string }>) => {
    setNotes(e.detail.value);
  };

  const onSheetCloseCleanup = async () => {
    setShowUpdateStatusModal(false);
    resetSelectedSalahAndDate();
    setSalahStatus("");
    setSelectedReasons([]);
    setNotes("");
    setShowReasons(false);

    if (isMultiEditMode) {
      setIsMultiEditMode(false);
    }
  };

  const doesSalahAndDateExists = async (): Promise<boolean> => {
    const selectedDate = Object.keys(selectedSalahAndDate).toString();
    const selectedSalah = Object.values(selectedSalahAndDate).toString();

    try {
      await checkAndOpenOrCloseDBConnection("open");

      const res = await dbConnection.current!.query(
        `SELECT * FROM salahDataTable 
      WHERE date = ? AND salahName = ?;`,
        [selectedDate, selectedSalah]
      );

      if (res && res.values && res.values.length === 0) {
        return false;
      } else if (res && res.values && res.values.length > 0) {
        setSalahStatus(res.values[0].salahStatus);
        setNotes(res.values[0].notes);

        if (res.values[0].reasons.length > 0) {
          setSelectedReasons(res.values[0].reasons.split(", "));
        }
        return true;
      }
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
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

  const addOrModifySalah = async () => {
    const salahDataToInsertIntoDB = [];

    try {
      await checkAndOpenOrCloseDBConnection("open");

      const reasonsToInsert =
        selectedReasons.length > 0 &&
        salahStatus !== "group" &&
        salahStatus !== "female-alone" &&
        salahStatus !== "excused"
          ? selectedReasons.join(", ")
          : "";

      for (let [date, salahArr] of Object.entries(selectedSalahAndDate)) {
        if (!isValidDate(date)) {
          console.error(
            `Date is not valid: ${date},  skipping this iteration...`
          );
          continue;
        }

        if (
          !salahArr.every((salahName) =>
            salahNamesArr.includes(salahName as SalahNamesType)
          )
        ) {
          console.error(
            `Salah name is not valid: ${salahArr.join(
              ", "
            )}, skipping this iteration......`
          );
          continue;
        }

        if (!validSalahStatuses.includes(salahStatus)) {
          console.error(
            `salahStatus is not valid: ${salahStatus}, skipping this iteration...`
          );
          continue;
        }

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

      let query = `INSERT OR REPLACE INTO salahDataTable(date, salahName, salahStatus, reasons, notes`;

      const placeholder = salahDataToInsertIntoDB[0].map(() => "?").join(", ");
      const placeholders = salahDataToInsertIntoDB
        .map(() => `(${placeholder})`)
        .join(",");

      query += `) VALUES ${placeholders}`;
      const flattenedSalahDBValues = salahDataToInsertIntoDB.flat();

      await dbConnection.current!.run(query, flattenedSalahDBValues);

      for (const obj of fetchedSalahData) {
        if (selectedSalahAndDate[obj.date]) {
          selectedSalahAndDate[obj.date].forEach((item) => {
            obj.salahs[item as SalahNamesType] = salahStatus as SalahStatusType;
          });
        }
      }

      setFetchedSalahData((prev) => [...prev]);

      const saveButtonTapCountQuery = await dbConnection.current!.query(
        `SELECT * FROM userPreferencesTable WHERE preferenceName = ?;`,
        ["saveButtonTapCount"]
      );

      const incrementedSaveButtonTapCount =
        Number(saveButtonTapCountQuery.values![0].preferenceValue) + 1;

      if (Capacitor.isNativePlatform()) {
        if (
          incrementedSaveButtonTapCount === 3 ||
          incrementedSaveButtonTapCount === 10 ||
          incrementedSaveButtonTapCount === 20 ||
          incrementedSaveButtonTapCount % 50 === 0
        ) {
          InAppReview.requestReview();
        }
      }

      await dbConnection.current!.run(
        `UPDATE userPreferencesTable SET preferenceValue = ? WHERE preferenceName = ?`,
        [incrementedSaveButtonTapCount.toString(), "saveButtonTapCount"]
      );

      generateStreaks(fetchedSalahData);
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }
  };

  const [showReasons, setShowReasons] = useState(false);

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
    window.addEventListener("keyboardWillHide", () => {
      if (sheetRef.current) {
        sheetRef.current.style.setProperty(
          "margin-bottom",
          0 + "px",
          "important"
        );
      }
    });
  }

  const determineDateRecency = (date: string) => {
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    if (isToday(parsedDate)) {
      return "today";
    } else if (isYesterday(parsedDate)) {
      return "yesterday";
    } else {
      const [, formatDate] = createLocalisedDate(date);
      return `on ${formatDate}`;
    }
  };

  const salahStatusVariants = {
    default: { scale: 1, opacity: 0.5, transition: { duration: 0.3 } },
    animate: { scale: 1.07, opacity: 1, transition: { duration: 0.3 } },
  };

  const statusBoxStyles =
    "h-full px-5 py-3 icon-and-text-wrap rounded-xl mx-auto text-center flex flex-col items-center justify-around w-full";

  return (
    <>
      <IonModal
        className="modal-fit-content"
        mode="ios"
        onWillPresent={() => {
          checkDBForSalah();
        }}
        onDidDismiss={() => {
          setShowUpdateStatusModal(false);
          onSheetCloseCleanup();
        }}
        isOpen={showUpdateStatusModal}
        initialBreakpoint={0.97}
        breakpoints={[0, 0.97]}
      >
        <section className="p-5 pb-10 mx-auto text-white rounded-lg">
          <h1 className="mb-10 text-3xl font-light text-center">
            How did you pray{" "}
            {Object.keys(selectedSalahAndDate).length === 1 &&
            Object.values(selectedSalahAndDate)[0].length === 1
              ? `${Object.values(selectedSalahAndDate)} ${determineDateRecency(
                  Object.keys(selectedSalahAndDate)[0]
                )}?`
              : `these Salah?`}
          </h1>
          <div
            className={`mb-5 grid grid-cols-4 items-stretch grid-rows-1 gap-2 text-xs`}
          >
            {userPreferences.userGender === "male" ? (
              <motion.div
                variants={salahStatusVariants}
                initial="default"
                animate={salahStatus === "group" ? "animate" : "default"}
              >
                <div
                  onClick={() => {
                    setSalahStatus("group");
                    setShowReasons(false);
                  }}
                  style={{
                    backgroundColor: salahStatusColorsHexCodes.group,
                  }}
                  className={statusBoxStyles}
                >
                  {" "}
                  <GoPeople className="w-full mb-1 text-3xl" />
                  <p className="inline"> In Jamaah</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={salahStatusVariants}
                initial="default"
                animate={salahStatus === "female-alone" ? "animate" : "default"}
              >
                <div
                  onClick={() => {
                    setSalahStatus("female-alone");
                    setShowReasons(false);
                  }}
                  style={{
                    backgroundColor: salahStatusColorsHexCodes["female-alone"],
                  }}
                  className={statusBoxStyles}
                >
                  {" "}
                  <GoPerson className="w-full mb-1 text-3xl" />
                  <p className="inline">Prayed</p>
                </div>
              </motion.div>
            )}
            {userPreferences.userGender === "male" ? (
              <motion.div
                variants={salahStatusVariants}
                initial="default"
                animate={salahStatus === "male-alone" ? "animate" : "default"}
              >
                <div
                  onClick={() => {
                    setSalahStatus("male-alone");
                    setShowReasons(true);
                  }}
                  style={{
                    backgroundColor: salahStatusColorsHexCodes["male-alone"],
                  }}
                  className={statusBoxStyles}
                >
                  <GoPerson className="w-full mb-1 text-3xl" />
                  <p className="inline">On Time</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={salahStatusVariants}
                initial="default"
                animate={salahStatus === "excused" ? "animate" : "default"}
              >
                <div
                  onClick={() => {
                    setSalahStatus("excused");
                    setShowReasons(false);
                  }}
                  style={{
                    backgroundColor: salahStatusColorsHexCodes.excused,
                  }}
                  className={statusBoxStyles}
                >
                  <PiFlower className="w-full mb-1 text-3xl" />
                  <p className="inline">Excused</p>
                </div>{" "}
              </motion.div>
            )}

            <motion.div
              variants={salahStatusVariants}
              initial="default"
              animate={salahStatus === "late" ? "animate" : "default"}
              onClick={() => {
                setSalahStatus("late");
                setShowReasons(true);
              }}
              style={{
                backgroundColor: salahStatusColorsHexCodes.late,
              }}
              className={statusBoxStyles}
            >
              <GoClock className="w-full mb-1 text-3xl" />
              <p className="inline">Late</p>
            </motion.div>

            <motion.div
              variants={salahStatusVariants}
              initial="default"
              animate={salahStatus === "missed" ? "animate" : "default"}
              onClick={() => {
                setSalahStatus("missed");
                setShowReasons(true);
              }}
              style={{
                backgroundColor: salahStatusColorsHexCodes.missed,
              }}
              className={statusBoxStyles}
            >
              <GoSkip className="w-full mb-1 text-3xl" />
              <p className="inline">Missed</p>
            </motion.div>
          </div>
          <AnimatePresence>
            {showReasons && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-hidden"
              >
                {userPreferences.reasons.length > 0 && (
                  <div>
                    <h2 className="text-sm text-start">Reasons: </h2>
                  </div>
                )}
                {Array.isArray(userPreferences.reasons) && (
                  <div className="flex flex-wrap mb-5 salah-status-modal-reasons-wrap">
                    <AnimatePresence>
                      {[
                        ...new Set([
                          ...selectedReasons,
                          ...userPreferences.reasons,
                        ]),
                      ]
                        .sort((a, b) => a.localeCompare(b))

                        .map((item) => (
                          <motion.p
                            // layout="position"
                            initial={{
                              backgroundColor: "#272727",
                            }}
                            animate={{
                              backgroundColor: selectedReasons.includes(item)
                                ? "#2563eb"
                                : "#272727",
                            }}
                            transition={{ duration: 0.3 }}
                            exit={{ scale: [1, 1.2, 0], opacity: 0 }}
                            key={item}
                            className={reasonsStyles}
                            onClick={async () => {
                              if (!selectedReasons.includes(item)) {
                                setSelectedReasons((prev) => [...prev, item]);
                              } else if (selectedReasons.includes(item)) {
                                if (!userPreferences.reasons.includes(item)) {
                                  const confirmMsgRes = await showConfirmMsg(
                                    "Confirm",
                                    "This reason has been deleted from the reasons list, deselecting it will cause it to be removed permanently from this Salah entry, proceed?"
                                  );
                                  if (!confirmMsgRes) return;
                                }
                                setSelectedReasons((prev) =>
                                  prev.filter((reason) => reason !== item)
                                );
                              }
                            }}
                          >
                            {item}
                          </motion.p>
                        ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
          <div className="text-sm notes-wrap">
            <IonTextarea
              autoGrow={true}
              rows={1}
              className="pl-2 rounded-lg bg-stone-900"
              placeholder="Notes"
              onIonInput={(e) => {
                handleNotes(e);
                // increaseTextAreaHeight(e);
              }}
            ></IonTextarea>
            {/* <textarea
              dir="auto"
              placeholder="Notes"
              ref={notesTextArea}
              value={notes}
              onChange={(e) => {
                handleNotes(e);
                increaseTextAreaHeight(e);
              }}
              style={{ resize: "vertical" }}
              rows={3}
              className="w-full p-2 border outline-none bg-[rgb(35,35,35)] border-hidden rounded-xl max-h-14 focus:border-gray-500"
            /> */}
          </div>
          <motion.button
            animate={{
              opacity: salahStatus ? 1 : 0.2,
            }}
            transition={{ duration: 0.3 }}
            onClick={async () => {
              if (salahStatus) {
                await addOrModifySalah();
                setShowUpdateStatusModal(false);
                setShowBoxAnimation(true);
                onSheetCloseCleanup();
              }
            }}
            className={`w-full p-4 mt-5 rounded-2xl bg-blue-600 ${
              salahStatus ? "opacity-100" : "opacity-20"
            }`}
          >
            Save
          </motion.button>
        </section>

        {/* </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container> */}
        {/* <Sheet.Backdrop
          style={sheetBackdropColor}
          onTap={() => {
            setShowUpdateStatusModal(false);
            onSheetCloseCleanup();
          }}
        />
      </Sheet> */}
      </IonModal>
    </>
  );
};

export default BottomSheetSalahStatus;
