interface YearlyStatsProps {
  selectedYear: number;
}

const YearlyStats = ({ selectedYear }: YearlyStatsProps) => {
  return (
    <section className="mt-5 text-center">
      <p>Yearly statistics for {selectedYear} will appear here.</p>
    </section>
  );
};

export default YearlyStats;
