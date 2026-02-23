import { FixedSizeList as List } from "react-window";

import {
  SalahByDateObjType,
  restructuredMissedSalahListProp,
  SalahNamesType,
  SalahRecordsArrayType,
} from "../../types/types";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  salahStatusColorsHexCodes,
} from "../../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

import { useEffect, useState } from "react";
import { IonButton, IonContent, IonModal } from "@ionic/react";
import { toggleDBConnection } from "../../utils/dbUtils";
import { createLocalisedDate, getMissedSalahCount } from "../../utils/helpers";
import { AutoSizer } from "react-virtualized";
import { motion } from "framer-motion";

interface MissedSalahsListBottomSheetProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;

  setShowMissedSalahsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedSalahsSheet: boolean;
  missedSalahList: SalahByDateObjType;
}

const MissedSalahsListBottomSheet = ({
  dbConnection,
  setFetchedSalahData,
  setShowMissedSalahsSheet,
  showMissedSalahsSheet,
  missedSalahList,
}: MissedSalahsListBottomSheetProps) => {
  const [isClickedItem, setIsClickedItem] = useState<string>();
  const [showCompletedMsg, setShowCompletedMsg] = useState(false);

  useEffect(() => {
    if (!showMissedSalahsSheet) return;

    const openDBConnection = async () => {
      await toggleDBConnection(dbConnection, "open");
    };

    const closeDBConnection = async () => {
      await toggleDBConnection(dbConnection, "close");
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
    salahName: SalahNamesType,
  ) => {
    const query = `UPDATE salahDataTable SET salahStatus = ? WHERE date = ? AND salahName = ?`;
    const values = ["late", date, salahName];
    if (!dbConnection.current) {
      throw new Error("dbConnection.current does not exist");
    }
    await dbConnection.current.run(query, values);

    setTimeout(() => {
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
    }, 500);
  };

  useEffect(() => {
    if (restructuredMissedSalahList.length === 0) {
      setShowCompletedMsg(true);
    }

    // return () => {
    //   setShowCompletedMsg(false);
    // };
  }, [restructuredMissedSalahList]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = restructuredMissedSalahList[index];
    const date = Object.keys(item)[0];
    const salah = Object.values(item)[0];
    const key = `${date}-${salah}`;

    return (
      <div
        key={key}
        style={style}
        className="bg-[var(--card-bg-color)] px-4 my-3 rounded-2xl border border-[var(--app-border-color)]"
      >
        <section className="flex items-center justify-between text-[var(--ion-text-color)] py-3">
          <p>{salah}</p>
          <div
            style={{
              backgroundColor:
                isClickedItem === key
                  ? salahStatusColorsHexCodes["late"]
                  : salahStatusColorsHexCodes["missed"],
              transition: "background-color 250ms ease",
            }}
            className="w-[1.3rem] h-[1.3rem] rounded-md"
          />
        </section>
        <section
          // style={{ borderBottom: "1px solid var(--app-border-color)" }}
          className="flex items-center justify-between text-[var(--ion-text-color)]"
        >
          <p className="text-sm opacity-80">{createLocalisedDate(date)[1]}</p>
          <button
            className="rounded-full bg-[var(--missed-salah-sheet-btn-color)]"
            onClick={async () => {
              setIsClickedItem(key);
              await modifySalahStatusInDB(date, salah);
            }}
          >
            <section className="flex items-center justify-between w-full px-3 py-2 text-sm">
              <p>Mark As Done</p>
            </section>
          </button>
        </section>
      </div>
    );
  };

  return (
    <IonModal
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

          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                height={800}
                width={width}
                itemCount={restructuredMissedSalahList.length}
                itemSize={105}
              >
                {Row}
              </List>
            )}
          </AutoSizer>

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
