import Sheet from "react-modal-sheet";
import { clickedDateDataObj } from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import { useEffect, useState } from "react";

import { SalahNamesType } from "../../types/types";
import {
  bottomSheetContainerStyles,
  prayerStatusColorsHexCodes,
  reasonsStyles,
  sheetBackdropColor,
} from "../../utils/constants";
import { sheetHeaderHeight, TWEEN_CONFIG } from "../../utils/constants";
import format from "date-fns/format";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface BottomSheetSingleDateViewProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  showDailySalahDataModal: boolean;
  setShowDailySalahDataModal: React.Dispatch<React.SetStateAction<boolean>>;
  clickedDate: string;
}

const BottomSheetSingleDateView = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  showDailySalahDataModal,
  setShowDailySalahDataModal,
  clickedDate,
}: BottomSheetSingleDateViewProps) => {
  const [clickedDateData, setClickedDateData] = useState<clickedDateDataObj[]>(
    []
  );

  const prayerNamesOrder: SalahNamesType[] = [
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
      await checkAndOpenOrCloseDBConnection("open");
      const query = `SELECT * FROM salahDataTable WHERE date = ?`;
      const data = await dbConnection.current!.query(query, [clickedDate]);

      const sortedData: clickedDateDataObj[] = data.values!.sort(
        (a: clickedDateDataObj, b: clickedDateDataObj) =>
          prayerNamesOrder.indexOf(a.salahName) -
          prayerNamesOrder.indexOf(b.salahName)
      );

      const placeholderData: clickedDateDataObj[] = prayerNamesOrder.map(
        (salah) => {
          const dataCheck = sortedData.find((obj) => {
            return obj.salahName === salah;
          });

          if (dataCheck) {
            return {
              id: null,
              date: clickedDate,
              salahName: dataCheck.salahName,
              salahStatus: dataCheck.salahStatus,
              reasons: dataCheck.reasons,
              notes: dataCheck.notes,
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
        }
      );

      setClickedDateData(placeholderData);
    } catch (error) {
      console.error(error);
    } finally {
      await checkAndOpenOrCloseDBConnection("close");
    }
  };

  useEffect(() => {
    if (clickedDate) {
      grabSingleDateData(clickedDate);
    }
  }, [clickedDate]);

  return (
    <Sheet
      isOpen={showDailySalahDataModal}
      tweenConfig={TWEEN_CONFIG}
      onClose={() => {
        setShowDailySalahDataModal(false);
      }}
    >
      <Sheet.Container style={bottomSheetContainerStyles}>
        <Sheet.Header style={sheetHeaderHeight} />
        <Sheet.Content style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Scroller>
            <section className="mx-5 text-white mb-14 sheet-content-wrap">
              <h1 className="py-5 text-2xl text-center">
                {clickedDate ? formatDateWithOrdinal(clickedDate) : null}
              </h1>
              {clickedDateData.map((item) => {
                console.log(item.reasons.split(","));

                return (
                  <div
                    key={item.date + item.salahName}
                    className="p-2 mb-5  border-[var(--border-bottom-color)] border-b"
                  >
                    <div className="flex items-center justify-between my-5">
                      <div
                        style={{
                          borderLeft: `3px solid ${
                            prayerStatusColorsHexCodes[item.salahStatus]
                          }`,
                        }}
                        className="w-1/2 px-2 py-1 text-lg text-white"
                      >
                        {item.salahName}
                      </div>
                      <div
                        style={{
                          backgroundColor:
                            prayerStatusColorsHexCodes[item.salahStatus],
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
                      <div className="flex flex-wrap items-center">
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
                            <p key={reason} className={`${reasonsStyles}`}>
                              {reason}
                            </p>
                          ))}
                      </div>
                    )}
                    {item.notes.length > 0 && (
                      <div className="flex pb-3 my-5 text-sm">
                        <p className="pr-2">Notes: </p>
                        <p className="max-w-full break-words">{item.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowDailySalahDataModal(false)}
      />
    </Sheet>
  );
};

export default BottomSheetSingleDateView;
