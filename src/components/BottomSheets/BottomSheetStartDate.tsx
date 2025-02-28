import Sheet from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  createLocalisedDate,
  isValidDate,
  sheetBackdropColor,
  sheetHeaderHeight,
  showToast,
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
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const currentStartDate = userPreferences.userStartDate;

  const handleStartDateChange = async () => {
    if (datePickerRef.current) {
      if (isValidDate(datePickerRef.current.value)) {
        // setSelectedStartDate(datePickerRef.current.value);
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
    setShowStartDateSheet(false);
    showToast(
      `Start date changed to ${createLocalisedDate(selectedStartDate!)[1]}`,
      "long"
    );
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
                  {/* {createLocalisedDate(userPreferences.userStartDate)[1]} */}
                  {createLocalisedDate(currentStartDate)[1]}
                </p>
              </section>
              <section className="text-center">
                <p className="mb-2">Select New Start Date</p>
                <input
                  // className="w-3/4"
                  // {...(Capacitor.getPlatform() === "ios" && {
                  //   placeholder: "Enter your text",

                  // })}
                  placeholder="&#x1F5D3;"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  onChange={(e) => {
                    setSelectedStartDate(e.target.value);
                  }}
                  ref={datePickerRef}
                  type="date"
                  name="start-date-picker"
                  min="1950-01-01"
                  max={new Date().toISOString().split("T")[0]}
                ></input>
              </section>
            </div>
            <button
              className={`text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3 mx-auto mb-[7%] ${
                selectedStartDate ? "opacity-100" : "opacity-20"
              }`}
              onClick={async () => {
                if (selectedStartDate) {
                  await handleStartDateChange();
                }
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
