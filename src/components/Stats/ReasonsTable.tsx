import { prayerStatusColorsHexCodes } from "../../utils/constants";
import { salahReasonsOverallNumbersType } from "../../types/types";

interface ReasonsTableProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
}

const ReasonsTable = ({
  salahReasonsOverallNumbers,
  status,
}: ReasonsTableProps) => {
  const reasonsSum = Object.values(salahReasonsOverallNumbers[status]).reduce(
    (acc, total) => acc + total,
    0
  );
  console.log("salahReasonsOverallNumbers: ", salahReasonsOverallNumbers);
  return (
    <table className="w-full">
      <tbody>
        {Object.entries(salahReasonsOverallNumbers[status])
          .slice(0, 3)
          .map(([key, value], index) => (
            <tr className="" key={index}>
              <td className="p-2 whitespace-nowrap">{key}</td>
              <td className="w-1/2 p-2">
                <section className="relative">
                  <p className="h-2 bg-gray-800 rounded-md reasons-bar"></p>
                  <p
                    style={{
                      width: Math.round((value / reasonsSum) * 100) + "%",
                      backgroundColor: prayerStatusColorsHexCodes[status],
                    }}
                    className="absolute top-0 h-2 rounded-md reasons-bar"
                  ></p>
                </section>
              </td>
              <td className="p-2 whitespace-nowrap text-end">
                <p>
                  {value} {value > 1 ? "times" : "time"}
                </p>
                <p className="text-xs ">
                  ({((value / reasonsSum) * 100).toFixed(1)}%)
                </p>{" "}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ReasonsTable;
