import Sheet from "react-modal-sheet";
import { sheetBackdropColor, TWEEN_CONFIG } from "../../utils/constants";
import {
  reasonsToShowType,
  salahReasonsOverallNumbersType,
} from "../../types/types";
import ReasonsTable from "../Stats/ReasonsTable";

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
      detent="full-height"
      tweenConfig={TWEEN_CONFIG}
    >
      <Sheet.Container>
        <Sheet.Scroller>
          <Sheet.Header />
          <Sheet.Content className="overflow-scroll mb-28 sheet-changelog">
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
                <ReasonsTable
                  salahReasonsOverallNumbers={salahReasonsOverallNumbers}
                  status={status}
                  partialOrFull="full"
                />
              </>
            )}
          </Sheet.Content>
        </Sheet.Scroller>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowReasonsSheet(false)}
      />
    </Sheet>
  );
};

export default BottomSheetReasons;
