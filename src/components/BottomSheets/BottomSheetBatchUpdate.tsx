import {
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  // IonSpinner,
  IonTextarea,
  useIonLoading,
} from "@ionic/react";

import {
  DBResultSalahStatusDataType,
  SalahNamesType,
  SalahStatusType,
  userPreferencesType,
} from "../../types/types";
import { useState } from "react";
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
import { calendarOutline } from "ionicons/icons";

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
  const [totalRows, setTotalRows] = useState(0);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
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

  const statusArr: SalahStatusType[] =
    userPreferences.userGender === "male"
      ? ["group", "male-alone", "late", "missed"]
      : ["female-alone", "excused", "late", "missed"];

  const executeBatchUpdate = async () => {
    try {
      const statement = `INSERT OR REPLACE INTO salahDataTable(date, salahName, salahStatus, reasons, notes) VALUES  (?, ?, ?, ?, ?)`;
      const statements = [];

      const {
        salahs: salahsToUpdate,
        status: salahStatus,
        reasons,
      } = batchUpdateObj;

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

      const batchSize = 100;

      if (!dbConnection.current) {
        throw new Error("dbConnection / dbconnection.current does not exist");
      }

      setTotalRows(dates.length * salahsToUpdate.length);

      await toggleDBConnection(dbConnection, "open");

      try {
        await dbConnection.current.beginTransaction();

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

            if (statements.length === batchSize) {
              await dbConnection.current.executeSet(statements, false);

              setProcessedRows((previous) => previous + batchSize);
              statements.length = 0;
            }
          }
        }

        if (statements.length > 0) {
          await dbConnection.current.executeSet(statements, false);
          setProcessedRows((previous) => previous + statements.length);
        }

        await dbConnection.current.commitTransaction();
      } catch (error) {
        await dbConnection.current.rollbackTransaction();
        throw error;
      }

      const DBResultSalahStatusData = await dbConnection.current.query(
        `SELECT date, salahName, salahStatus
            FROM salahDataTable`,
      );

      await handleSalahTrackingDataFromDB(
        DBResultSalahStatusData.values ?? [],
        userPreferences.userStartDate,
      );

      showToast(`Bulk Update Successful`, "long");

      setShowBatchUpdateModal(false);
    } catch (error) {
      console.error("Bulk update failed: ", error);
      showToast(`Bulk Update Failed, please try again - ${error}`, "long");
    } finally {
      setProcessedRows(0);
      setTotalRows(0);
      await dismissUpdatingSpinner();
      await toggleDBConnection(dbConnection, "close");
      setIsBatchUpdating(false);
    }
  };

  return (
    <IonModal
      mode="ios"
      className="modal-height"
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
      <IonContent className="[--background:var(--sheet-bg-color)]">
        <section className="px-5 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          <h1 className="mb-1 font-bold leading-tight">Bulk update Salah</h1>
          <p className="text-[0.9375rem] leading-relaxed text-[var(--secondary-text-color)]">
            Apply one status across selected dates and Salah.
          </p>
          <div className="mt-6 mb-4">
            <div className="">
              <p className="mb-0.5 text-sm font-semibold">Date range</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1.5 text-sm text-[var(--secondary-text-color)]">
                    From
                  </p>
                  <div className="relative flex h-12 items-center justify-between gap-1.5 rounded-xl border border-[color:var(--sheet-group-border)] bg-[var(--sheet-group-bg)] px-3.5 text-[0.9375rem]">
                    <span
                      className={
                        batchUpdateObj.fromDate !== ""
                          ? ""
                          : "text-[var(--secondary-text-color)]"
                      }
                    >
                      {batchUpdateObj.fromDate !== ""
                        ? format(
                            parseISO(batchUpdateObj.fromDate),
                            "do MMM yyyy",
                          )
                        : "Select date"}
                    </span>
                    <IonIcon
                      aria-hidden="true"
                      icon={calendarOutline}
                      className="shrink-0 text-lg text-[var(--secondary-text-color)] max-[359px]:hidden"
                    />
                    <input
                      className="absolute inset-0 h-full w-full opacity-0 [color-scheme:var(--input-color-scheme)]"
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
                </div>
                <div>
                  <p className="mb-1.5 text-sm text-[var(--secondary-text-color)]">
                    To
                  </p>
                  <div className="relative flex h-12 items-center justify-between gap-1.5 rounded-xl border border-[color:var(--sheet-group-border)] bg-[var(--sheet-group-bg)] px-3.5 text-[0.9375rem]">
                    <span
                      className={
                        batchUpdateObj.toDate !== ""
                          ? ""
                          : "text-[var(--secondary-text-color)]"
                      }
                    >
                      {/* {batchUpdateObj.toDate || "Select end date"} */}
                      {batchUpdateObj.toDate !== ""
                        ? format(parseISO(batchUpdateObj.toDate), "do MMM yyyy")
                        : "Select date"}
                    </span>
                    <IonIcon
                      aria-hidden="true"
                      icon={calendarOutline}
                      className="shrink-0 text-lg text-[var(--secondary-text-color)] max-[359px]:hidden"
                    />
                    <input
                      className="absolute inset-0 h-full w-full opacity-0 [color-scheme:var(--input-color-scheme)]"
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
                </div>
              </div>
              {/* <p className="mr-2"> */}
              {/* </p> */}
              <p className="mt-2 text-sm leading-snug text-[var(--secondary-text-color)]">
                Your earliest selectable date is{" "}
                {format(
                  parseISO(userPreferences.userStartDate),
                  "do MMMM yyyy",
                )}
                . Need earlier dates?{" "}
                <button
                  className="text-[var(--current-salah-color)]"
                  onClick={() => {
                    setShowStartDateSheet(true);
                  }}
                >
                  Change start date.
                </button>
              </p>

              {/* <div className="flex items-center mb-10 border border-[var(--app-border-color)] p-3 rounded-2xl">
                <p className="mr-4">
                  {" "}
                  <IonIcon className="text-2xl" icon={calendarClearOutline} />
                </p>
                <div className="text-xs">
                  <p className="">This will update x days</p>
                  <p>25 years, 3 months, 23 days</p>
                </div>
              </div> */}
            </div>
          </div>
          <section className="mx">
            <div className="mt-6 mb-5">
              <p className="mb-1.5 text-sm font-semibold">Select Salah</p>
              <div className="flex gap-1">
                {salahNamesArr.map((salahName) => {
                  const selected = batchUpdateObj.salahs.includes(salahName);

                  return (
                    <button
                      type="button"
                      aria-pressed={selected}
                      data-selected={selected}
                      className="h-8 flex-1 rounded-xl border border-solid border-[color:var(--sheet-input-border-color)] px-2 text-xs text-[var(--secondary-text-color)] data-[selected=true]:border-transparent data-[selected=true]:bg-[var(--ion-color-primary)] data-[selected=true]:font-semibold data-[selected=true]:text-white"
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
                      {salahName === "Asar" ? "Asr" : salahName}
                    </button>
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
                            : "var(--reasons-bg-color-status-sheet)",
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
                            : "var(--reasons-bg-color-status-sheet)",
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
            <p className="mb-2">Add a note (Optional)</p>
            <IonTextarea
              aria-label="notes"
              autoGrow={true}
              rows={1}
              className="pl-2 rounded-lg text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)]"
              placeholder="Write a note..."
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
          <div>
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
                  // message: `${processedRows}`,
                  backdropDismiss: false,
                  cssClass: "ion-spinner-hidden",
                });
                setIsBatchUpdating(true);
                await executeBatchUpdate();
              }}
            >
              Update
            </IonButton>
          </div>
        </section>
      </IonContent>
      {isBatchUpdating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/50">
          <div className="rounded-lg bg-[var(--ion-background-color)] p-6 text-center">
            <p className="mt-3">Updating prayers...</p>

            <p>
              {processedRows} / {totalRows}
            </p>

            {Math.round((processedRows / totalRows) * 100) < 100 ? (
              <p>{Math.round((processedRows / totalRows) * 100)}% </p>
            ) : (
              <p className="animate-pulse">Finishing up... </p>
            )}
          </div>
        </div>
      )}
    </IonModal>
  );
};

export default BottomSheetBatchUpdate;
