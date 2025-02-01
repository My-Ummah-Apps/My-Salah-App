import Sheet from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  sheetBackdropColor,
  TWEEN_CONFIG,
} from "../../utils/constants";
import {
  reasonsToShowType,
  salahReasonsOverallNumbersType,
} from "../../types/types";
import ReasonsList from "../Stats/ReasonsList";

interface BottomSheetReasonsProps {
  setShowReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showReasonsSheet: boolean;
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: reasonsToShowType;
}

const BottomSheetReasons = ({
  setShowReasonsSheet,
  showReasonsSheet,
  salahReasonsOverallNumbers,
  status,
}: BottomSheetReasonsProps) => {
  return (
    <Sheet
      isOpen={showReasonsSheet}
      onClose={() => setShowReasonsSheet(false)}
      detent="content-height"
      tweenConfig={TWEEN_CONFIG}
    >
      <Sheet.Container style={bottomSheetContainerStyles}>
        <Sheet.Header />
        <Sheet.Content className="mb-10 overflow-scroll sheet-changelog">
          <Sheet.Scroller>
            {status && (
              <>
                <h1 className="px-10 my-4 text-2xl text-center">
                  {`Reasons For ${
                    status === "male-alone"
                      ? "Praying Salah Alone"
                      : status === "late"
                      ? "Praying Salah Late"
                      : status === "missed"
                      ? "Missing Salah"
                      : ""
                  }`}
                </h1>
                <ReasonsList
                  salahReasonsOverallNumbers={salahReasonsOverallNumbers}
                  status={status}
                  partialOrFull="full"
                />
              </>
            )}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowReasonsSheet(false)}
      />
    </Sheet>
  );
};

export default BottomSheetReasons;
