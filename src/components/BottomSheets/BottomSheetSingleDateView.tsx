// import { useState, useEffect } from "react";

import Sheet from "react-modal-sheet";
// import { GoPerson } from "react-icons/go";
// import { GoPeople } from "react-icons/go";
// import { GoSkip } from "react-icons/go";
// import { PiFlower } from "react-icons/pi";
import { SalahStatus } from "../../types/types";
import { DBConnectionStateType } from "../../types/types";
import { useEffect, useState } from "react";

import { SalahNames } from "../../types/types";
import { prayerStatusColorsHexCodes } from "../../utils/prayerStatusColors";

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
    salahName: SalahNames;
    salahStatus: SalahStatus;
    notes: string;
    reasons: string;
  }

  const [clickedDateData, setClickedDateData] = useState<clickedDateObj[]>([]);

  const prayerNamesOrder: SalahNames[] = [
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
    <div className="">
      <Sheet
        // style={{ backgroundColor: "rgb(33, 36, 38)" }}
        isOpen={showDailySalahDataModal}
        tweenConfig={{ ease: "easeOut", duration: 0.3 }} // Adjust duration to slow down or speed up the animation
        onClose={() => {
          setShowDailySalahDataModal(false);
        }}
      >
        <Sheet.Container>
          <Sheet.Header style={{ backgroundColor: "rgb(33, 36, 38)" }} />
          <Sheet.Content style={{ backgroundColor: "rgb(33, 36, 38)" }}>
            <Sheet.Scroller>
              <section className="mx-5 sheet-content-wrap">
                {clickedDateData.map((item) => {
                  return (
                    <>
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
                          {item.salahStatus}
                        </div>
                      </div>
                      <div className="border-[var(--border-bottom-color)] border-b pb-10 mb-10">
                        <div className="my-3">Reasons: {item.reasons}</div>
                        <div>Notes: {item.notes}</div>
                      </div>
                    </>
                  );
                })}
              </section>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>

        {/* <Sheet.Backdrop onTap={close} /> */}
      </Sheet>
    </div>
  );
};

export default BottomSheetSingleDateView;

{
  /* {clickedDateData.map((item) => {
                  console.log(
                    "🚀 ~ {clickedDateData.map ~ item:",
                    item.salahName
                  );

                  datesExists = false; */
}
//   return (
//     <div
//       key={uuidv4()}
//       className="text-white py-2 m-5 salah-name-status-notes-and-reasons-wrap border-[var(--border-bottom-color)] border-b"
//     >
//       <div className="flex items-center justify-around mb-6 salah-name-and-icon-wrap">
//         <h2 className="w-2/3 text-xl">{item.salahName}</h2>
//         <div className="flex w-full">
//           {item.completedDates.map((item) => {
//             const storedDate = Object.keys(item)[0];
//             const status = item[storedDate].status;
//             console.log(Object.keys(item));

//             if (status === "group") {
//               return (
//                 <div
//                   key={uuidv4()}
//                   className={`${iconStyles} bg-[color:var(--jamaah-status-color)]`}
//                 >
//                   <GoPeople />{" "}
//                   <p className="ml-2">Prayed in Jamaah</p>
//                 </div>
//               );
//             } else if (status === "male-alone") {
//               return (
//                 <div
//                   key={uuidv4()}
//                   className={`${iconStyles} bg-[color:var(--alone-male-status-color)]`}
//                 >
//                   <GoPerson />
//                   <p className="ml-2">Prayed Alone</p>
//                 </div>
//               );
//             } else if (status === "female-alone") {
//               return (
//                 <div
//                   key={uuidv4()}
//                   className={`${iconStyles} bg-[color:var(--alone-female-status-color)]`}
//                 >
//                   <GoPerson />
//                   <p className="ml-2">Prayed Alone</p>
//                 </div>
//               );
//             } else if (status === "late") {
//               return (
//                 <div
//                   key={uuidv4()}
//                   className={`${iconStyles} bg-[color:var(--late-status-color)]`}
//                 >
//                   {" "}
//                   <GoSkip /> <p className="ml-2">Prayed late</p>
//                 </div>
//               );
//             } else if (status === "missed") {
//               return (
//                 <div
//                   key={uuidv4()}
//                   className={`${iconStyles} bg-[color:var(--missed-status-color)]`}
//                 >
//                   <GoSkip /> <p className="ml-2">Missed</p>
//                 </div>
//               );
//             } else if (status === "excused") {
//               return (
//                 <div
//                   key={uuidv4()}
//                   className={`${iconStyles} bg-[color:var(--excused-status-color)]`}
//                 >
//                   {" "}
//                   <PiFlower /> <p className="ml-2">Excused</p>
//                 </div>
//               );
//             }
//           })}
//           {datesExists === false ? (
//             <div
//               key={uuidv4()}
//               className={`${iconStyles} bg-gray-600`}
//             >
//               {" "}
//               <p className="ml-2">No Status Provided</p>
//             </div>
//           ) : null}
//         </div>
//       </div>
//       <div>
//         <p className="text-sm">
//           {item.completedDates.map((item) =>
//             Object.keys(item)[0] === clickedDate &&
//             item[Object.keys(item)[0]].reasons.length > 0
//               ? "Reason(s): " +
//                 item[Object.keys(item)[0]].reasons.join(", ")
//               : null
//           )}
//         </p>
//       </div>
//       <p className="text-sm">
//         {item.completedDates.map((item) =>
//           Object.keys(item)[0] === clickedDate &&
//           item[Object.keys(item)[0]].notes.length > 0
//             ? "Notes: " + item[Object.keys(item)[0]].notes
//             : null
//         )}
//       </p>
//     </div>
//   );
// })}
