import { prayerStatusColorsHexCodes } from "../../utils/constants";
import { salahReasonsOverallNumbersType } from "../../types/types";

interface ReasonsTableProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
  partialOrFull: "partial" | "full";
}

const ReasonsTable = ({
  salahReasonsOverallNumbers,
  status,
  partialOrFull,
}: ReasonsTableProps) => {
  const reasonsSum = Object.values(salahReasonsOverallNumbers[status]).reduce(
    (acc, total) => acc + total,
    0
  );

  return (
    <section className="px-5">
      <table className="w-full">
        <tbody>
          {Object.entries(salahReasonsOverallNumbers[status])
            .slice(
              0,
              partialOrFull === "partial"
                ? 3
                : Object.entries(salahReasonsOverallNumbers[status]).length
            )
            .map(([key, value], index) => (
              <tr className="" key={index}>
                <section className="flex items-center justify-between py-2">
                  <td className="px-2 whitespace-nowrap">
                    {`${index + 1}. ${key}`}
                  </td>
                  {/* <td className="w-1/2 p-2"> */}
                  {/* <section className="relative">
                    <p className="h-2 bg-gray-800 rounded-md reasons-bar"></p>
                    <p
                      style={{
                        width: Math.round((value / reasonsSum) * 100) + "%",
                        backgroundColor: prayerStatusColorsHexCodes[status],
                      }}
                      className="absolute top-0 h-2 rounded-md reasons-bar"
                    ></p>
                  </section> */}
                  {/* </td> */}
                  <td className="px-2 whitespace-nowrap text-end">
                    <p className="text-sm">
                      {((value / reasonsSum) * 100).toFixed(1)}%
                    </p>{" "}
                    {/* <p>
                      {value} {value > 1 ? "times" : "time"}
                    </p> */}
                  </td>
                </section>
                <section className="">
                  <td className="w-[1%] px-2">
                    <section className="relative">
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
                  </td>
                </section>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default ReasonsTable;
