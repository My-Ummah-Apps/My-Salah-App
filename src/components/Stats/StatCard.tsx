import { salahTrackingEntryType } from "../../types/types";

const StatCard = ({
  statName,
  salahTrackingArray,
  salahFulfilledDates,
  stat,
}: {
  statName: string;
  salahTrackingArray: salahTrackingEntryType[];
  salahFulfilledDates: string[];
  stat: number;
}) => {
  salahFulfilledDates;
  salahTrackingArray;
  return (
    <div className="m-2 rounded-lg bg-[color:var(--card-bg-color)] p-3">
      <h1>{statName}</h1>
      <h2 className="my-3 text-4xl">{stat}%</h2>
      <p>0 times</p>
    </div>
  );
};

export default StatCard;
