import { salahStatusColorsHexCodes } from "../../utils/constants";
import { PieChart } from "react-minimal-pie-chart";

const DonutPieChart = ({
  donutPieChartData,
  salahStatusStatistics,
  userGender,
}: {
  salahStatusStatistics: {
    salahInGroupDatesOverall: number;
    salahMaleAloneDatesOverall: number;
    salahFemaleAloneDatesOverall: number;
    salahExcusedDatesOverall: number;
    salahMissedDatesOverall: number;
    salahLateDatesOverall: number;
  };
  donutPieChartData: { title: string; value: number; color: string }[];
  userGender: string;
}) => {
  // console.log(salahStatusStatistics);
  // console.log(donutPieChartData);

  return (
    <div className="mt-5 mb-5 flex h-[235px] w-[100%] justify-around items-center donut-pie-chart-wrapper bg-[color:var(--card-bg-color)] rounded-2xl py-2">
      <PieChart
        style={{ width: "50%" }}
        // rounded={true}
        lineWidth={50}
        label={({ dataEntry }) =>
          `${Math.round(dataEntry.percentage)}% (${dataEntry.value})`
        }
        labelStyle={{
          fontSize: "5px",
          fill: "#fff",
        }}
        labelPosition={75}
        data={donutPieChartData}
      />

      <div className="justify-center">
        {salahStatusStatistics.salahFemaleAloneDatesOverall > 0 ||
        salahStatusStatistics.salahInGroupDatesOverall > 0 ? (
          <p
            style={
              {
                "--group-color": salahStatusColorsHexCodes.group,
              } as React.CSSProperties
            }
            className="donut-pie-chart-text pb-1 text-sm before:bg-[var(--group-color)]"
          >
            {userGender === "male" ? "In Jamaah" : "Prayed"}
          </p>
        ) : null}

        {salahStatusStatistics.salahExcusedDatesOverall > 0 ||
        salahStatusStatistics.salahMaleAloneDatesOverall > 0 ? (
          userGender === "male" ? (
            <p
              style={
                {
                  "--male-alone-color": salahStatusColorsHexCodes["male-alone"],
                } as React.CSSProperties
              }
              className="donut-pie-chart-text pb-1 text-sm before:bg-[var(--male-alone-color)]"
            >
              Alone
            </p>
          ) : (
            <p
              style={
                {
                  "--excused-color": salahStatusColorsHexCodes.excused,
                } as React.CSSProperties
              }
              className="donut-pie-chart-text pb-1 text-sm before:bg-[var(--excused-color)]"
            >
              Excused
            </p>
          )
        ) : null}

        {salahStatusStatistics.salahLateDatesOverall > 0 && (
          <p
            style={
              {
                "--late-color": salahStatusColorsHexCodes.late,
              } as React.CSSProperties
            }
            className="donut-pie-chart-text pb-1 text-sm before:bg-[var(--late-color)]"
          >
            Late
          </p>
        )}
        {salahStatusStatistics.salahMissedDatesOverall > 0 && (
          <p
            style={
              {
                "--missed-color": salahStatusColorsHexCodes.missed,
              } as React.CSSProperties
            }
            className="donut-pie-chart-text pb-1 text-sm before:bg-[var(--missed-color)]"
          >
            Missed
          </p>
        )}
      </div>
    </div>
  );
};

export default DonutPieChart;
