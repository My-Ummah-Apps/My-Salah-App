const StreakCounter = () => {
  return (
    <>
      <div className={`mb-10 streak-wrap `}>
        <div className="relative flex items-center justify-center wreath-and-text-wrap">
          <img
            style={{ width: "150px", marginRight: "-4rem" }}
            src="/src/assets/icons/wreath-left.png"
            alt=""
            srcSet=""
          />
          <div className="absolute">
            <h1 className="mb-1 text-4xl font-extrabold text-center">
              {"1 Days"}
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
    </>
  );
};

export default StreakCounter;
