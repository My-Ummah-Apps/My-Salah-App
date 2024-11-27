import Sheet from "react-modal-sheet";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSProperties } from "react";
import { DBSQLiteValues } from "@capacitor-community/sqlite";
import {
  MissedSalahObjType,
  SalahNamesType,
  SalahRecordsArrayType,
} from "../../types/types";

interface MissedPrayersListBottomSheetProps {
  setShowMissedPrayersSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedPrayersSheet: boolean;
  setMissedSalahList: React.Dispatch<React.SetStateAction<MissedSalahObjType>>;
  missedSalahList: MissedSalahObjType;
}

const MissedPrayersListBottomSheet = ({
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  setMissedSalahList,
  missedSalahList,
}: MissedPrayersListBottomSheetProps) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div
      style={{
        ...style,
        // width: monthsBetween.length === 1 ? "100%" : style.width,
      }}
      className={`bg-[color:var(--card-bg-color)] pb-5 whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
    ></div>
  );

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
                      height={370}
                      itemCount={5}
                      // itemCount
                      itemSize={300}
                      layout="vertical"
                      width={width}
                      direction="rtl"
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
