import {
  reasonsToShowType,
  SalahNamesType,
  salahReasonsOverallNumbersType,
} from "../../types/types";
import { AnimatePresence, motion } from "framer-motion";
import { salahStatusColorsHexCodes } from "../../utils/constants";
import ReasonsList from "./ReasonsList";

interface ReasonsCardProps {
  setReasonsToShow: React.Dispatch<React.SetStateAction<reasonsToShowType>>;
  setShowReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
  statsToShow: SalahNamesType | "All";
}

const ReasonsCard = ({
  setReasonsToShow,
  setShowReasonsSheet,
  salahReasonsOverallNumbers,
  status,
  statsToShow,
}: ReasonsCardProps) => {
  return (
    <AnimatePresence>
      <motion.section
        // layout
        className="text-sm bg-[var(--card-bg-color)] mt-5 rounded-2xl h-full"
      >
        <h1 className="py-4 mx-4 text-lg text-center">
          {`Top Reasons For ${
            status === "male-alone"
              ? `Praying ${
                  statsToShow !== "All" ? statsToShow : ""
                } Salah Alone`
              : status === "late"
                ? `Praying ${statsToShow !== "All" ? statsToShow : ""} Salah Late`
                : status === "missed"
                  ? `Missing ${statsToShow !== "All" ? statsToShow : ""} Salah`
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
            <h1 className="absolute flex items-center justify-center text-sm transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/3">
              <section className="">
                <p className="text-center ">
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
                              backgroundColor:
                                salahStatusColorsHexCodes[status],
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
          id="open-reasons-sheet"
          style={{ borderTop: "1px solid var(--app-border-color)" }}
          onClick={() => {
            setReasonsToShow(status);
            setShowReasonsSheet(true);
          }}
          className={`mb-10 pt-2 text-center w-full ${
            Object.entries(salahReasonsOverallNumbers[status]).length > 3
              ? "visible"
              : "invisible"
          }`}
        >
          <p className="text-[1rem]">Show More</p>
        </button>
      </motion.section>
    </AnimatePresence>
  );
};

export default ReasonsCard;
