// import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { prayerStatusColorsHexCodes } from "../../utils/constants";
import { userGenderType } from "../../types/types";

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
  userGender: userGenderType;
}) => {
  const data = [
    userGender === "male"
      ? {
          name: "In Jamaah",
          value: salahStatusStatistics.salahInJamaahDatesOverall,
        }
      : {
          name: "Prayed",
          value: salahStatusStatistics.salahFemaleAloneDatesOverall,
        },
    userGender === "male"
      ? {
          name: "Alone",
          value: salahStatusStatistics.salahMaleAloneDatesOverall,
        }
      : {
          name: "Excused",
          value: salahStatusStatistics.salahExcusedDatesOverall,
        },

    { name: "Late", value: salahStatusStatistics.salahLateDatesOverall },
    { name: "Missed", value: salahStatusStatistics.salahMissedDatesOverall },
  ];

  const COLORS =
    // userGender === "male"
    //   ? ["green", "#BDA55D", "orange", "red"]
    //   : ["green", "purple", "orange", "red"];
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
    <div className="mt-5 mb-5 flex h-[235px] w-[100%] justify-around items-center donut-pie-chart-wrapper bg-[color:var(--card-bg-color)] rounded-2xl py-2 ">
      <ResponsiveContainer className="" width="60%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            isAnimationActive={true}
            animationDuration={1000}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              // {data.map((entry, index) => (
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
        <p className="donut-pie-chart-text pb-1 text-sm before:bg-[#448b75]">
          {" "}
          {userGender === "male" ? "In Jamaah" : "Prayed"}
        </p>
        {userGender === "male" ? (
          <p className="donut-pie-chart-text pb-1 text-sm before:bg-[#bcaa4b]">
            {" "}
            Alone
          </p>
        ) : (
          <p className="donut-pie-chart-text pb-1 text-sm before:bg-[#dd42da]">
            {" "}
            Excused
          </p>
        )}
        <p className="donut-pie-chart-text pb-1 text-sm before:bg-[#ea580c]">
          {" "}
          Late
        </p>
        <p className="donut-pie-chart-text pb-1 text-sm  before:bg-[#b62e2e]">
          {" "}
          Missed
        </p>
      </div>
    </div>
  );
};

export default DonutPieChart;
