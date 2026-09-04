import {
  endOfMonth,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import {
  MonthlySalahStats,
  SalahNamesType,
  SalahRecordsArrayType,
} from "../../types/types";

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
  const salahName = statsToShow === "Asr" ? "Asar" : statsToShow;

  const salahStatsByMonth: MonthlySalahStats[] = months.map((month) => ({
    month,
    statusCounts: {
      group: 0,
      "male-alone": 0,
      "female-alone": 0,
      late: 0,
      missed: 0,
      excused: 0,
    },
  }));

  fetchedSalahData.forEach((item) => {
    const itemDate = parseISO(item.date);

    if (getYear(itemDate) !== selectedYear) {
      return;
    }

    const statuses =
      salahName === "All"
        ? [
            item.salahs.Fajr,
            item.salahs.Dhuhr,
            item.salahs.Asar,
            item.salahs.Maghrib,
            item.salahs.Isha,
          ]
        : [item.salahs[salahName]];

    const monthIndex = getMonth(itemDate);

    statuses.forEach((status) => {
      if (status !== "") {
        salahStatsByMonth[monthIndex].statusCounts[status] += 1;
      }
    });
  });

  return (
    <section
      aria-label={`${selectedYear} ${statsToShow} monthly statistics`}
      className="grid grid-cols-3 gap-3 mt-5"
    >
      {salahStatsByMonth.map((monthData, monthIndex) => {
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
