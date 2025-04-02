import Sheet from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  createLocalisedDate,
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
      <Sheet.Container
        // className="react-modal-sheet-container"
        style={bottomSheetContainerStyles}
      >
        <Sheet.Header style={sheetHeaderHeight} />
        <Sheet.Content>
          <Sheet.Scroller>
            <section>
              <h1 className="mb-10 text-2xl text-center">Streaks</h1>
              {filteredStreakDatesObjectsArr.slice(1).map((item) => {
                return (
                  <ul className="px-4 my-3">
                    {item.days > 0 && (
                      <li className="flex justify-between px-2 py-4 rounded-lg bg-neutral-800">
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
