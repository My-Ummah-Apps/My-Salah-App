import Sheet from "react-modal-sheet";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSProperties } from "react";
import { CiCircleCheck } from "react-icons/ci";
import {
  DBConnectionStateType,
  MissedSalahObjType,
  restructuredMissedSalahListProp,
  SalahNamesType,
  SalahRecordsArrayType,
  SelectedSalahAndDateObjType,
} from "../../types/types";
import {
  createLocalisedDate,
  getMissedSalahCount,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface MissedPrayersListBottomSheetProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  setShowMissedPrayersSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedPrayersSheet: boolean;
  missedSalahList: MissedSalahObjType;
  setSelectedSalahAndDate: React.Dispatch<
    React.SetStateAction<SelectedSalahAndDateObjType>
  >;
  //   setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MissedPrayersListBottomSheet = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  missedSalahList,
  setSelectedSalahAndDate,
  setFetchedSalahData,
  fetchedSalahData,
}: //   setShowUpdateStatusModal,
MissedPrayersListBottomSheetProps) => {
  const restructuredMissedSalahList: restructuredMissedSalahListProp[] = [];
  for (let obj in missedSalahList) {
    missedSalahList[obj].forEach((item) => {
      restructuredMissedSalahList.push({ [obj]: item });
    });
  }
  console.log("restructuredMissedSalahList: ", restructuredMissedSalahList);

  const modifySalahStatusInDB = async (
    date: string,
    salahName: SalahNamesType
  ) => {
    setSelectedSalahAndDate({ [date]: [salahName] });
    // setShowUpdateStatusModal(true);
    try {
      if (!dbConnection.current) {
        throw new Error("dbConnection.current does not exist");
      }
      await checkAndOpenOrCloseDBConnection("open");
      const query = `UPDATE salahDataTable SET salahStatus = ? WHERE date = ? AND salahName = ?`;
      const values = ["late", date, salahName];
      await dbConnection.current.run(query, values);

      setFetchedSalahData((prev) => {
        const copy = prev;
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].date === date) {
            for (let salah in prev[i].salahs) {
              console.log(salah);
              if (salah === salahName) {
                copy[i].salahs[salah] = "late";
              }
            }
          }
        }
        return [...copy];
      });
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
    const date = Object.keys(restructuredMissedSalahList[index])[0];
    const salah = Object.values(restructuredMissedSalahList[index])[0];
    return (
      <div
        style={{
          ...style,
        }}
        className={` pb-5 whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
      >
        <div
          key={`${date}-${index}`}
          className="bg-[color:var(--card-bg-color)] flex justify-between items-center px-4 py-8 mx-3 my-1 rounded-2xl"
        >
          <div>{createLocalisedDate(date)[1]}</div>
          <div>{salah}</div>
          <button
            className=""
            onClick={() => {
              modifySalahStatusInDB(date, salah);
            }}
          >
            <CiCircleCheck className="text-4xl" />{" "}
          </button>
        </div>

        {/* {salahs.map((salah, index) => {
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
                className=""
                onClick={() => {
                  modifySalahStatusInDB(date, salah);
                }}
              >
                <CiCircleCheck className="text-4xl" />{" "}
              </button>
            </div>
          );
        })} */}
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
                      // ! Re-check the below hardcoded height value, could cause issues depending on device size
                      height={1000}
                      itemCount={Object.entries(missedSalahList).length}
                      itemSize={110}
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
