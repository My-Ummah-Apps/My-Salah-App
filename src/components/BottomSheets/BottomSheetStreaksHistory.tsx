import {
  createLocalisedDate,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  salahStatusColorsHexCodes,
} from "../../utils/constants";
import { streakDatesObjType } from "../../types/types";
import { format } from "date-fns";
import { IonContent, IonModal } from "@ionic/react";

interface BottomSheetStreaksHistoryProps {
  setShowStreakHistorySheet: React.Dispatch<React.SetStateAction<boolean>>;
  showStreakHistorySheet: boolean;
  filteredStreakDatesObjectsArr: streakDatesObjType[];
}
const BottomSheetStreaksHistory = ({
  setShowStreakHistorySheet,
  showStreakHistorySheet,
  filteredStreakDatesObjectsArr,
}: BottomSheetStreaksHistoryProps) => {
  return (
    <IonModal
      mode="ios"
      className="modal-height"
      isOpen={showStreakHistorySheet}
      onDidDismiss={() => {
        setShowStreakHistorySheet(false);
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        <section className="mt-10 mb-10">
          <h1 className="mt-0 mb-10 text-2xl text-center">Streaks</h1>

          {/* {filteredStreakDatesObjectsArr.slice(1).map((item, i) => { */}
          {filteredStreakDatesObjectsArr.map((item, i) => {
            return (
              <ul className="px-4 my-3">
                {item.days > 0 && (
                  <li
                    key={i}
                    className="px-2 py-4 rounded-lg bg-[var(--card-bg-color)]"
                  >
                    <section className="flex justify-between">
                      <p>
                        {`${
                          createLocalisedDate(
                            format(item.startDate, "yyyy-MM-dd")
                          )[1]
                        } -
                             ${
                               createLocalisedDate(
                                 format(item.endDate, "yyyy-MM-dd")
                               )[1]
                             }`}
                      </p>

                      <p>
                        {item.days} {item.days !== 1 ? "Days" : "Day"}
                      </p>
                    </section>
                    {item.excusedDays > 0 && (
                      <section className="flex items-center mt-1">
                        <p
                          style={{
                            backgroundColor: salahStatusColorsHexCodes.excused,
                          }}
                          className="w-[10px] h-[10px] rounded-sm mr-1"
                        ></p>
                        <p
                          style={
                            {
                              "--excused-color":
                                salahStatusColorsHexCodes.excused,
                            } as React.CSSProperties
                          }
                          className="text-xs"
                        >
                          Excused Days: {item.excusedDays}
                        </p>
                      </section>
                    )}
                  </li>
                )}
              </ul>
            );
          })}
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetStreaksHistory;
