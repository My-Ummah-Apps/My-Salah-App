import { endOfMonth, isAfter, isBefore } from "date-fns";

interface YearlyStatsProps {
  selectedYear: number;
  userStartDateParsed: Date;
  todaysDate: Date;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YearlyStats = ({
  selectedYear,
  userStartDateParsed,
  todaysDate,
}: YearlyStatsProps) => {
  return (
    <section
      aria-label={`${selectedYear} monthly statistics`}
      className="grid grid-cols-3 gap-3 mt-5"
    >
      {months.map((month, monthIndex) => {
        const monthStart = new Date(selectedYear, monthIndex, 1);
        const monthEnd = endOfMonth(monthStart);
        const isUnavailable =
          isBefore(monthEnd, userStartDateParsed) ||
          isAfter(monthStart, todaysDate);

        return (
          <div
            key={month}
            className={`min-h-20 p-3 text-left bg-[var(--card-bg-color)] rounded-xl ${isUnavailable ? "opacity-30" : ""}`}
          >
            <p className="font-semibold">{month}</p>
          </div>
        );
      })}
    </section>
  );
};

export default YearlyStats;
