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
      <section className="text-sm bg-[color:var(--card-bg-color)] mt-6 rounded-t-2xl p-2 h-full">
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
        <ul>
          {Object.entries(salahReasonsOverallNumbers[status])
            .slice(0, 3)
            .map(([key, value], index) => (
              <li
                className="flex items-center justify-between py-2"
                key={index}
              >
                <p>{key}</p>
                <div className="w-1/2 h-2 bg-gray-800 rounded-md reasons-bar">
                  <p
                    style={{
                      width: Math.round((value / reasonsSum) * 100) + "%",
                      backgroundColor: prayerStatusColorsHexCodes[status],
                    }}
                    className="h-2 rounded-md reasons-bar"
                  ></p>
                </div>
                <section className="">
                  <p>
                    {value} {value > 1 ? "times" : "time"}
                  </p>
                  <p className="text-xs text-end">
                    ({Math.round((value / reasonsSum) * 100)}%)
                  </p>{" "}
                </section>
              </li>
            ))}
        </ul>

        {Object.entries(salahReasonsOverallNumbers[status]).length > 3 && (
          <button
            onClick={() => {
              setReasonsToShow(status);
              setShowReasonsSheet(true);
            }}
            className="w-full mt-2 text-right"
          >
            Show More
          </button>
        )}
      </section>
    </>
  );
};

export default ReasonsCard;
