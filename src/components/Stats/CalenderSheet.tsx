// import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Sheet from "react-modal-sheet";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { GoSkip } from "react-icons/go";
import { PiFlower } from "react-icons/pi";
import { salahTrackingEntryType } from "../../types/types";

const CalenderSheet = ({
  salahTrackingArray,
  showDailySalahDataModal,
  setShowDailySalahDataModal,
  clickedDate,
}: {
  salahTrackingArray: salahTrackingEntryType[];
  showDailySalahDataModal: boolean;
  setShowDailySalahDataModal: React.Dispatch<React.SetStateAction<boolean>>;
  clickedDate: string;
}) => {
  //   const [showDailySalahDataModal, setShowDailySalahDataModal] = useState(false);
  //   const [clickedDate, setClickedDate] = useState<string>("");

  //   useEffect(() => {
  //     setClickedDate(clickedDate);
  //   }, [clickedDate]);

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
              <section className="mb-20 sheet-content-wrap">
                {salahTrackingArray.map((item) => {
                  return (
                    <div
                      key={uuidv4()}
                      className="text-white py-2 m-5 salah-name-status-notes-and-reasons-wrap border-[var(--border-bottom-color)] border-b"
                    >
                      <div className="flex items-center justify-around mb-6 salah-name-and-icon-wrap">
                        <h2 className="w-2/3 text-xl">{item.salahName}</h2>
                        <div className="flex w-full">
                          {item.completedDates.map((item) => {
                            const iconStyles =
                              "grow p-3 icon-and-text-wrap rounded-3xl flex flex-row items-center justify-center";
                            const storedDate = Object.keys(item)[0];
                            const status = item[storedDate].status;
                            console.log(Object.keys(item)[0]);
                            if (item.completedDates) {
                            }

                            if (storedDate === clickedDate) {
                              if (status === "group") {
                                return (
                                  <div
                                    key={uuidv4()}
                                    className={`${iconStyles} bg-[color:var(--jamaah-status-color)]`}
                                  >
                                    <GoPeople />{" "}
                                    <p className="ml-2">Prayed in Jamaah</p>
                                  </div>
                                );
                              } else if (status === "male-alone") {
                                return (
                                  <div
                                    key={uuidv4()}
                                    className={`${iconStyles} bg-[color:var(--alone-male-status-color)]`}
                                  >
                                    <GoPerson />
                                    <p className="ml-2">Prayed Alone</p>
                                  </div>
                                );
                              } else if (status === "female-alone") {
                                return (
                                  <div
                                    key={uuidv4()}
                                    className={`${iconStyles} bg-[color:var(--alone-female-status-color)]`}
                                  >
                                    <GoPerson />
                                    <p className="ml-2">Prayed Alone</p>
                                  </div>
                                );
                              } else if (status === "late") {
                                return (
                                  <div
                                    key={uuidv4()}
                                    className={`${iconStyles} bg-[color:var(--late-status-color)]`}
                                  >
                                    {" "}
                                    <GoSkip />{" "}
                                    <p className="ml-2">Prayed late</p>
                                  </div>
                                );
                              } else if (status === "missed") {
                                return (
                                  <div
                                    key={uuidv4()}
                                    className={`${iconStyles} bg-[color:var(--missed-status-color)]`}
                                  >
                                    <GoSkip /> <p className="ml-2">Missed</p>
                                  </div>
                                );
                              } else if (status === "excused") {
                                return (
                                  <div
                                    key={uuidv4()}
                                    className={`${iconStyles} bg-[color:var(--excused-status-color)]`}
                                  >
                                    {" "}
                                    <PiFlower /> <p className="ml-2">Excused</p>
                                  </div>
                                );
                              }
                            }
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          {item.completedDates.map((item) =>
                            Object.keys(item)[0] === clickedDate &&
                            item[Object.keys(item)[0]].reasons.length > 0
                              ? "Reason(s): " +
                                item[Object.keys(item)[0]].reasons.join(", ")
                              : null
                          )}
                        </p>
                      </div>
                      <p className="text-sm">
                        {item.completedDates.map((item) =>
                          Object.keys(item)[0] === clickedDate &&
                          item[Object.keys(item)[0]].notes.length > 0
                            ? "Notes: " + item[Object.keys(item)[0]].notes
                            : null
                        )}
                      </p>
                    </div>
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

export default CalenderSheet;
