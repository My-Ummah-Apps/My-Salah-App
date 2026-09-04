import { endOfMonth, getYear, isAfter, isBefore, parseISO } from "date-fns";
import { SalahNamesType, SalahRecordsArrayType } from "../../types/types";

interface YearlyStatsProps {
  fetchedSalahData: SalahRecordsArrayType;
  selectedYear: number;
  statsToShow: Exclude<SalahNamesType, "Asar"> | "All";
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
  statsToShow,
  userStartDateParsed,
  todaysDate,
}: YearlyStatsProps) => {
  const selectedYearSalahData = fetchedSalahData.filter(
    (item) => getYear(parseISO(item.date)) === selectedYear,
  );

  const salahName = statsToShow === "Asr" ? "Asar" : statsToShow;

  const selectedYearAndSalahData = selectedYearSalahData.map((item) => ({
    date: item.date,
    statuses:
      salahName === "All"
        ? [
            item.salahs.Fajr,
            item.salahs.Dhuhr,
            item.salahs.Asar,
            item.salahs.Maghrib,
            item.salahs.Isha,
          ]
        : [item.salahs[salahName]],
  }));

  return (
    <section
      aria-label={`${selectedYear} ${statsToShow} monthly statistics, ${selectedYearAndSalahData.length} records`}
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
