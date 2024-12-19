import { useState } from "react";
import {
  reasonsToShowType,
  salahReasonsOverallNumbersType,
} from "../../types/types";
import BottomSheetReasons from "../BottomSheets/BottomSheetReasons";

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
    <>
      <section className="text-sm bg-[color:var(--card-bg-color)] mt-6 rounded-t-2xl p-2">
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
