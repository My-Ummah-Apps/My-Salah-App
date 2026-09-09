import { format } from "date-fns";
import { BestMonthStatsType } from "../../types/types";
import { salahStatusColorsHexCodes } from "../../utils/constants";

interface BestMonthCardPropsType {
  bestMonth: BestMonthStatsType;
  selectedYear: number;
  userGender: string;
}

const BestMonthCard = ({
  bestMonth,
  selectedYear,
  userGender,
}: BestMonthCardPropsType) => {
  const isMale = userGender === "male";
  const monthName = format(
    new Date(selectedYear, bestMonth.monthIndex, 1),
    "MMMM",
  );

  return (
    <section className="flex items-center justify-between px-3 py-3 mb-4 bg-[var(--card-bg-color)] rounded-xl">
      <div>
        <p className="text-[10px] font-semibold tracking-wide uppercase opacity-60">
          {isMale ? "Highest Jamaah month" : "Most consistent month"}
        </p>
        <p className="mt-1 font-semibold">{monthName}</p>
      </div>

      <div className="text-right">
        <p
          className="font-semibold"
          style={{ color: salahStatusColorsHexCodes.group }}
        >
          {Math.round(bestMonth.percentage)}%
        </p>
        <p className="mt-1 text-[10px] opacity-60">
          {isMale ? "in Jamaah" : "prayed on time"}
        </p>
      </div>
    </section>
  );
};

export default BestMonthCard;
