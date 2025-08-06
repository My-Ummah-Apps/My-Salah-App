// import { FixedSizeList as List } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";

import {
  DBConnectionStateType,
  SalahByDateObjType,
  restructuredMissedSalahListProp,
  SalahNamesType,
  SalahRecordsArrayType,
} from "../../types/types";
import {
  createLocalisedDate,
  //   createLocalisedDate,
  getMissedSalahCount,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  salahStatusColorsHexCodes,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IonButton, IonContent, IonModal } from "@ionic/react";

interface MissedSalahsListBottomSheetProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  // presentingElement: HTMLElement | null;
  setShowMissedSalahsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedSalahsSheet: boolean;
  missedSalahList: SalahByDateObjType;
}

const MissedSalahsListBottomSheet = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  setFetchedSalahData,
  // presentingElement,
  setShowMissedSalahsSheet,
  showMissedSalahsSheet,
  missedSalahList,
}: MissedSalahsListBottomSheetProps) => {
  const [isClickedItem, setIsClickedItem] = useState<string>();
  const [showCompletedMsg, setShowCompletedMsg] = useState(false);

  useEffect(() => {
    if (!showMissedSalahsSheet) return;

    const openDBConnection = async () => {
      await checkAndOpenOrCloseDBConnection("open");
    };

    const closeDBConnection = async () => {
      await checkAndOpenOrCloseDBConnection("close");
    };

    openDBConnection();

    return () => {
      closeDBConnection();
    };
  }, [showMissedSalahsSheet]);

  const restructuredMissedSalahList: restructuredMissedSalahListProp[] = [];
  for (let obj in missedSalahList) {
    missedSalahList[obj].forEach((item) => {
      restructuredMissedSalahList.push({ [obj]: item });
    });
  }

  const modifySalahStatusInDB = async (
    date: string,
    salahName: SalahNamesType
  ) => {
    const query = `UPDATE salahDataTable SET salahStatus = ? WHERE date = ? AND salahName = ?`;
    const values = ["late", date, salahName];
    if (!dbConnection.current) {
      throw new Error("dbConnection.current does not exist");
    }
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
  };

  useEffect(() => {
    if (restructuredMissedSalahList.length === 0) {
      setShowCompletedMsg(true);
    }

    // return () => {
    //   setShowCompletedMsg(false);
    // };
  }, [restructuredMissedSalahList]);

  return (
    <IonModal
      // presentingElement={presentingElement}
      mode="ios"
      className="modal-height"
      isOpen={showMissedSalahsSheet}
      onWillPresent={() => {
        setShowCompletedMsg(false);
      }}
      onDidDismiss={() => {
        setShowMissedSalahsSheet(false);
        setShowCompletedMsg(false);
        setIsClickedItem("");
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent className="relative">
        <section className="mt-10 mb-10 text-white">
          <h1
            className={`mx-2 my-4 text-lg text-center text-[var(--ion-text-color)] ${
              showCompletedMsg ? "invisible" : "visibile"
            }`}
          >
            You have {getMissedSalahCount(missedSalahList)} missed Salah to make
            up
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
                  transition={{
                    delay: 0.3,
                    duration: 0.2,
                    layout: { duration: 0.2 },
                  }}
                  key={`${date}-${salah}`}
                  className={`bg-[color:var(--card-bg-color)] px-4 py-4 mx-3 my-3 rounded-2xl`}
                >
                  <section className="flex items-center justify-between text-[var(--ion-text-color)]">
                    <p>{salah}</p>
                    <div
                      style={{
                        backgroundColor:
                          isClickedItem === `${date}-${salah}`
                            ? salahStatusColorsHexCodes["late"]
                            : salahStatusColorsHexCodes["missed"],
                      }}
                      className={`w-[1.3rem] h-[1.3rem] rounded-md`}
                    ></div>
                  </section>
                  <section
                    style={{ borderTop: "1px solid var(--app-border-color)" }}
                    className="flex items-center justify-between pt-4 mt-4 text-[var(--ion-text-color)]"
                  >
                    {" "}
                    <p className="text-sm opacity-80">
                      {createLocalisedDate(date)[1]}
                    </p>
                    <button
                      className="rounded-full bg-[var(--missed-salah-sheet-btn-color)]"
                      onClick={() => {
                        modifySalahStatusInDB(date, salah);
                        setIsClickedItem(`${date}-${salah}`);
                      }}
                    >
                      <section className="flex items-center justify-between w-full px-3 py-2 text-sm">
                        <p>Mark As Done</p>
                      </section>
                    </button>
                  </section>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {showCompletedMsg && (
            <motion.div
              className="text-center center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.3,
                // layout: { duration: 0.2 },
              }}
            >
              <h2 className="text-lg text-center">You're all caught up</h2>
              <IonButton
                onClick={() => {
                  setShowMissedSalahsSheet(false);
                }}
                className="w-3/4"
              >
                Close
              </IonButton>
            </motion.div>
          )}
        </section>{" "}
      </IonContent>
    </IonModal>
  );
};

export default MissedSalahsListBottomSheet;

// Below is to test what performance is like with a thousand missed salahs being rendered
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
