import { salahReasonsOverallNumbersType } from "../../types/types";

interface ReasonsCardProps {
  salahReasonsOverallNumbers: salahReasonsOverallNumbersType;
}

const ReasonsCard = ({ salahReasonsOverallNumbers }: ReasonsCardProps) => {
  console.log("heyo", Object.entries(salahReasonsOverallNumbers)[0]);

  return (
    <section>
      <ul>
        {Object.entries(salahReasonsOverallNumbers)[1].map((item) => {
          return <li>{Object.values(item)}, value</li>;
        })}
      </ul>
    </section>
  );
};

export default ReasonsCard;
