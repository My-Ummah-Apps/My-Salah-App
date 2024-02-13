import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { salahTrackingEntryType } from "./types/types";
import { startOfDay, subDays } from "date-fns";

// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

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

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route path="/ResourcesPage" element={<ResourcesPage />} />
          <Route
            index
            element={
              <MainPage
                startDate={startDate}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                setCurrentWeek={setCurrentWeek}
                currentWeek={currentWeek}
              />
            }
          />
          <Route path="/SettingsPage" element={<SettingsPage />} />
          <Route
            path="/StatsPage"
            element={
              <StatsPage
                setCurrentWeek={setCurrentWeek}
                startDate={startDate}
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
                currentWeek={currentWeek}
              />
            }
          />
          <Route path="/QiblahDirection" element={<QiblahDirection />} />
        </Routes>

        <NavBar />
      </section>
    </BrowserRouter>
  );
};

export default App;
