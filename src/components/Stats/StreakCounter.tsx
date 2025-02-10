import {
  bottomSheetContainerStyles,
  createLocalisedDate,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import { streakDatesObjType } from "../../types/types";
import Sheet from "react-modal-sheet";
import wreathLeft from "/src/assets/icons/wreath-left.png";
import wreathRight from "/src/assets/icons/wreath-right.png";
import { useState } from "react";

// import { GoInfo } from "react-icons/go";

interface StreakCounterProps {
  streakDatesObjectsArr: streakDatesObjType[];
  activeStreak: number;
}

const StreakCounter = ({
  streakDatesObjectsArr,
  activeStreak,
}: StreakCounterProps) => {
  console.log("streakDatesObjectsArr", streakDatesObjectsArr);
  const [showStreaksModal, setShowStreaksModal] = useState(false);

  return (
    <>
      <div
        className={`relative mb-5 bg-[color:var(--card-bg-color)] rounded-2xl `}
      >
        {/* <p className="absolute top-2 right-2">
        <GoInfo />
      </p> */}
        <div className="relative flex items-center justify-center py-5 wreath-and-text-wrap">
          <img
            style={{ width: "150px", height: "100%", marginRight: "-4rem" }}
            src={wreathLeft}
            alt=""
            srcSet=""
          />
          <div className="absolute -translate-x-1/2 -translate-y-[60%] top-[60%] left-1/2">
            <h1 className="mb-1 text-4xl font-extrabold text-center">
              {activeStreak !== -1 ? activeStreak : 0}{" "}
              {activeStreak !== 1 ? "Days" : "Day"}
            </h1>
            <h2 className="text-xs text-center">Current Streak</h2>
          </div>
          <img
            style={{ width: "150px", height: "100%", marginLeft: "7rem" }}
            src={wreathRight}
            alt=""
            srcSet=""
          />
        </div>
        {streakDatesObjectsArr.length > 0 && (
          <button
            style={{ borderTop: "1px solid rgb(0, 0, 0, 0.2)" }}
            onClick={() => {
              setShowStreaksModal(true);
            }}
            className={`mb-2 pt-2 text-center w-full `}
          >
            <p className="">Show Past Streaks</p>
          </button>
        )}
      </div>
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
                <h1 className="mb-10 text-2xl text-center">Past Streaks</h1>
                {streakDatesObjectsArr.map((item) => {
                  return (
                    <ul className="px-4 my-2">
                      <li className="flex justify-between">
                        <p>
                          {`${createLocalisedDate(item.startDate)[1]} -
                          ${createLocalisedDate(item.endDate)[1]}`}
                        </p>
                        <p>{`${item.days} Days`}</p>
                      </li>
                    </ul>
                  );
                })}
              </section>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          style={sheetBackdropColor}
          // onTap={onSheetCloseCleanup}
          onTap={() => setShowStreaksModal(false)}
        />
      </Sheet>
    </>
  );
};

export default StreakCounter;
