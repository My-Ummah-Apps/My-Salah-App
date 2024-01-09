import HabitsView from "../components/HabitsView";
import NextSalahTime from "../components/NextSalahTime";

const MainPage = ({
  setSalahObjects: setSalahObjects,
  salahObjects: salahObjects,
}) => {
  return (
    <div className="overflow-x-auto w-5/5 main-page-wrap">
      <NextSalahTime />
      <HabitsView
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
      />
    </div>
  );
};

export default MainPage;
