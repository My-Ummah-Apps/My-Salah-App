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
  SalahStatusType,
} from "../../types/types";

interface YearlyStatsProps {
  fetchedSalahData: SalahRecordsArrayType;
  selectedYear: number;
  statsToShow: Exclude<SalahNamesType, "Asar"> | "All";
  userGender: string;
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
  userGender,
  userStartDateParsed,
  todaysDate,
}: YearlyStatsProps) => {
  const salahName = statsToShow === "Asr" ? "Asar" : statsToShow;
  const relevantStatuses: Exclude<SalahStatusType, "">[] =
    userGender === "male"
      ? ["group", "male-alone", "late", "missed"]
      : ["female-alone", "excused", "late", "missed"];

  const salahStatsByMonth: MonthlySalahStats[] = months.map((month) => ({
    month,
    totalStatusCount: 0,
    statusCounts: {
      group: 0,
      "male-alone": 0,
      "female-alone": 0,
      late: 0,
      missed: 0,
      excused: 0,
    },
    statusPercentages: {
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

  salahStatsByMonth.forEach((item) => {
    item.totalStatusCount = relevantStatuses.reduce(
      (total, status) => total + item.statusCounts[status],
      0,
    );

    if (item.totalStatusCount === 0) {
      return;
    }

    relevantStatuses.forEach((status) => {
      item.statusPercentages[status] =
        (item.statusCounts[status] / item.totalStatusCount) * 100;
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
