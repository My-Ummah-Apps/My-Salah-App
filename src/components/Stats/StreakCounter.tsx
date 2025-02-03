import wreathLeft from "/src/assets/icons/wreath-left.png";
import wreathRight from "/src/assets/icons/wreath-right.png";
// import { GoInfo } from "react-icons/go";

interface StreakCounterProps {
  streakCounter: number;
}

const StreakCounter = ({ streakCounter }: StreakCounterProps) => {
  return (
    <div
      className={`relative mb-5 bg-[color:var(--card-bg-color)] rounded-2xl `}
    >
      {/* <p className="absolute top-2 right-2">
        <GoInfo />
      </p> */}
      <div className="relative flex items-center justify-center py-10 wreath-and-text-wrap">
        <img
          style={{ width: "150px", height: "100%", marginRight: "-4rem" }}
          src={wreathLeft}
          alt=""
          srcSet=""
        />
        <div className="absolute -translate-x-1/2 -translate-y-[60%] top-[60%] left-1/2">
          <h1 className="mb-1 text-4xl font-extrabold text-center">
            {streakCounter !== -1 ? streakCounter : 0}{" "}
            {streakCounter !== 1 ? "Days" : "Day"}
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
    </div>
  );
};

export default StreakCounter;
