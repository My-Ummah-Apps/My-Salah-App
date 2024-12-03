import Sheet from "react-modal-sheet";
// import { FixedSizeList as List } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";

import { CiCircleCheck } from "react-icons/ci";
import {
  DBConnectionStateType,
  MissedSalahObjType,
  restructuredMissedSalahListProp,
  SalahNamesType,
  SalahRecordsArrayType,
} from "../../types/types";
import {
  createLocalisedDate,
  //   createLocalisedDate,
  getMissedSalahCount,
  isValidDate,
  TWEEN_CONFIG,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { AnimatePresence, motion } from "framer-motion";

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
  //   setSelectedSalahAndDate: React.Dispatch<
  //     React.SetStateAction<SelectedSalahAndDateObjType>
  //   >;
  //   setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomSheetMissedPrayersList = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setShowMissedPrayersSheet,
  showMissedPrayersSheet,
  missedSalahList,
  //   setSelectedSalahAndDate,
  setFetchedSalahData,
}: MissedPrayersListBottomSheetProps) => {
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
    // ? setSelectedSalahAndDate is here because originally the prayer status bottom sheet was being triggered for users to then update the salah status, this has been removed and functionality has been streamlined however leaving this here as this may be added back in at some point as an additional option
    // setSelectedSalahAndDate({ [date]: [salahName] });
    // setShowUpdateStatusModal(true);
    try {
      if (!dbConnection.current) {
        throw new Error("dbConnection.current does not exist");
      }
      if (!isValidDate(date)) {
        throw new Error(
          `Unable to insert into database, date is not valid: ${date}`
        );
      }
      await checkAndOpenOrCloseDBConnection("open");
      const query = `UPDATE salahDataTable SET salahStatus = ? WHERE date = ? AND salahName = ?`;
      const values = ["late", date, salahName];

      await dbConnection.current.run(query, values);

      setFetchedSalahData((prev) => {
        const copy = [...prev];
        for (let i = 0; i < prev.length; i++) {
          if (copy[i].date === date) {
            for (let salah in copy[i].salahs) {
              if (salah === salahName) {
                copy[i].salahs[salah] = "late";
              }
            }
          }
        }
        return copy;
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

  return (
    <section>
      {" "}
      <Sheet
        isOpen={showMissedPrayersSheet}
        onClose={() => setShowMissedPrayersSheet(false)}
        // onClose={() => false}
        detent="full-height"
        tweenConfig={TWEEN_CONFIG}
      >
        <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Header />
          <Sheet.Content>
            {" "}
            <Sheet.Scroller>
              <section className="text-white">
                <h1 className="mx-2 my-4 text-2xl text-center">
                  You have {getMissedSalahCount(missedSalahList)} missed Salah
                  to make up
                </h1>
                <AnimatePresence>
                  {restructuredMissedSalahList.map((item) => {
                    const date = Object.keys(item)[0];
                    const salah = Object.values(item)[0];
                    return (
                      <motion.div
                        layout
                        initial={{ x: 0 }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        key={`${date}-${salah}`}
                        className={`bg-[color:var(--card-bg-color)] flex justify-between items-center px-4 py-8 mx-3 my-3 rounded-2xl`}
                      >
                        <div>{createLocalisedDate(date)[1]}</div>
                        <div>{salah}</div>
                        <button
                          className="rounded-full px-6bg-gray-800"
                          onClick={() => {
                            modifySalahStatusInDB(date, salah);
                          }}
                        >
                          <section className="flex items-center justify-between w-full">
                            <p className="">Prayed</p>
                            <CiCircleCheck className="text-2xl" />{" "}
                          </section>
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </section>{" "}
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setShowMissedPrayersSheet(false)} />
      </Sheet>
    </section>
  );
};

export default BottomSheetMissedPrayersList;

// Below is to test what performance is like with a thousand missed prayers being rendered
//  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

// return (
//     <div>
//       {items.map((_, index) => (
//         <div
//           key={index}
//           style={{ padding: "8px", borderBottom: "1px solid #ccc" }}
//         >
//           <div
//             className="flex justify-between"
//             key={index}
//             style={{
//               padding: "8px",
//               borderBottom: "1px solid #ccc",
//             }}
//           >
//             <div>Date</div>
//             <div>{"salah"}</div>
//             <button
//               className=""
//               onClick={() => {
//                 setIsBeingRemoved(index);
//                 modifySalahStatusInDB(date, salah);
//               }}
//             ></button>
//             <CiCircleCheck className="text-4xl" />{" "}
//           </div>
//         </div>
//       ))}
//     </div>
//     );

// VIRTUALIZED VERSION OF LIST:

//   const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
// const date = Object.keys(restructuredMissedSalahList[index])[0];
// const salah = Object.values(restructuredMissedSalahList[index])[0];
// return (
//   <motion.div
//     layout
//     key={index}
//     initial={{ opacity: 0, x: -50 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: 50 }} // Exit animation
//     transition={{ duration: 0.3 }}
//     ref={rowRef}
//     style={{
//       ...style,
//     }}
//     className={`${
//       isBeingRemoved === index ? "removing-row" : ""
//     } pb-5 whitespace-nowrap box-shadow: 0 25px 50px -12px rgb(31, 35, 36)`}
//   >
//     <div
//       key={`${date}-${index}`}
//       className="bg-[color:var(--card-bg-color)] flex justify-between items-center px-4 py-8 mx-3 my-1 rounded-2xl"
//     >
//       <div>{createLocalisedDate(date)[1]}</div>
//       <div>{salah}</div>
//       <button
//         className=""
//         onClick={() => {
//           setIsBeingRemoved(index);
//           modifySalahStatusInDB(date, salah);
//         }}
//       >
//         <CiCircleCheck className="text-4xl" />{" "}
//       </button>
//     </div>
//   </motion.div>
// );
//   };

// BELOW GOES WITHIN JSX

//    <AnimatePresence>
//                   <AutoSizer disableHeight>
//                     {({ width }) => (
//                       <List
//                         className=""
//                         // ! Re-check the below hardcoded height value, could cause issues depending on device size
//                         height={800}
//                         itemCount={Object.entries(missedSalahList).length}
//                         itemSize={110}
//                         layout="vertical"
//                         width={width}
//                       >
//                         {Row}
//                       </List>
//                     )}
//                   </AutoSizer>
//                 </AnimatePresence>
