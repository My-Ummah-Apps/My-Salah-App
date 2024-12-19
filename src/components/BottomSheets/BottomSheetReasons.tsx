import Sheet from "react-modal-sheet";
import { sheetBackdropColor, TWEEN_CONFIG } from "../../utils/constants";
import { useState } from "react";

const BottomSheetReasons = () => {
  const [showReasonsSheet, setShowReasonsSheet] = useState(false);

  return (
    <Sheet
      isOpen={showReasonsSheet}
      onClose={() => setShowReasonsSheet(false)}
      detent="full-height"
      // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      tweenConfig={TWEEN_CONFIG}
    >
      <Sheet.Container>
        {/* <Sheet.Header /> */}
        <Sheet.Content className="overflow-scroll mb-28 sheet-changelog"></Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowReasonsSheet(false)}
      />
    </Sheet>
  );
};

export default BottomSheetReasons;
