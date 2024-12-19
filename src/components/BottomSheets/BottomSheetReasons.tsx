import Sheet from "react-modal-sheet";
import { sheetBackdropColor, TWEEN_CONFIG } from "../../utils/constants";
import { salahReasonsOverallNumbersType } from "../../types/types";
import ReasonsList from "../Stats/ReasonsList";

interface BottomSheetReasonsProps {
  setShowReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showReasonsSheet: boolean;
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed" | "";
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
      // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      tweenConfig={TWEEN_CONFIG}
    >
      <Sheet.Container>
        <Sheet.Scroller>
          {/* <Sheet.Header /> */}
          <Sheet.Content className="overflow-scroll mb-28 sheet-changelog">
            {/* <ReasonsList
              salahReasonsOverallNumbers={salahReasonsOverallNumbers}
              status={status}
            /> */}
            <>
              <h1 className="mb-2 text-lg text-center">
                Top Reasons For {status} Salah
              </h1>
              <ul>
                {Object.entries(salahReasonsOverallNumbers[status]).map(
                  ([key, value], index) => (
                    <li className="flex justify-between" key={index}>
                      <p>
                        {index + 1}. {key}
                      </p>
                      <p>{value} times</p>
                    </li>
                  )
                )}
              </ul>
            </>
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
