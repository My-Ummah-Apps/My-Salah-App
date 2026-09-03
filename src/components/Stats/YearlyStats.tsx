interface YearlyStatsProps {
  selectedYear: number;
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

const YearlyStats = ({ selectedYear }: YearlyStatsProps) => {
  return (
    <section
      aria-label={`${selectedYear} monthly statistics`}
      className="grid grid-cols-3 gap-3 mt-5"
    >
      {months.map((month) => (
        <div
          key={month}
          className="min-h-20 p-3 text-left bg-[var(--card-bg-color)] rounded-xl"
        >
          <p className="font-semibold">{month}</p>
        </div>
      ))}
    </section>
  );
};

export default YearlyStats;
