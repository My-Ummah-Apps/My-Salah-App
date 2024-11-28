import Sheet from "react-modal-sheet";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSProperties } from "react";
import { MissedSalahObjType } from "../../types/types";

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
  console.log("MISSED SALAH LIST: ", missedSalahList);
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const missedItem = Object.entries(missedSalahList)[index];
    console.log("MISSED ITEM: ", missedItem);

    return (
      <div
        style={{
          ...style,
          // width: monthsBetween.length === 1 ? "100%" : style.width,
        }}
        className={`bg-[color:var(--card-bg-color)] pb-5 whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
      >
        {Object.entries(missedSalahList).map((obj) => {
          //   console.log(obj);
          return (
            <>
              <div className="flex justify-between px-4 py-8 m-3 bg-gray-800 rounded-2xl">
                <div>{missedItem}</div>
                {/* <div>{obj[1][index]}</div> */}
                <button>{"Mark as late"}</button>
              </div>

              {/* {obj[1].map((item, index) => {
                return (
                  <div className="flex justify-between px-4 py-8 m-3 bg-gray-800 rounded-2xl">
                    <div>{obj[0]}</div>
                    <div>{obj[1][index]}</div>
                    <button>{"Mark as late"}</button>
                  </div>
                );
              })} */}
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
                      // style={{ borderRadius: "0.5rem" }}
                      className=""
                      // height={330}
                      // ! Re-check the below hardcoded value, could cause issues depending on device size
                      height={500}
                      itemCount={Object.entries(missedSalahList).length}
                      // itemCount
                      itemSize={300}
                      layout="vertical"
                      width={width}
                      //   direction="rtl"
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
