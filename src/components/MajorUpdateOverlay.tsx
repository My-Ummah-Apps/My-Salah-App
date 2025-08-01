import { GoBug, GoRocket } from "react-icons/go";
import { MdOutlinePalette } from "react-icons/md";

interface MajorUpdateOverlayProps {
  setShowMajorUpdateOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

const MajorUpdateOverlay = ({
  setShowMajorUpdateOverlay,
}: MajorUpdateOverlayProps) => {
  return (
    <section
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgb(36, 36, 36)",
        color: "#fff",
        padding: 20,
        zIndex: 9999,
        overflowY: "auto",
        paddingTop: "calc(env(safe-area-inset-top) + 20px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)",
        paddingLeft: "calc(env(safe-area-inset-left) + 20px)",
        paddingRight: "calc(env(safe-area-inset-right) + 20px)",
      }}
    >
      <img src="/src/assets/images/62Xs3GxAQvwZ_1024_500.png"></img>
      <p className="bg-[#9332ed] p-2 rounded-2xl mt-4 mb-4 inline-block text-sm">
        VERSION 4.1
      </p>
      {/* <h1 style={{ color: "#fff" }} className="text-3xl font-bold">
        Light Theme
      </h1>
      <p className="mt-2 mb-6 text-sm">
        You can now switch between light and dark mode via the settings page.
      </p> */}
      <section className="mb-[10rem]">
        <div className="flex items-center mb-5">
          <div>
            <GoRocket className="mr-5 text-3xl text-[#c583f1]" />
          </div>
          <div>
            <h2 style={{ color: "#c583f1" }}>Light Theme Mode</h2>
            <p className="text-sm">
              {" "}
              You can now switch between light, dark and system modes via the
              settings page.
            </p>
          </div>
        </div>
        <div className="flex items-center mb-5">
          <div>
            <MdOutlinePalette className="mr-5 text-3xl text-[#ee7578]" />
          </div>
          <div>
            <h2 style={{ color: "#ee7578" }}>UI Improvements</h2>
            <p className="text-sm">
              {" "}
              Several UI changes bring the app in line with platform design
              standards — the Home icon now appears first in the navigation bar,
              and the missed Salah counter is now shown as a numbered circle.
            </p>
          </div>
        </div>
        <div className="flex items-center mb-5">
          <div>
            <GoBug className="mr-5 text-3xl text-[#f7cb22]" />
          </div>
          <div>
            <h2 style={{ color: "#f7cb22" }}>Bug Fixes</h2>
            <p className="text-sm">
              {" "}
              Fixed several bugs, including launch screen flicker and keyboard
              resize issues on some devices.
            </p>
          </div>
        </div>
      </section>
      <button
        onClick={() => {
          setShowMajorUpdateOverlay(false);
        }}
        className="text-center bg-[#9332ed] p-5 rounded-3xl fixed left-1/2 -translate-x-1/2 w-[90%] bottom-5 mb-[env(safe-area-inset-bottom)]"
      >
        Continue
      </button>
    </section>
  );
};

export default MajorUpdateOverlay;
