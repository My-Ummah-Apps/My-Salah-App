// import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { prayerStatusColorsHexCodes } from "../../utils/constants";

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent, //   index,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      className="text-sm"
      x={x}
      y={y}
      fill="white"
      //   textAnchor={x > cx ? "start" : "end"}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${
        Number((percent * 100).toFixed(0)) > 0
          ? (percent * 100).toFixed(0) + "%"
          : ""
      }`}
    </text>
  );
};

const DonutPieChart = ({
  donutPieChartData,
  salahStatusStatistics,
  userGender,
}: {
  salahStatusStatistics: {
    salahInJamaahDatesOverall: number;
    salahMaleAloneDatesOverall: number;
    salahFemaleAloneDatesOverall: number;
    salahExcusedDatesOverall: number;
    salahMissedDatesOverall: number;
    salahLateDatesOverall: number;
  };
  donutPieChartData: { name: string; value: number }[];
  userGender: string;
}) => {
  const COLORS =
    userGender === "male"
      ? [
          prayerStatusColorsHexCodes.group,
          prayerStatusColorsHexCodes["male-alone"],
          prayerStatusColorsHexCodes.late,
          prayerStatusColorsHexCodes.missed,
        ]
      : [
          prayerStatusColorsHexCodes["female-alone"],
          prayerStatusColorsHexCodes.excused,
          prayerStatusColorsHexCodes.late,
          prayerStatusColorsHexCodes.missed,
        ];
  return (
    <div className="mt-5 mb-5 flex h-[235px] w-[100%] justify-around items-center donut-pie-chart-wrapper bg-[color:var(--card-bg-color)] rounded-2xl py-2">
      <ResponsiveContainer width="60%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            // data={data}
            data={donutPieChartData}
            // data={data.length > 0 ? data : [{ name: "No Data", value: 0 }]}
            isAnimationActive={false}
            // animationDuration={1000}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={45}
            paddingAngle={0}
            cornerRadius={0}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {donutPieChartData.map((_, index) => (
              <Cell
                style={{ outline: "none" }}
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="justify-center">
        {salahStatusStatistics.salahFemaleAloneDatesOverall > 0 ||
        salahStatusStatistics.salahInJamaahDatesOverall > 0 ? (
          <p
            style={
              {
                "--group-color": prayerStatusColorsHexCodes.group,
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
                  "--male-alone-color":
                    prayerStatusColorsHexCodes["male-alone"],
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
                  "--excused-color": prayerStatusColorsHexCodes.excused,
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
                "--late-color": prayerStatusColorsHexCodes.late,
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
                "--missed-color": prayerStatusColorsHexCodes.missed,
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
