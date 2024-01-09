import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

// import "./App.css";
import NavBar from "./components/NavBar";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";

type salahObjectsType = {
  salahName: string;
  completedDates: { [date: string]: string }[];
};

function App() {
  const [salahObjects, setSalahObjects] = useState<salahObjectsType[]>([]);

  useEffect(() => {
    const storedSalahTrackingData = localStorage.getItem(
      "storedSalahTrackingData"
    );
    storedSalahTrackingData
      ? setSalahObjects(JSON.parse(storedSalahTrackingData))
      : setSalahObjects([
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
          <Route path="ResourcesPage" element={<ResourcesPage />} />
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
