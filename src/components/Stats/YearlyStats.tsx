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
import { salahStatusColorsHexCodes } from "../../utils/constants";

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

const statusDisplayDetails = {
  group: { label: "Jamaah" },
  "male-alone": { label: "Alone" },
  "female-alone": { label: "Prayed" },
  late: { label: "Late" },
  missed: { label: "Missed" },
  excused: { label: "Excused" },
};

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
      className="mt-5"
    >
      <h2 className="text-lg font-semibold">{selectedYear} at a glance</h2>
      <p className="mt-1 mb-3 text-xs opacity-60">
        Each bar shows all four Salah statuses
      </p>

      <div className="grid grid-cols-4 gap-2 px-3 py-3 mb-4 text-[10px] bg-[var(--card-bg-color)] rounded-xl">
        {relevantStatuses.map((status) => (
          <div key={status} className="flex items-center gap-1 whitespace-nowrap">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-[0.15rem] shrink-0"
              style={{ backgroundColor: salahStatusColorsHexCodes[status] }}
            />
            <span>{statusDisplayDetails[status].label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {salahStatsByMonth.map((monthData, monthIndex) => {
          const monthStart = new Date(selectedYear, monthIndex, 1);
          const monthEnd = endOfMonth(monthStart);
          const isUnavailable =
            isBefore(monthEnd, userStartDateParsed) ||
            isAfter(monthStart, todaysDate);

          return (
            <div
              key={monthData.month}
              className={`p-3 text-left bg-[var(--card-bg-color)] rounded-xl ${isUnavailable ? "opacity-30" : ""}`}
            >
              <p className="text-sm font-semibold">{monthData.month}</p>

              <div className="flex h-2 my-3 overflow-hidden rounded-full bg-[var(--app-border-color)]">
                {relevantStatuses.map((status) => (
                  <span
                    key={status}
                    aria-hidden="true"
                    style={{
                      width: `${monthData.statusPercentages[status]}%`,
                      backgroundColor: salahStatusColorsHexCodes[status],
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                {relevantStatuses.map((status) => (
                  <p
                    key={status}
                    className="flex items-center gap-1 font-semibold whitespace-nowrap"
                  >
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-[0.15rem] shrink-0"
                      style={{
                        backgroundColor: salahStatusColorsHexCodes[status],
                      }}
                    />
                    <span className="sr-only">
                      {statusDisplayDetails[status].label}: {" "}
                    </span>
                    <span>
                      {Math.round(monthData.statusPercentages[status])}%
                    </span>
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default YearlyStats;
