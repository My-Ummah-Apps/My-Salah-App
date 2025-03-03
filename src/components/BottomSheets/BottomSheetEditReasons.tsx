import { PreferenceType, userPreferencesType } from "../../types/types";
import {
  bottomSheetContainerStyles,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import Sheet from "react-modal-sheet";

interface BottomSheetStartDateProps {
  showEditReasonsSheet: boolean;
  setShowEditReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  userPreferences: userPreferencesType;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  fetchDataFromDB: () => Promise<void>;
}

const BottomSheetEditReasons = ({
  setShowEditReasonsSheet,
  showEditReasonsSheet,
}: BottomSheetStartDateProps) => {
  return (
    <>
      {" "}
      <Sheet
        detent="content-height"
        tweenConfig={TWEEN_CONFIG}
        isOpen={showEditReasonsSheet}
        onClose={() => setShowEditReasonsSheet(false)}
      >
        <Sheet.Container style={bottomSheetContainerStyles}>
          <Sheet.Header style={sheetHeaderHeight} />
          <Sheet.Content>
            <button
            // className={`text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3 mx-auto mb-[7%] ${
            //   selectedStartDate ? "opacity-100" : "opacity-20"
            // }`}
            // onClick={async () => {
            //   if (selectedStartDate) {
            //     await handleStartDateChange();
            //   }
            // }}
            >
              Save
            </button>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          style={sheetBackdropColor}
          onTap={() => setShowEditReasonsSheet(false)}
        />
      </Sheet>
    </>
  );
};

export default BottomSheetEditReasons;
