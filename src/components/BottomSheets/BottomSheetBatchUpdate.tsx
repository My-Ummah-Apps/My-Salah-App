import { IonCheckbox, IonModal } from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  SalahNamesType,
  SalahStatusType,
  userPreferencesType,
} from "../../types/types";
import { useState } from "react";
import { createLocalisedDate } from "../../utils/helpers";

interface BottomSheetBatchUpdateProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  triggerId: string;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  fetchDataFromDB: () => Promise<void>;
}

const BottomSheetBatchUpdate = ({
  dbConnection,
  triggerId,
  setUserPreferences,
  userPreferences,
  fetchDataFromDB,
}: BottomSheetBatchUpdateProps) => {
  type batchUpdateObj = {
    dates: string[];
    salahs: SalahNamesType[];
    status: SalahStatusType[];
    reasons: string;
    notes: string;
  };

  const [batchUpdateObj, setBatchUpdateObj] = useState<batchUpdateObj>({
    dates: [],
    salahs: [],
    status: [],
    reasons: "",
    notes: "",
  });

  return (
    <IonModal
      //   ref={modal}
      style={{
        "--width": "fit-content",
        "--min-width": "250px",
        "--height": "fit-content",
        "--border-radius": "6px",
        "--box-shadow": "0 28px 48px rgba(0, 0, 0, 0.4)",
      }}
      mode="ios"
      expandToScroll={false}
      // className="modal-fit-content"
      trigger={triggerId}
    >
      <section className="p-10 pb-5">
        <div className="text-center">
          <p className="">From</p>
          <input
            className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
            placeholder="&#x1F5D3;"
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // ref={datePickerRef}
            type="date"
            dir="auto"
            name="start-date-picker"
            min="1950-01-01"
            max={new Date().toISOString().split("T")[0]}
          ></input>
        </div>
        <div className="text-center">
          <p className="mt-5">To</p>
          <input
            className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
            placeholder="&#x1F5D3;"
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // ref={datePickerRef}
            type="date"
            dir="auto"
            name="start-date-picker"
            min="1950-01-01"
            max={new Date().toISOString().split("T")[0]}
          ></input>
        </div>
      </section>
      <section className="mx-auto mb-5">
        <IonCheckbox labelPlacement="stacked">Fajr</IonCheckbox>
        <IonCheckbox labelPlacement="stacked">Dhuhr</IonCheckbox>
        <IonCheckbox labelPlacement="stacked">Asr</IonCheckbox>
        <IonCheckbox labelPlacement="stacked">Maghrib</IonCheckbox>
        <IonCheckbox labelPlacement="stacked">Isha</IonCheckbox>
      </section>
      {/*  ${selectedStartDate ? "opacity-100" : "opacity-20"} */}
      <button
        className={`text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3 mx-auto mb-5
         
          `}
        // onClick={async () => {
        //   if (selectedStartDate) {
        //     const todaysDate = startOfDay(new Date());
        //     const selectedDate = startOfDay(new Date(selectedStartDate));

        //     if (isAfter(selectedDate, todaysDate)) {
        //       showAlert(
        //         "Invalid Date",
        //         "Please select a date that is not in the future",
        //       );
        //       return;
        //     }
        //     modal.current?.dismiss();
        //     setSelectedStartDate(null);
        //     await handleStartDateChange();
        //   }
        // }}
      >
        Next
      </button>
    </IonModal>
  );
};

export default BottomSheetBatchUpdate;
