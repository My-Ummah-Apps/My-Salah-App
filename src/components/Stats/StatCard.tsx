import { salahTrackingEntryType } from "../../types/types";

import { AiOutlineStop } from "react-icons/ai";
import { PiClockCounterClockwise } from "react-icons/pi";
import { GoPerson } from "react-icons/go";
import { GoPeople } from "react-icons/go";

const StatCard = ({
  statName,
  styles,
  // salahTrackingArray,
  // salahFulfilledDates,
  stat,
}: {
  statName: string;
  styles: {
    borderTopRightRadius: string;
    borderTopLeftRadius: string;
    borderBottomLeftRadius: string;
    borderBottomRightRadius: string;
    bgColor: string;
  };
  salahTrackingArray: salahTrackingEntryType[];
  salahFulfilledDates: string[];
  stat: number;
}) => {
  // salahFulfilledDates;
  // salahTrackingArray;
  // bg-[color:var(--card-bg-color)]

  return (
    <div
      // style={{ backgroundColor: bgColor }}
      style={{
        backgroundColor: styles.bgColor,
        borderTopRightRadius: styles.borderTopRightRadius,
        borderTopLeftRadius: styles.borderTopLeftRadius,
        borderBottomLeftRadius: styles.borderBottomLeftRadius,
        borderBottomRightRadius: styles.borderBottomRightRadius,
      }}
      className={`${styles.bgColor} p-3 m-2 text-white rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl `}
    >
      <div className="flex items-center mb-1 stat-name-and-icon-wrap">
        <p className="inline-block rounded-3xl yellow-block w-[24px] h-[24px]  self-center justify-self-center">
          {statName === "In jamaah" ? (
            <GoPeople className="w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : statName === "On time" ? (
            <GoPerson className=" w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : statName === "Late" ? (
            <PiClockCounterClockwise className=" w-[15px] h-[15px] flex self-center justify-self-center m-1" />
          ) : statName === "Missed" ? (
            <AiOutlineStop className=" w-[15px] h-[15px] flex self-center justify-self-center m-1" />
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
