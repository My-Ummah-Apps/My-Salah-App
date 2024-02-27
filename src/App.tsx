import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { salahTrackingEntryType } from "./types/types";
import { subDays } from "date-fns";

// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }
HomePage;
// import "./App.css";
import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import StatsPage from "./pages/StatsPage";
import QiblahDirection from "./pages/QiblahDirection";

const App = () => {
  //
  // const [salahTrackingArray, setSalahTrackingArray] = useState<
  //   salahTrackingArrayType[]
  // >([]);
  const [salahTrackingArray, setSalahTrackingArray] = useState<
    salahTrackingEntryType[]
  >([]);

  const [currentWeek, setCurrentWeek] = useState(0);
  const today: Date = new Date();
  const startDate: Date = subDays(today, currentWeek);

  useEffect(() => {
    const storedSalahTrackingData = localStorage.getItem(
      "storedSalahTrackingData"
    );
    storedSalahTrackingData
      ? setSalahTrackingArray(JSON.parse(storedSalahTrackingData))
      : setSalahTrackingArray([
          {
            salahName: "Fajr",
            completedDates: [],
          },
          {
            salahName: "Zohar",
            completedDates: [],
          },
          {
            salahName: "Asar",
            completedDates: [],
          },
          {
            salahName: "Maghrib",
            completedDates: [],
          },
          {
            salahName: "Isha",
            completedDates: [],
          },
        ]);
  }, []);

  const h1ClassStyles: any = `mb-10 text-center`;

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route
            path="/ResourcesPage"
            element={
              <ResourcesPage
                title={<h1 className={h1ClassStyles}>{"Resources"}</h1>}
              />
            }
          />
          <Route
            index
            element={
              <HomePage
                title={<h1 className={h1ClassStyles}>{"Home34"}</h1>}
                startDate={startDate}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                setCurrentWeek={setCurrentWeek}
                // currentWeek={currentWeek}
              />
            }
          />
          <Route
            path="/SettingsPage"
            element={
              <SettingsPage
                title={<h1 className={h1ClassStyles}>{"Settings"}</h1>}
              />
            }
          />
          <Route
            path="/StatsPage"
            element={
              <StatsPage
                title={<h1 className={h1ClassStyles}>{"Stats"}</h1>}
                setCurrentWeek={setCurrentWeek}
                startDate={startDate}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                currentWeek={currentWeek}
              />
            }
          />
          <Route
            path="/QiblahDirection"
            element={
              <QiblahDirection
                title={<h1 className={h1ClassStyles}>{"Qibla Direction"}</h1>}
              />
            }
          />
        </Routes>

        <NavBar />
      </section>
    </BrowserRouter>
  );
};

export default App;
