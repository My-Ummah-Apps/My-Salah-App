import {
  reasonsToShowType,
  salahReasonsOverallNumbersType,
} from "../../types/types";
import { prayerStatusColorsHexCodes } from "../../utils/constants";
import ReasonsList from "./ReasonsList";

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
  return (
    <section className="text-sm bg-[color:var(--card-bg-color)] mt-6 rounded-2xl pb-10 h-full">
      <h1 className="pt-4 m-2 text-lg text-center">
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
        <ReasonsList
          salahReasonsOverallNumbers={salahReasonsOverallNumbers}
          status={status}
          partialOrFull="partial"
        />
      ) : (
        <section className="relative h-full">
          <h1 className="absolute inset-0 flex items-center justify-center">
            <section className="">
              <p className="p-4 text-lg text-center">
                No reasons entered for Salah which were{" "}
                {status === "male-alone"
                  ? "prayed alone"
                  : status === "late"
                  ? "performed late"
                  : status === "missed"
                  ? "missed"
                  : null}
              </p>
            </section>
          </h1>
          <table className="opacity-0">
            <tbody>
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
            </tbody>
          </table>
        </section>
      )}

      <button
        style={{ borderTop: "1px solid rgb(0, 0, 0, 0.2)" }}
        onClick={() => {
          setReasonsToShow(status);
          setShowReasonsSheet(true);
          console.log("clicked");
        }}
        className={`mt-2 text-center w-full ${
          Object.entries(salahReasonsOverallNumbers[status]).length > 3
            ? "visible"
            : "invisible"
        }`}
      >
        <p className="pt-4 text-lg font-bold">Show More</p>
      </button>
    </section>
  );
};

export default ReasonsCard;
