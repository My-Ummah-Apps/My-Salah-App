import {
  bottomSheetCloseBtnStyles,
  bottomSheetContainerStyles,
  sheetBackdropColor,
  TWEEN_CONFIG,
} from "../../utils/constants";
import { changeLogs } from "../../utils/changelog";
import { LATEST_APP_VERSION } from "../../utils/changelog";
import Sheet from "react-modal-sheet";

interface BottomSheetChangeLogProps {
  setShowChangelogModal: React.Dispatch<React.SetStateAction<boolean>>;
  showChangelogModal: boolean;
}

const BottomSheetChangelog = ({
  setShowChangelogModal,
  showChangelogModal,
}: BottomSheetChangeLogProps) => {
  return (
    <Sheet
      isOpen={showChangelogModal}
      onClose={() => setShowChangelogModal(false)}
      detent="full-height"
      // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      tweenConfig={TWEEN_CONFIG}
    >
      <Sheet.Container style={bottomSheetContainerStyles}>
        {/* <Sheet.Header /> */}
        <Sheet.Content className="overflow-scroll mb-28 sheet-changelog">
          <Sheet.Scroller>
            <h1 className="mx-6 mt-8 mb-4 text-4xl ">Whats new?</h1>
            {changeLogs.map((item, i) => (
              <section
                key={i}
                className="mx-6 mt-4 changelog-individual-log"
                // style={{ borderColor: i === 0 ? "red" : "" }}
              >
                <p>
                  {item.versionNum === LATEST_APP_VERSION
                    ? `v${item.versionNum} - Latest Version`
                    : `v${item.versionNum}`}
                </p>
                {item.changes.map((item) => (
                  <section
                    key={item.heading}
                    // style={{ border: `1px solid ${activeBackgroundColor}` }}
                    className="mt-4 mb-4 p-4 border border-[var(--border-form)] rounded-xl
"
                  >
                    <h2 className="mb-2 text-lg font-medium">{item.heading}</h2>
                    <p className="text-sm">{item.text}</p>
                  </section>
                ))}
              </section>
            ))}
            <button
              onClick={() => setShowChangelogModal(false)}
              className={bottomSheetCloseBtnStyles}
            >
              Close
            </button>
            {/* <SheetCloseBtn closeModalState={setShowChangelogModal} /> */}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowChangelogModal(false)}
      />
    </Sheet>
  );
};

export default BottomSheetChangelog;
