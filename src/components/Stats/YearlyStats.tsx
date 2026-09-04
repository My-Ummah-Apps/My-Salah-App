import { endOfMonth, getMonth, getYear, isAfter, isBefore, parseISO } from "date-fns";
import { SalahNamesType, SalahRecordsArrayType, SalahStatusType } from "../../types/types";

interface YearlyStatsProps {
  fetchedSalahData: SalahRecordsArrayType;
  selectedYear: number;
  statsToShow: Exclude<SalahNamesType, "Asar"> | "All";
  userStartDateParsed: Date;
  todaysDate: Date;
}

interface MonthlySalahData {
  month: string;
  statuses: SalahStatusType[];
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

  const salahDataByMonth: MonthlySalahData[] = months.map((month) => ({
    month,
    statuses: [],
  }));

  selectedYearAndSalahData.forEach((item) => {
    const monthIndex = getMonth(parseISO(item.date));
    salahDataByMonth[monthIndex].statuses.push(...item.statuses);
  });

  return (
    <section
      aria-label={`${selectedYear} ${statsToShow} monthly statistics, ${selectedYearAndSalahData.length} records`}
      className="grid grid-cols-3 gap-3 mt-5"
    >
      {salahDataByMonth.map((monthData, monthIndex) => {
        const monthStart = new Date(selectedYear, monthIndex, 1);
        const monthEnd = endOfMonth(monthStart);
        const isUnavailable =
          isBefore(monthEnd, userStartDateParsed) ||
          isAfter(monthStart, todaysDate);

        return (
          <div
            key={monthData.month}
            className={`min-h-20 p-3 text-left bg-[var(--card-bg-color)] rounded-xl ${isUnavailable ? "opacity-30" : ""}`}
          >
            <p className="font-semibold">{monthData.month}</p>
          </div>
        );
      })}
    </section>
  );
};

export default YearlyStats;
