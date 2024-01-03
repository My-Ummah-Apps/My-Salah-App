import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

// import "./App.css";
import NavBar from "./components/NavBar";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";

type salahObjectsType = {
  salahName: string;
  completedDates: { [date: string]: string }[];
};

function App() {
  const [salahObjects, setSalahObjects] = useState<salahObjectsType[]>([
    // const [salahObjects, setSalahObjects]: any[] = useState([
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

  // const test = [...salahObjects];
  // console.log(...test);

  localStorage.setItem("storedSalahTrackerData", JSON.stringify(salahObjects));

  // useEffect(() => {
  //   const storedSalahTrackingData = localStorage.getItem(
  //     "storedSalahTrackingData"
  //   );
  //   storedSalahTrackingData
  //     ? setSalahObjects(JSON.parse(storedSalahTrackingData))
  //     : setSalahObjects([]);
  // }, []);

  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route path="StatsPage" element={<StatsPage />} />
          <Route
            index
            element={
              <MainPage
                setSalahObjects={setSalahObjects}
                salahObjects={salahObjects}
              />
            }
          />
          <Route path="SettingsPage" element={<SettingsPage />} />
        </Routes>
        <NavBar />
      </section>
    </BrowserRouter>
  );
}

export default App;
