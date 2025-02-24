import Sheet from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  createLocalisedDate,
  isValidDate,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import { PreferenceType, userPreferencesType } from "../../types/types";
import { useRef, useState } from "react";

interface BottomSheetStartDateProps {
  showStartDateSheet: boolean;
  setShowStartDateSheet: React.Dispatch<React.SetStateAction<boolean>>;
  userPreferences: userPreferencesType;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  fetchDataFromDB: () => Promise<void>;
}

const BottomSheetStartDate = ({
  setShowStartDateSheet,
  showStartDateSheet,
  userPreferences,
  modifyDataInUserPreferencesTable,
  fetchDataFromDB,
}: BottomSheetStartDateProps) => {
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState(
    userPreferences.userStartDate
  );
  selectedStartDate;
  const handleStartDateChange = async () => {
    if (datePickerRef.current) {
      if (isValidDate(datePickerRef.current.value)) {
        setSelectedStartDate(datePickerRef.current.value);
        await modifyDataInUserPreferencesTable(
          "userStartDate",
          datePickerRef.current.value
        );
      } else {
        alert("Date not valid");
      }
    } else {
      console.log("datePickerRef.current null");
    }
    await fetchDataFromDB();
  };
  return (
    <>
      <Sheet
        detent="content-height"
        tweenConfig={TWEEN_CONFIG}
        isOpen={showStartDateSheet}
        onClose={() => setShowStartDateSheet(false)}
      >
        <Sheet.Container style={bottomSheetContainerStyles}>
          <Sheet.Header style={sheetHeaderHeight} />
          <Sheet.Content>
            <div className="h-[50vh]">
              <section className="mb-10 text-center">
                <p className="mb-2">Current Start Date:</p>
                <p className="font-extrabold">
                  {createLocalisedDate(userPreferences.userStartDate)[1]}
                </p>
              </section>
              <section className="text-center">
                <p className="mb-2">Select New Start Date</p>
                <input
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  //   onChange={handleStartDateChange}
                  ref={datePickerRef}
                  // className="hidden"
                  type="date"
                  id="start"
                  name="start-date-picker"
                  //   value={selectedStartDate}
                  min="1950-01-01"
                  max={new Date().toISOString().split("T")[0]}
                ></input>
              </section>
            </div>
            <button
              className="text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3 mx-auto mb-4"
              onClick={async () => {
                await handleStartDateChange();
                setShowStartDateSheet(false);
              }}
            >
              Save
            </button>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          style={sheetBackdropColor}
          onTap={() => setShowStartDateSheet(false)}
        />
      </Sheet>
    </>
  );
};

export default BottomSheetStartDate;
