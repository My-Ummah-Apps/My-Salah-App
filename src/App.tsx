import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { salahTrackingArrayType } from "./types/types";

// import "./App.css";
import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import CalenderPage from "./pages/CalenderPage";
import QiblahDirection from "./pages/QiblahDirection";

const App = () => {
  //
  // const [salahTrackingArray, setSalahTrackingArray] = useState<
  //   salahTrackingArrayType[]
  // >([]);
  const [salahTrackingArray, setSalahTrackingArray] = useState<
    salahTrackingArrayType[]
  >([]);

  const [currentStartDate, setCurrentStartDate] = useState<number>(0);

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
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
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
                setSalahTrackingArray={setSalahTrackingArray}
                salahTrackingArray={salahTrackingArray}
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
};

export default App;
