import { createLocalisedDate } from "../../utils/constants";
import { streakDatesObjType } from "../../types/types";
import wreathLeft from "/src/assets/images/wreath-left.png";
import wreathRight from "/src/assets/images/wreath-right.png";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { GoInfo } from "react-icons/go";
import { Dialog } from "@capacitor/dialog";
import BottomSheetStreaksHistory from "../BottomSheets/BottomSheetStreaksHistory";

interface StreakCounterProps {
  streakDatesObjectsArr: streakDatesObjType[];
  activeStreakCount: number;
  userGender: string;
}

const StreakCounter = ({
  streakDatesObjectsArr,
  activeStreakCount,
  userGender,
}: StreakCounterProps) => {
  const [showStreaksModal, setShowStreaksModal] = useState(false);
  const activeStreakObj = streakDatesObjectsArr.filter(
    (obj) => obj.isActive === true
  )[0];

  const showStreakInfo = async () => {
    await Dialog.alert({
      title: "Streaks Explained",
      message:
        userGender === "male"
          ? `Streaks represent the number of consecutive days you've completed all your Salah, starting from the first day of full completion.

          - Streaks continue if you pray in a group or alone.
          - If you miss a Salah or are late, your streak resets.`
          : `Streaks represent the number of consecutive days you've completed all your Salah, starting from the first day of full completion.
          
          - Streaks continue as long as you pray on time.
          - If you select "Excused", your streak will pause (it won't break, but it also won't increase).`,
    });
  };

  const hasStreakDays = streakDatesObjectsArr.some((obj) => obj.days > 0);

  const filteredStreakDatesObjectsArr = streakDatesObjectsArr.filter(
    (obj) => obj.startDate.getTime() !== obj.endDate.getTime()
  );

  return (
    <>
      <div className={`mb-5 bg-[color:var(--card-bg-color)] rounded-2xl`}>
        <section className="flex items-center justify-between p-2 text-xs">
          <div>
            {activeStreakObj && activeStreakObj.days > 0 && (
              <p className="">
                {`${
                  createLocalisedDate(
                    format(activeStreakObj.startDate, "yyyy-MM-dd")
                  )[1]
                } ${
                  !isSameDay(activeStreakObj.startDate, activeStreakObj.endDate)
                    ? `- ${
                        createLocalisedDate(
                          format(activeStreakObj.endDate, "yyyy-MM-dd")
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
              {activeStreakCount} {activeStreakCount !== 1 ? "Days" : "Day"}
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
        {hasStreakDays && filteredStreakDatesObjectsArr.length > 1 && (
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
      <BottomSheetStreaksHistory
        setShowStreaksModal={setShowStreaksModal}
        showStreaksModal={showStreaksModal}
        filteredStreakDatesObjectsArr={filteredStreakDatesObjectsArr}
      />
    </>
  );
};

export default StreakCounter;
