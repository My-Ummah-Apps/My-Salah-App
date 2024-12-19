import { salahReasonsOverallNumbersType } from "../../types/types";

interface ReasonsListProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
  status: "male-alone" | "late" | "missed";
  showReasonsSheet: boolean;
}

const ReasonsList = ({
  salahReasonsOverallNumbers,
  status,
  showReasonsSheet,
}: ReasonsListProps) => {
  const list = showReasonsSheet
    ? Object.entries(salahReasonsOverallNumbers[status])
    : Object.entries(salahReasonsOverallNumbers[status]).slice(0, 3);

  console.log("list: ", list);

  return (
    <>
      <h1 className="mb-2 text-lg text-center">
        Top Reasons For {status} Salah
      </h1>
      <ul>
        {/* {Object.entries(salahReasonsOverallNumbers[status]) */}
        {list.map(([key, value], index) => (
          <li className="flex justify-between" key={index}>
            {" "}
            <p className="">
              {index + 1}. {key}
            </p>
            <p>{value} times</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ReasonsList;
