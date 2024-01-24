import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

// import "./App.css";
import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import CalenderPage from "./pages/CalenderPage";
import QiblahDirection from "./pages/QiblahDirection";

type salahObjectsType = {
  salahName: string;
  completedDates: { [date: string]: string }[];
};

function App() {
  const [salahObjects, setSalahObjects] = useState<salahObjectsType[]>([]);

  const [currentStartDate, setCurrentStartDate] = useState(0);

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
          <Route path="/ResourcesPage" element={<ResourcesPage />} />
          <Route
            index
            element={
              <MainPage
                setSalahObjects={setSalahObjects}
                salahObjects={salahObjects}
                setCurrentStartDate={setCurrentStartDate}
                currentStartDate={currentStartDate}
              />
            }
          />
          <Route path="/SettingsPage" element={<SettingsPage />} />
          <Route
            path="/CalenderPage"
            element={
              <CalenderPage
                setSalahObjects={setSalahObjects}
                salahObjects={salahObjects}
                setCurrentStartDate={setCurrentStartDate}
                currentStartDate={currentStartDate}
              />
            }
          />
          <Route path="/QiblahDirection" element={<QiblahDirection />} />
        </Routes>

        <NavBar />
      </section>
    </BrowserRouter>
  );
}

export default App;
