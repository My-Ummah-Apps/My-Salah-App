import {
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  IonTextarea,
  useIonLoading,
} from "@ionic/react";

import {
  DBResultSalahStatusDataType,
  SalahNamesType,
  SalahStatusType,
  userPreferencesType,
} from "../../types/types";
import { useEffect, useRef, useState } from "react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  salahNamesArr,
} from "../../utils/constants";
import {
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { toggleDBConnection } from "../../utils/dbUtils";
import {
  createLocalisedDate,
  showAlert,
  showToast,
  upperCaseFirstLetter,
} from "../../utils/helpers";
import { alertCircleOutline, calendarClearOutline } from "ionicons/icons";
import { MdOutlineChevronRight } from "react-icons/md";

interface BottomSheetBatchUpdateProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  handleSalahTrackingDataFromDB: (
    DBResultAllSalahData: DBResultSalahStatusDataType[],
    userStartDate: string,
  ) => Promise<void>;
  setShowBatchUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  showBatchUpdateModal: boolean;
  // setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setShowStartDateSheet: React.Dispatch<React.SetStateAction<boolean>>;

  userPreferences: userPreferencesType;
  // fetchDataFromDB: () => Promise<void>;
}

const BottomSheetBatchUpdate = ({
  dbConnection,
  handleSalahTrackingDataFromDB,
  setShowBatchUpdateModal,
  showBatchUpdateModal,
  // setUserPreferences,
  userPreferences,
  setShowStartDateSheet,
  // fetchDataFromDB,
}: BottomSheetBatchUpdateProps) => {
  const [processedRows, setProcessedRows] = useState(0);
  const [presentUpdatingSpinner, dismissUpdatingSpinner] = useIonLoading();

  type batchUpdateObj = {
    fromDate: string;
    toDate: string;
    salahs: SalahNamesType[];
    status: SalahStatusType;
    reasons: string[];
    notes: string;
  };

  const [batchUpdateObj, setBatchUpdateObj] = useState<batchUpdateObj>({
    fromDate: "",
    toDate: "",
    salahs: [],
    status: "",
    reasons: [],
    notes: "",
  });

  const fromDateInputRef = useRef<HTMLInputElement>(null);
  const toDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(batchUpdateObj);
  }, [batchUpdateObj]);

  const statusArr: SalahStatusType[] =
    userPreferences.userGender === "male"
      ? ["group", "male-alone", "late", "missed"]
      : ["female-alone", "excused", "late", "missed"];

  const executeBatchUpdate = async () => {
    try {
      const statement = `INSERT OR REPLACE INTO salahDataTable(date, salahName, salahStatus, reasons, notes) VALUES  (?, ?, ?, ?, ?)`;
      const statements = [];

      const salahsToUpdate = batchUpdateObj.salahs;
      const salahStatus = batchUpdateObj.status;
      const reasons = batchUpdateObj.reasons;

      const reasonsToInsert =
        reasons.length > 0 &&
        salahStatus !== "group" &&
        salahStatus !== "female-alone" &&
        salahStatus !== "excused"
          ? reasons.join(", ")
          : "";

      const dates = eachDayOfInterval({
        start: parseISO(batchUpdateObj.fromDate),
        end: parseISO(batchUpdateObj.toDate),
      }).map((date) => format(date, "yyyy-MM-dd"));

      // console.log("DATES: ", dates);

      // for (let i = 0; i < salahsToUpdate.length; i++) {
      //   for (let x = 0; x < dates.length; x++) {
      //     statements.push({
      //       statement: statement,
      //       values: [
      //         dates[x],
      //         salahsToUpdate[i],
      //         salahStatus,
      //         reasonsToInsert,
      //         batchUpdateObj.notes,
      //       ],
      //     });
      //   }
      // }

      const BATCH_SIZE = 100;

      if (!dbConnection.current) {
        throw new Error("dbConnection / dbconnection.current does not exist");
      }

      await toggleDBConnection(dbConnection, "open");

      for (let i = 0; i < salahsToUpdate.length; i++) {
        for (let x = 0; x < dates.length; x++) {
          statements.push({
            statement: statement,
            values: [
              dates[x],
              salahsToUpdate[i],
              salahStatus,
              reasonsToInsert,
              batchUpdateObj.notes,
            ],
          });

          if (statements.length === BATCH_SIZE) {
            await dbConnection.current.executeSet(statements);
            setProcessedRows((prev) => (prev += statements.length));
            statements.length = 0;
          }
        }
      }

      // flush remaining
      if (statements.length > 0) {
        await dbConnection.current.executeSet(statements);
      }

      // await dbConnection.current?.execute("BEGIN TRANSACTION");

      // for (let i = 0; i < salahsToUpdate.length; i++) {
      //   for (let x = 0; x < dates.length; x++) {
      //     await dbConnection.current?.run(statement, [
      //       dates[x],
      //       salahsToUpdate[i],
      //       salahStatus,
      //       reasonsToInsert,
      //       batchUpdateObj.notes,
      //     ]);
      //   }
      // }

      // await dbConnection.current?.execute("COMMIT");

      // console.log("DATES: ", dates);
      // console.log("statements: ", statements);

      // await dbConnection.current.executeSet(statements);

      // const DBResultAllSalahData = await dbConnection.current.query(
      //   `SELECT * FROM salahDataTable`,
      // ); // ! <- This statement here is causing crashes on certain devices when date goes back quite far, for e.g. 1980

      const DBResultSalahStatusData = await dbConnection.current.query(
        `SELECT date, salahName, salahStatus
          FROM salahDataTable`,
      );

      await handleSalahTrackingDataFromDB(
        DBResultSalahStatusData.values ?? [],
        userPreferences.userStartDate,
      );

      setShowBatchUpdateModal(false);
      showToast(`Batch Update Successful`, "long");
    } catch (error) {
      console.error("Batch update failed: ", error);
      showToast(`Batch Update Failed, please try again - ${error}`, "long");
    } finally {
      await dismissUpdatingSpinner();
      await toggleDBConnection(dbConnection, "close");
    }
  };

  return (
    <IonModal
      mode="ios"
      expandToScroll={false}
      isOpen={showBatchUpdateModal}
      onDidDismiss={() => {
        setShowBatchUpdateModal(false);
        setBatchUpdateObj({
          fromDate: "",
          toDate: "",
          salahs: [],
          status: "",
          reasons: [],
          notes: "",
        });
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        <section className="mx-4">
          <div className="mt-10 mb-4">
            <div className="">
              {/* <div className="flex justify-between mb-4 text-sm">
                <p>1. Select date range</p>
                <p>9000 days selected</p>
              </div> */}
              {/* <div>
                <IonIcon
                  data-testid="delete-location-btn"
                  icon={calendarClearOutline}
                ></IonIcon>
              <p className="">From</p>
              
              </div> */}
              <div className="flex justify-between my-4">
                <div className="flex p-2 rounded-2xl items-center gap-4 border border-[var(--app-border-color)]">
                  <div>
                    {" "}
                    <IonIcon icon={calendarClearOutline} />
                  </div>
                  <div
                    onClick={() => fromDateInputRef.current?.click()}
                    className="text-left"
                  >
                    <p className="text-sm">From</p>
                    <p className="text-xs">
                      {batchUpdateObj.fromDate || "Select start date"}
                    </p>
                  </div>
                  <div>
                    <MdOutlineChevronRight />
                  </div>
                </div>
                <div className="flex p-2 rounded-2xl items-center gap-4 border border-[var(--app-border-color)]">
                  <div>
                    {" "}
                    <IonIcon icon={calendarClearOutline} />
                  </div>
                  <div
                    onClick={() => toDateInputRef.current?.click()}
                    className="text-left"
                  >
                    <p className="text-sm">To</p>
                    <p className="text-xs">
                      {" "}
                      {batchUpdateObj.toDate || "Select end date"}
                    </p>
                  </div>
                  <div>
                    <MdOutlineChevronRight />
                  </div>
                </div>
              </div>

              <div className="flex items-center my-5 border border-[var(--app-border-color)] p-3 rounded-2xl">
                <p className="mr-4">
                  {" "}
                  <IonIcon className="text-2xl" icon={alertCircleOutline} />
                </p>
                <div className="text-xs">
                  <p className="">
                    Your earliest selectable date is{" "}
                    {createLocalisedDate(userPreferences.userStartDate)[1]}
                  </p>
                  <p>
                    Need earlier dates?{" "}
                    <span
                      className="text-blue-700 underline"
                      onClick={() => {
                        setShowStartDateSheet(true);
                      }}
                    >
                      {" "}
                      Change start date.{" "}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-10 border border-[var(--app-border-color)] p-3 rounded-2xl">
                <p className="mr-4">
                  {" "}
                  <IonIcon className="text-2xl" icon={calendarClearOutline} />
                </p>
                <div className="text-xs">
                  <p className="">This will update x days</p>
                  <p>25 years, 3 months, 23 days</p>
                </div>
              </div>

              <input
                ref={fromDateInputRef}
                className="invisible absolute text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
                placeholder="&#x1F5D3;"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                onChange={(e) => {
                  setBatchUpdateObj((prev) => ({
                    ...prev,
                    fromDate: e.target.value,
                  }));
                }}
                type="date"
                dir="auto"
                name="start-date-picker"
                min={userPreferences.userStartDate}
                max={new Date().toISOString().split("T")[0]}
              ></input>
            </div>

            <input
              ref={toDateInputRef}
              className="invisible absolute text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
              placeholder="&#x1F5D3;"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              onChange={(e) => {
                setBatchUpdateObj((prev) => ({
                  ...prev,
                  toDate: e.target.value,
                }));
              }}
              // ref={datePickerRef}
              type="date"
              dir="auto"
              name="start-date-picker"
              min={userPreferences.userStartDate}
              max={new Date().toISOString().split("T")[0]}
            ></input>
          </div>
          <section className="mx">
            <div className="my-5 rounded-lg">
              <div className="flex flex-row justify-between text-sm">
                <p className="mb-2 ">Select up to 5 prayers</p>
                <p>{batchUpdateObj.salahs.length} / 5 selected</p>
              </div>
              <div className="mx-1 mb-4 mt-1 text-[var(--ion-text-color)]">
                {salahNamesArr.map((salahName) => {
                  const selected = batchUpdateObj.salahs.includes(salahName);

                  return (
                    <IonChip
                      className="mt-2"
                      style={{
                        "--color": "var(--ion-text-color)",
                        backgroundColor: selected
                          ? "var(--reasons-bg-active-color-status-sheet)"
                          : undefined,
                      }}
                      key={salahName}
                      onClick={() => {
                        setBatchUpdateObj((prev) => ({
                          ...prev,
                          salahs: prev.salahs.includes(salahName)
                            ? prev.salahs.filter((s) => s !== salahName)
                            : [...prev.salahs, salahName],
                        }));
                      }}
                    >
                      <IonLabel className="text-sm">{salahName}</IonLabel>
                      {/* <IonIcon
                        icon={checkmarkOutline}
                        style={{
                          visibility: selected ? "visible" : "hidden",
                          fontSize: "16px",
                          marginRight: "4px",
                          color: selected ? "var(--ion-text-color)" : "none",
                        }}
                      /> */}

                      {/* <IonIcon icon={calendarClearOutline}></IonIcon> */}
                    </IonChip>
                  );
                })}
              </div>
            </div>
            <section>
              <div className="rounded-lg my-7">
                <p className="text-sm">Choose a status</p>
                <div className="mt-2 mb-4">
                  {statusArr.map((status) => {
                    const selected = batchUpdateObj.status === status;
                    return (
                      <IonChip
                        className="mt-2"
                        style={{
                          "--color": "var(--ion-text-color)",
                          backgroundColor: selected
                            ? "var(--reasons-bg-active-color-status-sheet)"
                            : undefined,
                        }}
                        key={status}
                        onClick={() => {
                          setBatchUpdateObj((prev) => ({
                            ...prev,
                            status: status,
                          }));
                        }}
                      >
                        <IonLabel className="text-sm">
                          {status === "male-alone"
                            ? "Alone"
                            : status === "female-alone"
                              ? "Prayed"
                              : status === "group"
                                ? "In Jamaah"
                                : upperCaseFirstLetter(status)}
                        </IonLabel>
                      </IonChip>
                    );
                  })}
                </div>
              </div>
            </section>
          </section>
          {batchUpdateObj.status !== "group" &&
            batchUpdateObj.status !== "excused" &&
            batchUpdateObj.status !== "female-alone" &&
            batchUpdateObj.status !== "" && (
              <section className="rounded-lg">
                <p className="w-full mb-3 text-sm">Select reasons (optional)</p>
                <div className="">
                  {userPreferences.reasons.map((reason) => {
                    const selected = batchUpdateObj.reasons.includes(reason);
                    return (
                      <IonChip
                        className="mt-2"
                        style={{
                          "--color": "var(--ion-text-color)",
                          backgroundColor: selected
                            ? "var(--reasons-bg-active-color-status-sheet)"
                            : undefined,
                        }}
                        key={reason}
                        onClick={() => {
                          setBatchUpdateObj((prev) => ({
                            ...prev,
                            reasons: prev.reasons.includes(reason)
                              ? prev.reasons.filter((r) => r !== reason)
                              : [...prev.reasons, reason],
                          }));
                        }}
                      >
                        <IonLabel className="text-xs">{reason}</IonLabel>
                      </IonChip>
                    );
                  })}
                </div>
              </section>
            )}
          <div className="mt-10 mb-5 text-sm notes-wrap">
            <IonTextarea
              aria-label="notes"
              autoGrow={true}
              rows={1}
              className="pl-2 rounded-lg text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)]"
              placeholder="Notes (optional)"
              value={batchUpdateObj.notes}
              onIonInput={(e) => {
                setBatchUpdateObj((prev) => ({
                  ...prev,
                  notes: e.detail.value ?? "",
                }));
              }}
            ></IonTextarea>
          </div>
          {/*  ${selectedStartDate ? "opacity-100" : "opacity-20"} */}
          <div className="mb-5">
            <IonButton
              disabled={
                !batchUpdateObj.fromDate ||
                !batchUpdateObj.toDate ||
                !batchUpdateObj.salahs.length ||
                !batchUpdateObj.status
              }
              className="w-full"
              onClick={async () => {
                const fromDate = startOfDay(parseISO(batchUpdateObj.fromDate));
                const toDate = startOfDay(parseISO(batchUpdateObj.toDate));
                const minDate = startOfDay(
                  parseISO(userPreferences.userStartDate),
                );

                if (!batchUpdateObj.fromDate || !batchUpdateObj.toDate) {
                  showAlert("No Dates Selected", "Please select dates");
                  return;
                }

                const todaysDate = startOfDay(new Date());
                // const fromDate = startOfDay(
                //   new Date(batchUpdateObj.fromDate),
                // );
                // const toDate = startOfDay(new Date(batchUpdateObj.toDate));

                if (isBefore(fromDate, minDate) || isBefore(toDate, minDate)) {
                  showAlert(
                    "Invalid Date",
                    `Date cannot be earlier than your start date: ${" "} ${createLocalisedDate(userPreferences.userStartDate)[1]}`,
                  );
                  return;
                }

                if (isAfter(fromDate, toDate)) {
                  showAlert(
                    "Invalid Date Range",
                    "Please select a valid date range",
                  );
                  return;
                }

                if (
                  isAfter(fromDate, todaysDate) ||
                  isAfter(toDate, todaysDate)
                ) {
                  showAlert("Invalid Date", "Dates cannot be in the future");
                  return;
                }

                await presentUpdatingSpinner({
                  message: `${processedRows}`,
                  backdropDismiss: false,
                  cssClass: "ion-spinner",
                });
                await executeBatchUpdate();
              }}
            >
              Update
            </IonButton>
          </div>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetBatchUpdate;
