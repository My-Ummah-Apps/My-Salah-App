import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { salahTrackingEntryType } from "./types/types";
import { subDays } from "date-fns";

import { StatusBar, Style } from "@capacitor/status-bar";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";

// interface salahTrackingEntryType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

import NavBar from "./components/Nav/NavBar";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import StatsPage from "./pages/StatsPage";
import QiblahDirection from "./pages/QiblahDirection";

window.addEventListener("DOMContentLoaded", () => {
  if (Capacitor.isNativePlatform()) {
    // STATUS BAR FUNCTIONALITY

    // const setStatusBarStyleDark = async () => {
    //   await StatusBar.setStyle({ style: Style.Dark });
    // };

    // const setStatusBarStyleLight = async () => {
    //   await StatusBar.setStyle({ style: Style.Light });
    // };

    // let statusBarThemeColor;
    // if (localStorage.getItem("theme") == null) {
    //   localStorage.setItem("theme", JSON.stringify("light"));
    //   setStatusBarStyleLight();
    //   statusBarThemeColor = "#EDEDED";
    // } else if (JSON.parse(localStorage.getItem("theme")) == "dark") {
    //   setStatusBarStyleDark();
    //   statusBarThemeColor = "#242424";
    //   document.body.classList.add("dark");
    // } else if (JSON.parse(localStorage.getItem("theme")) == "light") {
    //   setStatusBarStyleLight();
    //   statusBarThemeColor = "#EDEDED";
    //   document.body.classList.remove("dark");
    // }

    setTimeout(() => {
      SplashScreen.hide({
        fadeOutDuration: 250,
      });
    }, 500);

    if (Capacitor.getPlatform() === "ios") {
      return;
    } else if (Capacitor.getPlatform() === "android") {
      setTimeout(() => {
        // StatusBar.setStyle({ style: Style.Light });
        // if (statusBarThemeColor == "#EDEDED") {
        //   StatusBar.setStyle({ style: Style.Light });
        // } else if (statusBarThemeColor == "#242424") {
        //   StatusBar.setStyle({ style: Style.Dark });
        // }
        // StatusBar.setBackgroundColor({ color: statusBarThemeColor });
      }, 1000);
    }
  }
});

const App = () => {
  //
  // const [salahTrackingArray, setSalahTrackingArray] = useState<
  //   salahTrackingArrayType[]
  // >([]);
  const [salahTrackingArray, setSalahTrackingArray] = useState<
    salahTrackingEntryType[]
  >([]);
  const [heading, setHeading] = useState("");

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

  const pageStyles: string = `pb-[15vh] pt-[15vh] mx-3`;

  return (
    <BrowserRouter>
      <section className="App">
        <div className="fixed w-full bg-black h-[7vh] z-20"></div>
        <h1 className="fixed w-full bg-black text-center mt-[6vh]">
          {heading}
        </h1>
        <Routes>
          <Route
            path="/ResourcesPage"
            element={
              <ResourcesPage
                // title={<h1 className={h1ClassStyles}>{"Resources"}</h1>}
                setHeading={setHeading}
                pageStyles={pageStyles}
              />
            }
          />
          <Route
            index
            element={
              <HomePage
                // title={<h1 className={h1ClassStyles}>{"Home"}</h1>}
                // title={heading}
                setHeading={setHeading}
                pageStyles={pageStyles}
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
                setHeading={setHeading}
                // title={<h1 className={h1ClassStyles}>{"Settings"}</h1>}
                pageStyles={pageStyles}
              />
            }
          />
          <Route
            path="/StatsPage"
            element={
              <StatsPage
                // title={<h1 className={h1ClassStyles}>{"Stats"}</h1>}
                pageStyles={pageStyles}
                setHeading={setHeading}
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
                setHeading={setHeading}
                // title={<h1 className={h1ClassStyles}>{"Qibla Direction"}</h1>}
                pageStyles={pageStyles}
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
