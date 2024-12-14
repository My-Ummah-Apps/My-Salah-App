import { salahReasonsOverallNumbersType } from "../../types/types";

interface ReasonsCardProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
}

const ReasonsCard = ({
  salahReasonsOverallNumbers,
  status,
}: ReasonsCardProps) => {
  console.log("heyo", Object.entries(salahReasonsOverallNumbers[status]));

  return (
    <section className="bg-[color:var(--card-bg-color)] mt-6 rounded-t-2xl p-2">
      <h1 className="mb-2 text-lg text-center">
        Top Reasons For {status} Salah
      </h1>
      <ul>
        {Object.entries(salahReasonsOverallNumbers[status]).map(
          ([key, value], index) => (
            <li key={index}>
              {key}: {value}
            </li>
          )
        )}
      </ul>
    </section>
  );
};

export default ReasonsCard;
