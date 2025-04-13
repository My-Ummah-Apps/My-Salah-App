import Sheet from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  createLocalisedDate,
  salahStatusColorsHexCodes,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import { streakDatesObjType } from "../../types/types";
import { format } from "date-fns";

interface BottomSheetStreaksHistoryProps {
  setShowStreaksModal: React.Dispatch<React.SetStateAction<boolean>>;
  showStreaksModal: boolean;
  filteredStreakDatesObjectsArr: streakDatesObjType[];
}
const BottomSheetStreaksHistory = ({
  setShowStreaksModal,
  showStreaksModal,
  filteredStreakDatesObjectsArr,
}: BottomSheetStreaksHistoryProps) => {
  return (
    <Sheet
      disableDrag={false}
      isOpen={showStreaksModal}
      onClose={() => setShowStreaksModal(false)}
      detent="full-height"
      tweenConfig={TWEEN_CONFIG}
    >
      <Sheet.Container style={bottomSheetContainerStyles}>
        <Sheet.Header style={sheetHeaderHeight} />
        <Sheet.Content>
          <Sheet.Scroller>
            <section>
              <h1 className="mb-10 text-2xl text-center">Streaks</h1>

              {/* {filteredStreakDatesObjectsArr.slice(1).map((item, i) => { */}
              {filteredStreakDatesObjectsArr.map((item, i) => {
                return (
                  <ul className="px-4 my-3">
                    {item.days > 0 && (
                      <li
                        key={i}
                        className="px-2 py-4 rounded-lg bg-neutral-800"
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
                                backgroundColor:
                                  salahStatusColorsHexCodes.excused,
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
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowStreaksModal(false)}
      />
    </Sheet>
  );
};

export default BottomSheetStreaksHistory;
