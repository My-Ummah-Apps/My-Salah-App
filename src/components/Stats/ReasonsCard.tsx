import { useState } from "react";
import { salahReasonsOverallNumbersType } from "../../types/types";
import BottomSheetReasons from "../BottomSheets/BottomSheetReasons";
import ReasonsList from "./ReasonsList";

interface ReasonsCardProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
}

const ReasonsCard = ({
  salahReasonsOverallNumbers,
  status,
}: ReasonsCardProps) => {
  const [reasonsToShow, setReasonsToShow] = useState("");
  const [showReasonsSheet, setShowReasonsSheet] = useState(false);

  return (
    <>
      <section className="text-sm bg-[color:var(--card-bg-color)] mt-6 rounded-t-2xl p-2">
        {/* <ReasonsList
          salahReasonsOverallNumbers={salahReasonsOverallNumbers}
          status={status}
          showReasonsSheet={showReasonsSheet}
        /> */}
        <h1 className="mb-2 text-lg text-center">
          Top Reasons For {status} Salah
        </h1>
        <ul>
          {Object.entries(salahReasonsOverallNumbers[status])
            .slice(0, 3)
            .map(([key, value], index) => (
              <li className="flex justify-between" key={index}>
                <p>
                  {index + 1}. {key}
                </p>
                <p>{value} times</p>
              </li>
            ))}
        </ul>
        {Object.entries(salahReasonsOverallNumbers[status]).length > 3 && (
          <button
            onClick={() => {
              setShowReasonsSheet(true);
            }}
            className="w-full mt-2 text-right"
          >
            Show More
          </button>
        )}
      </section>
      <BottomSheetReasons
        setShowReasonsSheet={setShowReasonsSheet}
        showReasonsSheet={showReasonsSheet}
        salahReasonsOverallNumbers={salahReasonsOverallNumbers}
        reasonsToShow={reasonsToShow}
        status={status}
      />
    </>
  );
};

export default ReasonsCard;
