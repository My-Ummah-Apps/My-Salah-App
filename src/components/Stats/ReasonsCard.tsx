import { salahReasonsOverallNumbersType } from "../../types/types";
import BottomSheetReasons from "../BottomSheets/BottomSheetReasons";

interface ReasonsCardProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
}

const ReasonsCard = ({
  salahReasonsOverallNumbers,
  status,
}: ReasonsCardProps) => {
  // console.log("salahReasonsOverallNumbers: ", salahReasonsOverallNumbers);

  // console.log("heyo", Object.entries(salahReasonsOverallNumbers[status]));

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
                {" "}
                <p className="">
                  {index + 1}. {key}
                </p>
                <p>{value} times</p>
              </li>
            ))}
        </ul>
        {Object.entries(salahReasonsOverallNumbers[status]).length > 3 && (
          <button className="w-full mt-2 text-right">Show More</button>
        )}
      </section>
      <BottomSheetReasons />
    </>
  );
};

export default ReasonsCard;
