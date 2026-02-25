import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonModal,
  IonTextarea,
  useIonLoading,
} from "@ionic/react";

import {
  DBResultDataObjType,
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
  showAlert,
  showToast,
  upperCaseFirstLetter,
} from "../../utils/helpers";

interface BottomSheetBatchUpdateProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  handleSalahTrackingDataFromDB: (
    DBResultAllSalahData: DBResultDataObjType[],
    userStartDate: string,
  ) => Promise<void>;
  setShowBatchUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  showBatchUpdateModal: boolean;
  // setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
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
  // fetchDataFromDB,
}: BottomSheetBatchUpdateProps) => {
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

      const BATCH_SIZE = 500;

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
            statements.length = 0; // clear array
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

      const DBResultAllSalahData = await dbConnection.current.query(
        `SELECT * FROM salahDataTable`,
      );

      await handleSalahTrackingDataFromDB(
        DBResultAllSalahData.values ?? [],
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
        <section
        //  className="flex flex-col justify-center"
        >
          <div className="p-10 pb-5">
            <div className="text-center">
              <p className="">From</p>
              <IonInput
                className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
                placeholder="&#x1F5D3;"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                onIonChange={(e) => {
                  setBatchUpdateObj((prev) => ({
                    ...prev,
                    fromDate: e.detail.value ?? "",
                  }));
                }}
                type="date"
                dir="auto"
                name="start-date-picker"
                min={userPreferences.userStartDate}
                max={new Date().toISOString().split("T")[0]}
              ></IonInput>
            </div>
            <div className="text-center">
              <p className="mt-5">To</p>
              <IonInput
                className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
                placeholder="&#x1F5D3;"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                onIonChange={(e) => {
                  setBatchUpdateObj((prev) => ({
                    ...prev,
                    toDate: e.detail.value ?? "",
                  }));
                }}
                // ref={datePickerRef}
                type="date"
                dir="auto"
                name="start-date-picker"
                min={userPreferences.userStartDate}
                max={new Date().toISOString().split("T")[0]}
              ></IonInput>
            </div>
          </div>
          <section className="flex justify-center gap-2 mx-auto my-5 text-center">
            <div className="border rounded-lg border-[var(--app-border-color)] py-2 text-center">
              <p className="mb-2">Which Salahs?</p>
              <div className="px-1">
                {salahNamesArr.map((salahName) => (
                  <IonCheckbox
                    style={{
                      "--size": "16px",
                      "--border-color": "#888888",
                      marginBottom: "1rem",
                    }}
                    key={salahName}
                    checked={batchUpdateObj.salahs.includes(salahName)}
                    onIonChange={() => {
                      setBatchUpdateObj((prev) => ({
                        ...prev,
                        salahs: prev.salahs.includes(salahName)
                          ? prev.salahs.filter((s) => s !== salahName)
                          : [...prev.salahs, salahName],
                      }));
                    }}
                    labelPlacement="stacked"
                  >
                    {salahName}
                  </IonCheckbox>
                ))}
              </div>
            </div>
            <div className="border rounded-lg border-[var(--app-border-color)] py-2 text-center">
              <p className="mb-2">Status</p>
              <div className="px-1">
                {statusArr.map((status) => (
                  <IonCheckbox
                    style={{
                      "--size": "16px",
                      "--border-color": "#888888",
                      marginBottom: "1rem",
                    }}
                    key={status}
                    checked={batchUpdateObj.status === status}
                    onIonChange={() => {
                      setBatchUpdateObj((prev) => ({
                        ...prev,
                        status: status,
                      }));
                    }}
                    labelPlacement="stacked"
                  >
                    {status === "male-alone"
                      ? "Alone"
                      : status === "female-alone"
                        ? "Prayed"
                        : status === "group"
                          ? "In Group"
                          : upperCaseFirstLetter(status)}
                  </IonCheckbox>
                ))}
              </div>
            </div>
          </section>
          {batchUpdateObj.status !== "group" &&
            batchUpdateObj.status !== "excused" &&
            batchUpdateObj.status !== "female-alone" &&
            batchUpdateObj.status !== "" && (
              <section className="border rounded-lg border-[var(--app-border-color)] mx-2 py-2 text-center">
                <p className="mb-5 text-center">Reasons</p>
                {userPreferences.reasons.map((reason) => (
                  <IonCheckbox
                    style={{
                      "--size": "16px",
                      "--border-color": "#888888",
                    }}
                    checked={batchUpdateObj.reasons.includes(reason)}
                    key={reason}
                    labelPlacement="stacked"
                    onIonChange={() => {
                      setBatchUpdateObj((prev) => ({
                        ...prev,
                        reasons: prev.reasons.includes(reason)
                          ? prev.reasons.filter((r) => r !== reason)
                          : [...prev.reasons, reason],
                      }));
                    }}
                  >
                    {reason}
                  </IonCheckbox>
                ))}
              </section>
            )}
          <div className="m-4 text-sm notes-wrap">
            <IonTextarea
              aria-label="notes"
              autoGrow={true}
              rows={1}
              className="pl-2 rounded-lg text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)]"
              placeholder="Notes"
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
          <div className="w-full mb-5 text-center">
            <IonButton
              disabled={
                !batchUpdateObj.fromDate ||
                !batchUpdateObj.toDate ||
                !batchUpdateObj.salahs.length ||
                !batchUpdateObj.status
              }
              className="w-[90%]"
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
                    `Date cannot be earlier than your start date: ${userPreferences.userStartDate}`,
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
                  message: "Batch Updating...",
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
