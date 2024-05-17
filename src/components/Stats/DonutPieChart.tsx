import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#b62e2e", "#448b75", "#ea580c", "#bcaa4b"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      //   textAnchor={x > cx ? "start" : "end"}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DonutPieChart = () => {
  return (
    <div className="my-10 flex h-[200px] w-[100%] justify-around items-center donut-pie-chart-wrapper">
      <ResponsiveContainer className="" width="60%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            isAnimationActive={false}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="w-[40%]">
        <p className="donut-pie-chart-text before:bg-[#b62e2e] ">In Jamaah</p>
        <p className="donut-pie-chart-text before:bg-[#448b75]">Alone</p>
        <p className="donut-pie-chart-text before:bg-[#ea580c]">Missed</p>
        <p className="donut-pie-chart-text before:bg-[#bcaa4b]">Late</p>
      </div>
    </div>
  );
};

export default DonutPieChart;
