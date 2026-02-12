import { clickedDateDataObj } from "../../types/types";
import { useEffect, useState } from "react";

import { SalahNamesType } from "../../types/types";
import {
  salahStatusColorsHexCodes,
  reasonsStyles,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import format from "date-fns/format";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { IonContent, IonModal } from "@ionic/react";
import { toggleDBConnection } from "../../utils/dbUtils";

interface BottomSheetSingleDateViewProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  showDailySalahDataModal: boolean;
  setShowDailySalahDataModal: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedDate: React.Dispatch<React.SetStateAction<string>>;
  clickedDate: string;
  statsToShow: SalahNamesType | "All";
}

const BottomSheetSingleDateView = ({
  dbConnection,
  showDailySalahDataModal,
  setShowDailySalahDataModal,
  setClickedDate,
  clickedDate,
  statsToShow,
}: BottomSheetSingleDateViewProps) => {
  const [clickedDateData, setClickedDateData] = useState<clickedDateDataObj[]>(
    [],
  );

  const salahNamesOrder: SalahNamesType[] = [
    "Fajr",
    "Dhuhr",
    "Asar",
    "Maghrib",
    "Isha",
  ];

  const formatDateWithOrdinal = (clickedDate: string) => {
    const date = new Date(clickedDate);
    const formattedDate = format(date, "do MMMM yyyy");
    return formattedDate;
  };

  const grabSingleDateData = async (clickedDate: string) => {
    try {
      await toggleDBConnection(dbConnection, "open");
      const query = `SELECT * FROM salahDataTable WHERE date = ?`;
      const data = await dbConnection.current!.query(query, [clickedDate]);

      const sortedData: clickedDateDataObj[] = data.values!.sort(
        (a: clickedDateDataObj, b: clickedDateDataObj) =>
          salahNamesOrder.indexOf(a.salahName) -
          salahNamesOrder.indexOf(b.salahName),
      );

      const placeholderData: clickedDateDataObj[] = salahNamesOrder.map(
        (salah) => {
          const salahData = sortedData.find((obj) => {
            return obj.salahName === salah;
          });

          if (salahData) {
            return {
              id: null,
              date: clickedDate,
              salahName: salahData.salahName,
              salahStatus: salahData.salahStatus,
              reasons: salahData.reasons,
              notes: salahData.notes,
            };
          } else {
            return {
              id: null,
              date: clickedDate,
              salahName: salah,
              salahStatus: "",
              reasons: "",
              notes: "",
            };
          }
        },
      );

      setClickedDateData(
        statsToShow === "All"
          ? placeholderData
          : placeholderData.filter((item) => item.salahName === statsToShow),
      );
    } catch (error) {
      console.error(error);
    } finally {
      await toggleDBConnection(dbConnection, "close");
    }
  };

  useEffect(() => {
    if (clickedDate) {
      grabSingleDateData(clickedDate);
    }
  }, [clickedDate]);

  return (
    <IonModal
      mode="ios"
      className="modal-height"
      isOpen={showDailySalahDataModal}
      onDidDismiss={() => {
        setShowDailySalahDataModal(false);
        setClickedDate("");
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        <section className="mx-5 text-white mb-14 sheet-content-wrap">
          <h1 className="py-5 text-2xl text-center text-[var(--ion-text-color)]">
            {clickedDate ? formatDateWithOrdinal(clickedDate) : null}
          </h1>

          {clickedDateData.map((item) => {
            return (
              <div
                key={item.date + item.salahName}
                className="p-2 mb-5 border-[var(--app-border-color)] border-b"
              >
                <div className="flex items-center justify-between my-5">
                  <div
                    style={{
                      borderLeft: `3px solid ${
                        salahStatusColorsHexCodes[item.salahStatus]
                      }`,
                    }}
                    className="w-1/2 px-2 py-1 text-lg text-[var(--ion-text-color)]"
                  >
                    {item.salahName === "Asar" ? "Asr" : item.salahName}
                  </div>
                  <div
                    style={{
                      backgroundColor:
                        salahStatusColorsHexCodes[item.salahStatus],
                    }}
                    className={
                      "capitalize-first-letter w-4/12 rounded-3xl p-2 text-center"
                    }
                  >
                    {item.salahStatus === "group"
                      ? "In Jamaah"
                      : item.salahStatus === "male-alone"
                        ? "On Time"
                        : item.salahStatus === "female-alone"
                          ? "prayed"
                          : item.salahStatus || "No Data"}
                  </div>
                </div>
                {item.reasons.length > 0 && (
                  <div className="flex flex-wrap items-center text-[var(--ion-text-color)]">
                    <p className="pr-2 my-3 text-sm">
                      {item.reasons.split(",").length > 1
                        ? "Reasons: "
                        : "Reason: "}{" "}
                    </p>
                    {item.reasons
                      .split(",")
                      .filter((reason) => reason.length > 0)
                      .sort()
                      .map((reason) => (
                        <p
                          key={reason}
                          className={`${reasonsStyles} "bg-red-500"`}
                        >
                          {reason}
                        </p>
                      ))}
                  </div>
                )}

                {item.notes.length > 0 && (
                  <div className="flex pb-3 my-5 text-sm text-[var(--ion-text-color)]">
                    <p className="pr-2">Notes: </p>
                    <p className="max-w-full break-words">{item.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetSingleDateView;
