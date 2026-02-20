import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonModal,
  IonTextarea,
} from "@ionic/react";

import {
  SalahNamesType,
  SalahStatusType,
  userPreferencesType,
} from "../../types/types";
import { useEffect, useState } from "react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  salahNamesArr,
} from "../../utils/constants";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { toggleDBConnection } from "../../utils/dbUtils";

interface BottomSheetBatchUpdateProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  triggerId: string;
  // setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  // fetchDataFromDB: () => Promise<void>;
}

const BottomSheetBatchUpdate = ({
  dbConnection,
  triggerId,
  // setUserPreferences,
  userPreferences,
  // fetchDataFromDB,
}: BottomSheetBatchUpdateProps) => {
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

  useEffect(() => {
    console.log("batchUpdateObj: ", batchUpdateObj);
  }, [batchUpdateObj]);

  const statusArr: SalahStatusType[] =
    userPreferences.userGender === "male"
      ? ["group", "male-alone", "late", "missed"]
      : ["female-alone", "excused", "late", "missed"];

  const executeBatchUpdate = async () => {
    const statement = `INSERT OR REPLACE INTO salahDataTable(date, salahName, salahStatus, reasons, notes) VALUES  (?, ?, ?, ?, ?)`;
    const statements = [];
    const values = [];
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
      }
    }

    console.log("DATES: ", dates);
    console.log("statements: ", statements);

    try {
      await toggleDBConnection(dbConnection, "open");
      await dbConnection.current?.executeSet(statements);
    } catch (error) {
      console.error("Batch update failed: ", error);
    } finally {
      await toggleDBConnection(dbConnection, "close");
    }
  };

  return (
    <IonModal
      //   ref={modal}
      // style={{
      //   "--width": "fit-content",
      //   "--min-width": "250px",
      //   "--height": "fit-content",
      //   "--border-radius": "6px",
      //   "--box-shadow": "0 28px 48px rgba(0, 0, 0, 0.4)",
      // }}
      mode="ios"
      expandToScroll={false}
      // className="modal-fit-content"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        <section className="p-10 pb-5">
          <div className="text-center">
            <p className="">From</p>
            <IonInput
              className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
              placeholder="&#x1F5D3;"
              onKeyDown={(e) => {
                // e.preventDefault();
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
              min="1950-01-01"
              max={new Date().toISOString().split("T")[0]}
            ></IonInput>
          </div>
          <div className="text-center">
            <p className="mt-5">To</p>
            <IonInput
              className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
              placeholder="&#x1F5D3;"
              onKeyDown={(e) => {
                // e.preventDefault();
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
              min="1950-01-01"
              max={new Date().toISOString().split("T")[0]}
            ></IonInput>
          </div>
        </section>
        <section>
          {statusArr.map((status) => (
            <IonCheckbox
              style={{
                "--size": "16px",
                "--border-color": "#888888",
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
              {status}
            </IonCheckbox>
          ))}
        </section>
        <section className="mb-5">
          {salahNamesArr.map((salahName) => (
            <IonCheckbox
              style={{
                "--size": "16px",
                "--border-color": "#888888",
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
        </section>
        <section>
          <p>Reasons</p>
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
        <div className="text-sm notes-wrap">
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
            className={`w-[90%]
         
          `}
            onClick={async () => {
              await executeBatchUpdate();
              // if (selectedStartDate) {
              //   const todaysDate = startOfDay(new Date());
              //   const selectedDate = startOfDay(new Date(selectedStartDate));
              //   if (isAfter(selectedDate, todaysDate)) {
              //     showAlert(
              //       "Invalid Date",
              //       "Please select a date that is not in the future",
              //     );
              //     return;
              //   }
              //   modal.current?.dismiss();
              //   setSelectedStartDate(null);
              //   await handleStartDateChange();
              // }
            }}
          >
            Update
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetBatchUpdate;
