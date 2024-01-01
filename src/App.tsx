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
      completedDates: [
        { "23.12.23": "Home" },
        { "22.12.23": "Masjid" },
        { "20.12.23": "Masjid" },
        { "19.12.23": "Home" },
        { "19.10.23": "Masjid" },
      ],
    },
    {
      salahName: "Zohar",
      completedDates: [
        { "24.12.23": "Masjid" },
        { "22.12.23": "Home" },
        { "20.12.23": "Masjid" },
      ],
    },
    {
      salahName: "Asar",
      completedDates: [
        { "23.12.23": "Home" },
        { "22.12.23": "Masjid" },
        { "21.12.23": "Home" },
      ],
    },
    {
      salahName: "Maghrib",
      completedDates: [
        { "24.12.23": "Masjid" },
        { "21.12.23": "Masjid" },
        { "18.12.23": "Home" },
      ],
    },
    {
      salahName: "Isha",
      completedDates: [{ "23.12.23": "Home" }, { "21.12.23": "Masjid" }],
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
