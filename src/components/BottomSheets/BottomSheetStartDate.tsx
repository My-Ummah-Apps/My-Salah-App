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
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  INITIAL_MODAL_BREAKPOINT,
  MIN_START_DATE,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

interface BottomSheetStartDateProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  // triggerId: string;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  fetchDataFromDB: () => Promise<void>;
  setShowStartDateSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showStartDateSheet: boolean;
}

const BottomSheetStartDate = ({
  dbConnection,
  // triggerId,
  setUserPreferences,
  userPreferences,
  fetchDataFromDB,
  setShowStartDateSheet,
  showStartDateSheet,
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
      isOpen={showStartDateSheet}
      onDidDismiss={() => {
        setShowStartDateSheet(false);
      }}
      ref={modal}
      mode="ios"
      expandToScroll={false}
      className="modal-fit-content"
      // trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <section className="px-5 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <h1 className="mb-5 font-bold leading-tight">Change Start Date</h1>
        <p className="mb-2 font-semibold">Current start date</p>
        <p className="rounded-xl bg-[var(--sheet-pill-bg)] px-4 py-3 text-[var(--secondary-text-color)]">
          {/* {createLocalisedDate(userPreferences.userStartDate)[1]} */}
          {createLocalisedDate(currentStartDate)[1]}
        </p>
        <p className="mb-2 mt-5 font-semibold">New start date</p>
        <div className="relative rounded-xl border border-[color:var(--sheet-input-border-color)] bg-[var(--sheet-bg-color)]">
          <input
            className="h-12 w-full appearance-none rounded-xl bg-transparent px-4 text-[var(--ion-text-color)] [color-scheme:var(--input-color-scheme)] [&::-webkit-calendar-picker-indicator]:hidden"
            onKeyDown={(e) => {
              e.preventDefault();
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
          <IonIcon
            aria-hidden="true"
            icon={calendarOutline}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[var(--secondary-text-color)]"
          />
        </div>
        <p className="mt-2 text-sm leading-snug text-[var(--secondary-text-color)]">
          Moving it earlier adds older days to log. Moving it later hides the
          days before it, but nothing is deleted.
        </p>
        <IonButton
          expand="block"
          disabled={!selectedStartDate}
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
          className={`mx-0 mb-0 mt-6 text-[0.9375rem] font-semibold transition-opacity duration-300 ${
            selectedStartDate ? "" : "opacity-20"
          }`}
        >
          Save
        </IonButton>
      </section>
    </IonModal>
  );
};

export default BottomSheetStartDate;
