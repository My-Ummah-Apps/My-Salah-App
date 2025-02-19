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
import { format, isSameDay } from "date-fns";
import { GoInfo } from "react-icons/go";
import { Dialog } from "@capacitor/dialog";

interface StreakCounterProps {
  streakDatesObjectsArr: streakDatesObjType[];
  activeStreak: number;
  userGender: string;
}

const StreakCounter = ({
  streakDatesObjectsArr,
  activeStreak,
  userGender,
}: StreakCounterProps) => {
  console.log("userGender", userGender);
  const [showStreaksModal, setShowStreaksModal] = useState(false);

  const showStreakInfo = async () => {
    await Dialog.alert({
      title: "Streaks Explained",
      message:
        userGender === "male"
          ? `Streaks represent the number of consecutive days you have performed your Salah. 

          - Streaks continue if you pray in a group or alone.
          - If you miss a prayer or are late, your streak resets.`
          : `Streaks represent the number of consecutive days you have performed your Salah. 
          
          - Streaks continue as long as you pray on time.
          - If you select "Excused", your streak will **pause** (it won't break, but it also won't increase).`,
    });
  };

  return (
    <>
      <div className={`mb-5 bg-[color:var(--card-bg-color)] rounded-2xl`}>
        <section className="flex items-center justify-between p-2 text-xs">
          <div>
            {activeStreak > 0 && (
              <p className="">
                {`${
                  createLocalisedDate(
                    format(streakDatesObjectsArr[0].startDate, "yyyy-MM-dd")
                  )[1]
                } ${
                  !isSameDay(
                    streakDatesObjectsArr[0].startDate,
                    streakDatesObjectsArr[0].endDate
                  )
                    ? `${
                        createLocalisedDate(
                          format(streakDatesObjectsArr[0].endDate, "yyyy-MM-dd")
                        )[1]
                      }`
                    : ""
                }`}
              </p>
            )}
          </div>
          <p onClick={showStreakInfo} className="">
            <GoInfo />
          </p>
        </section>
        <div className="relative flex items-center justify-center py-5 wreath-and-text-wrap">
          <img
            style={{ width: "150px", height: "100%", marginRight: "-4rem" }}
            src={wreathLeft}
            alt=""
            srcSet=""
          />
          <div className="absolute -translate-x-1/2 -translate-y-[60%] top-[60%] left-1/2">
            <h1 className="mb-1 text-4xl font-extrabold text-center">
              {activeStreak} {activeStreak !== 1 ? "Days" : "Day"}
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
        {streakDatesObjectsArr.length > 1 && (
          <button
            style={{ borderTop: "1px solid rgb(0, 0, 0, 0.2)" }}
            onClick={() => {
              setShowStreaksModal(true);
            }}
            className={`mb-2 pt-2 text-center w-full `}
          >
            <p className="">Show All Streaks</p>
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
                    <ul className="px-4 my-3">
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
          onTap={() => setShowStreaksModal(false)}
        />
      </Sheet>
    </>
  );
};

export default StreakCounter;
