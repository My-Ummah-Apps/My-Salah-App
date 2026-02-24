import {
  createLocalisedDate,
  isValidDate,
  updateUserPrefs,
  showAlert,
  showToast,
} from "../../utils/helpers";
import { userPreferencesType } from "../../types/types";
import { useRef, useState } from "react";
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { IonModal } from "@ionic/react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  INITIAL_MODAL_BREAKPOINT,
  MIN_START_DATE,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

interface BottomSheetStartDateProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  triggerId: string;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  fetchDataFromDB: () => Promise<void>;
}

const BottomSheetStartDate = ({
  dbConnection,
  triggerId,
  setUserPreferences,
  userPreferences,
  fetchDataFromDB,
}: BottomSheetStartDateProps) => {
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null,
  );
  const modal = useRef<HTMLIonModalElement>(null);
  const currentStartDate = userPreferences.userStartDate;

  const handleStartDateChange = async () => {
    if (datePickerRef.current) {
      if (isValidDate(datePickerRef.current.value)) {
        await updateUserPrefs(
          dbConnection,
          "userStartDate",
          datePickerRef.current.value,
          setUserPreferences,
        );
      } else {
        showAlert("Invalid Date", "Please enter a valid date");
        return;
      }
    } else {
      console.warn("datePickerRef.current null");
      return;
    }
    showToast(
      `Start date changed to ${createLocalisedDate(selectedStartDate!)[1]}`,
      "short",
    );
    await fetchDataFromDB();
  };
  return (
    <IonModal
      ref={modal}
      mode="ios"
      expandToScroll={false}
      className="modal-fit-content"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <div className="p-10">
        <section className="mb-10 text-center">
          <p className="mb-2">Current Start Date:</p>
          <p className="font-extrabold">
            {/* {createLocalisedDate(userPreferences.userStartDate)[1]} */}
            {createLocalisedDate(currentStartDate)[1]}
          </p>
        </section>
        <section className="text-center">
          <p className="mb-2">Select New Start Date</p>
          <input
            className="text-[var(--ion-text-color)] bg-[var(--textarea-bg-color)] rounded-[0.3rem] border-none [color-scheme:dark] p-[0.3rem]"
            placeholder="&#x1F5D3;"
            onKeyDown={(e) => {
              // e.preventDefault();
            }}
            onChange={(e) => {
              setSelectedStartDate(e.target.value);
            }}
            ref={datePickerRef}
            type="date"
            dir="auto"
            name="start-date-picker"
            min={MIN_START_DATE}
            max={new Date().toISOString().split("T")[0]}
          ></input>
        </section>
      </div>
      <button
        className={`text-base border-none rounded-xl bg-[#3880ff] text-white w-[90%] p-3 mx-auto mb-[7%] ${
          selectedStartDate ? "opacity-100" : "opacity-20"
        }`}
        onClick={async () => {
          if (selectedStartDate) {
            const todaysDate = startOfDay(new Date());
            // const selectedDate = startOfDay(new Date(selectedStartDate));
            const selectedDate = startOfDay(parseISO(selectedStartDate));
            const minDate = startOfDay(parseISO(MIN_START_DATE));

            if (isBefore(selectedDate, minDate)) {
              showAlert(
                "Invalid Date",
                `Date cannot be earlier than ${createLocalisedDate(MIN_START_DATE)[1]}`,
              );
              return;
            }

            if (isAfter(selectedDate, todaysDate)) {
              showAlert(
                "Invalid Date",
                "Please select a date that is not in the future",
              );
              return;
            }
            modal.current?.dismiss();
            setSelectedStartDate(null);
            await handleStartDateChange();
          }
        }}
      >
        Save
      </button>
    </IonModal>
  );
};

export default BottomSheetStartDate;
