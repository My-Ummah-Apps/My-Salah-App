import { endOfMonth, getYear, isAfter, isBefore, parseISO } from "date-fns";
import { SalahRecordsArrayType } from "../../types/types";

interface YearlyStatsProps {
  fetchedSalahData: SalahRecordsArrayType;
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
  fetchedSalahData,
  selectedYear,
  userStartDateParsed,
  todaysDate,
}: YearlyStatsProps) => {
  const selectedYearSalahData = fetchedSalahData.filter(
    (record) => getYear(parseISO(record.date)) === selectedYear,
  );

  return (
    <section
      aria-label={`${selectedYear} monthly statistics, ${selectedYearSalahData.length} records`}
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
