import {
  reasonsToShowType,
  salahReasonsOverallNumbersType,
} from "../../types/types";
import { prayerStatusColorsHexCodes } from "../../utils/constants";

interface ReasonsCardProps {
  setReasonsToShow: React.Dispatch<React.SetStateAction<reasonsToShowType>>;
  setShowReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  // showReasonsSheet: boolean;
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
}

const ReasonsCard = ({
  setReasonsToShow,
  setShowReasonsSheet,
  // showReasonsSheet,
  salahReasonsOverallNumbers,
  status,
}: ReasonsCardProps) => {
  const reasonsSum = Object.values(salahReasonsOverallNumbers[status]).reduce(
    (acc, total) => acc + total,
    0
  );

  console.log("salahReasonsOverallNumbers: ", salahReasonsOverallNumbers);

  return (
    <>
      <section className="text-sm bg-[color:var(--card-bg-color)] mt-6 rounded-2xl p-2 h-full">
        <h1 className="m-2 text-lg text-center">
          {`Top Reasons For ${
            status === "male-alone"
              ? "Praying Salah Alone"
              : status === "late"
              ? "Praying Salah Late"
              : status === "missed"
              ? "Missing Salah"
              : ""
          }`}
        </h1>
        {Object.entries(salahReasonsOverallNumbers[status]).length > 0 ? (
          <table className="w-full">
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
          </table>
        ) : (
          <section className="relative">
            <h1 className="absolute inset-0 flex items-center justify-center">
              No Reasons Entered
            </h1>
            <table className="opacity-0">
              {Array.from({ length: 3 })
                .fill(0)
                .map((_, i) => (
                  <tr className="" key={i}>
                    <td className="p-2">{"key"}</td>
                    <td className="w-1/2 p-2">
                      <section className="relative">
                        <p className="h-2"></p>
                        <p
                          style={{
                            //  width: Math.round(("value" / reasonsSum) * 100) + "%",
                            backgroundColor: prayerStatusColorsHexCodes[status],
                          }}
                          className="absolute top-0 h-2 rounded-md reasons-bar"
                        ></p>
                      </section>
                    </td>
                    <td className="p-2">
                      <p>""</p>
                      <p className="text-xs text-end">(0%)</p>{" "}
                    </td>
                  </tr>
                ))}
            </table>
          </section>
        )}

        <button
          onClick={() => {
            setReasonsToShow(status);
            setShowReasonsSheet(true);
          }}
          className={`w-full mt-2 text-right ${
            Object.entries(salahReasonsOverallNumbers[status]).length > 3
              ? "visible"
              : "invisible"
          }`}
        >
          Show More
        </button>
      </section>
    </>
  );
};

export default ReasonsCard;
