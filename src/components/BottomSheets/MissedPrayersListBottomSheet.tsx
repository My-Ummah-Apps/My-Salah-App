import Sheet from "react-modal-sheet";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSProperties } from "react";
import { MissedSalahObjType } from "../../types/types";
import { createLocalisedDate } from "../../utils/constants";

interface MissedPrayersListBottomSheetProps {
  setShowMissedPrayersSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedPrayersSheet: boolean;
  setMissedSalahList: React.Dispatch<React.SetStateAction<MissedSalahObjType>>;
  missedSalahList: MissedSalahObjType;
}

const MissedPrayersListBottomSheet = ({
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  missedSalahList,
}: //   setMissedSalahList,

MissedPrayersListBottomSheetProps) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const missedItem = Object.entries(missedSalahList)[index];
    const [key, values] = missedItem;

    return (
      <div
        style={{
          ...style,
          // width: monthsBetween.length === 1 ? "100%" : style.width,
        }}
        className={`bg-[color:var(--card-bg-color)] pb-5 whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
      >
        {values.map((salah) => {
          return (
            <>
              <div
                onClick={() => {
                  console.log(key, salah);
                }}
                className="flex justify-between px-4 py-8 m-3 bg-gray-800 rounded-2xl"
              >
                <div>{createLocalisedDate(key)[1]}</div>
                <div>{salah}</div>
                <button>{"Mark as late"}</button>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <section>
      {" "}
      <Sheet
        isOpen={showMissedPrayersSheet}
        onClose={() => setShowMissedPrayersSheet(false)}
        // onClose={() => false}
        detent="full-height"
        disableDrag={true}
      >
        <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Header />
          <Sheet.Content>
            {" "}
            <Sheet.Scroller>
              <section>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      className=""
                      // ! Re-check the below hardcoded value, could cause issues depending on device size
                      height={1000}
                      itemCount={Object.entries(missedSalahList).length}
                      itemSize={100}
                      layout="vertical"
                      width={width}
                    >
                      {Row}
                    </List>
                  )}
                </AutoSizer>
              </section>{" "}
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setShowMissedPrayersSheet(false)} />
      </Sheet>
    </section>
  );
};

export default MissedPrayersListBottomSheet;
