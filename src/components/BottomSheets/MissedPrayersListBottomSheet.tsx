import Sheet from "react-modal-sheet";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSProperties } from "react";
import {
  DBConnectionStateType,
  MissedSalahObjType,
  SalahNamesType,
} from "../../types/types";
import {
  createLocalisedDate,
  getMissedSalahCount,
  prayerStatusColorsHexCodes,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface MissedPrayersListBottomSheetProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setShowMissedPrayersSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedPrayersSheet: boolean;
  setMissedSalahList: React.Dispatch<React.SetStateAction<MissedSalahObjType>>;
  missedSalahList: MissedSalahObjType;
}

const MissedPrayersListBottomSheet = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  missedSalahList,
}: MissedPrayersListBottomSheetProps) => {
  const modifySalahStatusInDB = async (
    date: string,
    salahName: SalahNamesType
  ) => {
    try {
      if (!dbConnection.current) {
        throw new Error("dbConnection.current does not exist");
      }
      await checkAndOpenOrCloseDBConnection("open");
      const query = `UPDATE salahDataTable SET salahStatus = ? WHERE date = ? AND salahName = ?`;
      const values = ["late", date, salahName];
      await dbConnection.current.run(query, values);
    } catch (error) {
      console.error(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const missedItem = Object.entries(missedSalahList)[index];
    const [date, salahs] = missedItem;

    return (
      <div
        style={{
          ...style,
        }}
        className={`bg-[color:var(--card-bg-color)] pb-5 whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
      >
        {salahs.map((salah, index) => {
          return (
            <div
              key={`${date}-${salah}-${index}`}
              onClick={() => {
                console.log(date, salah);
              }}
              className="flex justify-between px-4 py-8 mx-3 my-1 bg-gray-800 rounded-2xl"
            >
              <div>{createLocalisedDate(date)[1]}</div>
              <div>{salah}</div>
              <button
                className="border-2 border-white rounded-md "
                onClick={() => {
                  modifySalahStatusInDB(date, salah);
                }}
              >
                {"Mark as late"}
              </button>
            </div>
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
              <section className="text-white">
                <h1 className="mx-2 my-4 text-2xl text-center">
                  You have {getMissedSalahCount(missedSalahList)} Salah to make
                  up for
                </h1>
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
