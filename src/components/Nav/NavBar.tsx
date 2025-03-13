import { NavLink } from "react-router-dom";
import { BsFillHouseDoorFill, BsFillNutFill } from "react-icons/bs";
// import { FaCompass } from "react-icons/fa";
// import { GrResources } from "react-icons/gr";
import { RiBarChart2Fill } from "react-icons/ri";
import { RiBarChart2Line } from "react-icons/ri";
import { BsHouseDoor } from "react-icons/bs";
import { BsNut } from "react-icons/bs";

const NavBar = () => {
  const activeBackgroundColor = "grey";

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 h-[10vh] bottom-0 z-10 flex items-center justify-around w-full bg-[var(--primary-color)] navbar-wrap pb-env-safe-area-inset-bottom">
      <NavLink className="nav-link px-3 pt-0.5" to="/SettingsPage">
        {({ isActive }) => (
          <div>
            {isActive ? (
              <BsFillNutFill
                className="m-4 text-2xl nav-icon"
                color={activeBackgroundColor}
              />
            ) : (
              <BsNut className="m-4 text-2xl nav-icon" color="grey" />
            )}
          </div>
        )}
      </NavLink>
      <NavLink className="nav-link px-3 pt-0.5" to="/">
        {({ isActive }) => (
          <div>
            {isActive ? (
              <BsFillHouseDoorFill
                className="m-4 text-2xl nav-icon"
                color={activeBackgroundColor}
              />
            ) : (
              <BsHouseDoor className="m-4 text-2xl nav-icon" color="grey" />
            )}
          </div>
        )}
      </NavLink>
      <NavLink className="nav-link px-3 pt-0.5" to="/StatsPage">
        {({ isActive }) => (
          <div>
            {isActive ? (
              <RiBarChart2Fill
                className="m-4 text-2xl nav-icon"
                color={activeBackgroundColor}
              />
            ) : (
              <RiBarChart2Line className="m-4 text-2xl nav-icon" color="grey" />
            )}
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default NavBar;
