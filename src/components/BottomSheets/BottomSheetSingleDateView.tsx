// import { useState, useEffect } from "react";

import Sheet from "react-modal-sheet";
// import { GoPerson } from "react-icons/go";
// import { GoPeople } from "react-icons/go";
// import { GoSkip } from "react-icons/go";
// import { PiFlower } from "react-icons/pi";
import { SalahStatusType } from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import { useEffect, useState } from "react";

import { SalahNamesType } from "../../types/types";
import {
  prayerStatusColorsHexCodes,
  reasonsStyles,
} from "../../utils/constants";
import { sheetHeaderHeight, TWEEN_CONFIG } from "../../utils/constants";
import format from "date-fns/format";

interface BottomSheetSingleDateViewProps {
  dbConnection: any;
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
  //
  interface clickedDateObj {
    date: string;
    id: number | null;
    salahName: SalahNamesType;
    salahStatus: SalahStatusType;
    notes: string;
    reasons: string;
  }

  console.log("BOTTOM SINGLE DATE SHEET HAS RENDERED");

  const [clickedDateData, setClickedDateData] = useState<clickedDateObj[]>([]);

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
    console.log("YO ", clickedDate);

    try {
      await checkAndOpenOrCloseDBConnection("open");
      // formatDateWithOrdinal(clickedDate);
      const query = `SELECT * FROM salahDataTable WHERE date = ?`;
      const data = await dbConnection.current.query(query, [clickedDate]);

      const sortedData: clickedDateObj[] = data.values.sort(
        (a: clickedDateObj, b: clickedDateObj) => {
          prayerNamesOrder.indexOf(a.salahName) -
            prayerNamesOrder.indexOf(b.salahName);
        }
      );

      console.log("DATA: ", data.values);

      const placeholderData: clickedDateObj[] = prayerNamesOrder.map(
        (salah) => {
          // console.log("🚀 ~ placeholderData ~ item:", salah);
          // console.log("🚀 ~ clickedDateData ~ clickedDateData:", clickedDateData);
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
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (clickedDate) {
      grabSingleDateData(clickedDate);
    }
    // formatDateWithOrdinal(clickedDate);
    // setClickedDateData(placeholderData);
    // console.log("🚀 ~ useEffect ~ placeholderData:", placeholderData);
  }, [clickedDate]);

  return (
    <Sheet
      // style={{ backgroundColor: "rgb(33, 36, 38)" }}
      isOpen={showDailySalahDataModal}
      // tweenConfig={{ ease: "easeOut", duration: 0.3 }}
      tweenConfig={TWEEN_CONFIG}
      onClose={() => {
        setShowDailySalahDataModal(false);
      }}
    >
      <Sheet.Container>
        <Sheet.Header style={sheetHeaderHeight} />
        <Sheet.Content style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Scroller>
            <section className="mx-5 text-white mb-14 sheet-content-wrap">
              <h1 className="py-5 text-2xl text-center">
                {clickedDate ? formatDateWithOrdinal(clickedDate) : null}
              </h1>
              {clickedDateData.map((item) => {
                return (
                  <div
                    key={item.date + item.salahName}
                    // style={{
                    //   backgroundColor:
                    //     prayerStatusColorsHexCodes[item.salahStatus],
                    // }}
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
                          "capitalize-first-letter w-4/12 rounded-xl p-2 text-center"
                        }
                      >
                        {item.salahStatus === "group"
                          ? "In Jamaah"
                          : item.salahStatus === "male-alone"
                          ? "On Time"
                          : item.salahStatus === "female-alone"
                          ? "prayed"
                          : item.salahStatus || "No Data"}
                        {/* {item.salahStatus === "group" ? (
                          <GoPeople
                            style={{
                              color:
                                prayerStatusColorsHexCodes[item.salahStatus],
                              fontSize: "2rem",
                            }}
                          />
                        ) : item.salahStatus === "female-alone" ? (
                          "prayed"
                        ) : (
                          item.salahStatus || "No Data"
                        )} */}
                      </div>
                    </div>
                    {item.reasons.length > 0 && (
                      // <section className="mb-2 text-sm">
                      <div className="flex flex-wrap items-center">
                        <p className="pr-2 my-3 text-sm">Reason/s: </p>
                        {item.reasons
                          .split(",")
                          .filter((reason) => reason.length > 0)
                          .sort()
                          .map(
                            (reason) => (
                              // reason.length > 0 && (
                              <p
                                // style={{
                                //   backgroundColor:
                                //     prayerStatusColorsHexCodes[
                                //       item.salahStatus
                                //     ],
                                // }}
                                className={`${reasonsStyles}`}
                              >
                                {reason}
                              </p>
                            )
                            // )
                          )}
                      </div>
                      // {/* </section> */}
                    )}
                    {item.notes.length > 0 && (
                      <div className="flex pb-3 my-5 text-sm">
                        {/* <p className="pr-2">Notes: </p> */}
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
        // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onTap={() => setShowDailySalahDataModal(false)}
      />
    </Sheet>
  );
};

export default BottomSheetSingleDateView;
