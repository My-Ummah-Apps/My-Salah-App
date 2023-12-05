// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

import "./App.css";
import NavBar from "./components/NavBar";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <BrowserRouter>
      <section className="App">
        <Routes>
          <Route path="StatsPage" element={<StatsPage />} />
          <Route index element={<MainPage />} />
          <Route path="SettingsPage" element={<SettingsPage />} />
        </Routes>
        <NavBar />
      </section>
    </BrowserRouter>
  );
}

export default App;
