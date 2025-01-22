import { prayerStatusColorsHexCodes } from "../../utils/constants";
import { salahReasonsOverallNumbersType } from "../../types/types";

interface ReasonsListProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
  partialOrFull: "partial" | "full";
}

const ReasonsList = ({
  salahReasonsOverallNumbers,
  status,
  partialOrFull,
}: ReasonsListProps) => {
  const reasonsSum = Object.values(salahReasonsOverallNumbers[status]).reduce(
    (acc, total) => acc + total,
    0
  );

  return (
    <section className="px-5">
      {Object.entries(salahReasonsOverallNumbers[status])
        .slice(
          0,
          partialOrFull === "partial"
            ? 3
            : Object.entries(salahReasonsOverallNumbers[status]).length
        )
        .map(([key, value], index) => (
          <section className="" key={index}>
            <section className="flex items-center justify-between py-2">
              <p className="px-2 whitespace-nowrap">{`${index + 1}. ${key}`}</p>

              <section className="px-2 whitespace-nowrap text-end">
                <p className="text-sm">
                  {((value / reasonsSum) * 100).toFixed(1)}%
                </p>{" "}
              </section>
            </section>
            <section className="relative px-2">
              <section className="progress-bar-wrap">
                <p className="h-2 bg-[#282828] rounded-md reasons-bar"></p>
                <p
                  style={{
                    width: Math.round((value / reasonsSum) * 100) + "%",
                    backgroundColor: prayerStatusColorsHexCodes[status],
                  }}
                  className="absolute top-0 h-2 rounded-md reasons-bar"
                ></p>
                <p className="pt-2 pb-4 text-sm text-end">
                  {value} {value > 1 ? "times" : "time"}
                </p>
              </section>
            </section>
          </section>
        ))}
    </section>
  );
};

export default ReasonsList;
