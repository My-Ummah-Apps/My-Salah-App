interface StreakCounterProps {
  streakCounter: number;
}

const StreakCounter = ({ streakCounter }: StreakCounterProps) => {
  return (
    <div className={`mt-5 mb-5 bg-[color:var(--card-bg-color)] rounded-2xl `}>
      <div className="relative flex items-center justify-center wreath-and-text-wrap">
        <img
          style={{ width: "150px", marginRight: "-4rem" }}
          src="/src/assets/icons/wreath-left.png"
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
          style={{ width: "150px", marginLeft: "7rem" }}
          src="/src/assets/icons/wreath-right.png"
          alt=""
          srcSet=""
        />
      </div>
    </div>
  );
};

export default StreakCounter;
