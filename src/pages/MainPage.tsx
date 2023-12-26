import HabitsView from "../components/HabitsView";

const MainPage = ({
  setSalahObjects: setSalahObjects,
  salahObjects: salahObjects,
}) => {
  return (
    <div className="overflow-x-auto w-5/5 main-page-wrap">
      <h1 className="p-5 text-xl text-white">Prayer Tracker</h1>
      <HabitsView
        setSalahObjects={setSalahObjects}
        salahObjects={salahObjects}
      />
    </div>
  );
};

export default MainPage;
