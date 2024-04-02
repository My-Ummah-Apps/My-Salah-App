import { salahTrackingEntryType } from "../../types/types";

import { AiOutlineStop } from "react-icons/ai";
import { PiClockCounterClockwise } from "react-icons/pi";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";

const StatCard = ({
  statName,
  // salahTrackingArray,
  // salahFulfilledDates,
  stat,
}: {
  statName: string;
  salahTrackingArray: salahTrackingEntryType[];
  salahFulfilledDates: string[];
  stat: number;
}) => {
  // salahFulfilledDates;
  // salahTrackingArray;

  return (
    <div className="m-2 rounded-lg bg-[color:var(--card-bg-color)] p-3">
      <div className="flex items-center mb-1 stat-name-and-icon-wrap">
        <p className="inline-block rounded-3xl yellow-block text-white w-[24px] h-[24px]  self-center justify-self-center mr-2">
          {statName === "In jamaah" ? (
            <GoPeople className="text-white w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : statName === "On time" ? (
            <GoPerson className="text-white w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : statName === "Late" ? (
            <PiClockCounterClockwise className="text-white w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : statName === "Missed" ? (
            <AiOutlineStop className="text-white w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : null}
        </p>
        <h1>{statName}</h1>
      </div>
      <h2 className="my-3 text-4xl">{stat}%</h2>
      <p>0 times</p>
    </div>
  );
};

export default StatCard;
