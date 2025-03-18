import { salahStatusColorsHexCodes } from "../../utils/constants";
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
              <p className="whitespace-nowrap">{`${index + 1}. ${key}`}</p>
              <section className="whitespace-nowrap text-end">
                <p className="text-sm">
                  {((value / reasonsSum) * 100).toFixed(1)}%
                </p>{" "}
              </section>
            </section>
            <section className="relative">
              <p className="h-2 bg-[#282828] rounded-md"></p>
              <p
                style={{
                  width: Math.round((value / reasonsSum) * 100) + "%",
                  backgroundColor: salahStatusColorsHexCodes[status],
                }}
                className="absolute top-0 left-0 h-2 rounded-md"
              ></p>
              <p className="pt-2 pb-4 text-sm text-end">
                {value} {value > 1 ? "times" : "time"}
              </p>
            </section>
          </section>
        ))}
    </section>
  );
};

export default ReasonsList;
