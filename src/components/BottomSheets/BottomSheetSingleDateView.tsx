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
import { prayerStatusColorsHexCodes } from "../../utils/constants";
import { sheetHeaderHeight, TWEEN_CONFIG } from "../../utils/constants";

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

  const [clickedDateData, setClickedDateData] = useState<clickedDateObj[]>([]);

  const prayerNamesOrder: SalahNamesType[] = [
    "Fajr",
    "Dhuhr",
    "Asar",
    "Maghrib",
    "Isha",
  ];

  const grabSingleDateData = async (clickedDate: string) => {
    try {
      await checkAndOpenOrCloseDBConnection("open");

      const query = "SELECT * FROM salahDataTable WHERE date = ?";
      const data = await dbConnection.current.query(query, [clickedDate]);

      const sortedData: clickedDateObj[] = data.values.sort(
        (a: clickedDateObj, b: clickedDateObj) => {
          prayerNamesOrder.indexOf(a.salahName) -
            prayerNamesOrder.indexOf(b.salahName);
        }
      );

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
    grabSingleDateData(clickedDate);
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
        <Sheet.Header
          style={{ ...sheetHeaderHeight, backgroundColor: "rgb(33, 36, 38)" }}
        />
        <Sheet.Content style={{ backgroundColor: "rgb(33, 36, 38)" }}>
          <Sheet.Scroller>
            <section className="mx-5 sheet-content-wrap">
              {clickedDateData.map((item) => {
                return (
                  <div key={item.date + item.salahName}>
                    <div className="flex items-center justify-between my-5">
                      <div className="w-1/2 text-lg text-white">
                        {item.salahName}
                      </div>
                      <div
                        style={{
                          backgroundColor:
                            prayerStatusColorsHexCodes[item.salahStatus],
                        }}
                        className={
                          "px-2 py-3 rounded-2xl text-white grow icon-and-text-wrap flex flex-row items-center justify-center w-1/2"
                        }
                      >
                        {item.salahStatus || "No Data"}
                      </div>
                    </div>
                    <div className="border-[var(--border-bottom-color)] border-b pb-10 mb-10">
                      <div className="my-3">Reasons: {item.reasons}</div>
                      <div>Notes: {item.notes}</div>
                    </div>
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
