import { GoBug, GoClock } from "react-icons/go";

import image from "../assets/images/Screenshot_20260216_203304.png";

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
      {/* <img height={100} width={80} src={image}></img> */}
      <section className="">
        <p className="mb-2">Version 4.8</p>
        <p className="bg-[#9332ed] p-2 rounded-2xl inline-block">
          MAJOR UPDATE
        </p>
        <p className="mt-5 text-2xl">Salah times have now been added</p>

        <section className="mb-[10rem]">
          <div className="flex items-center mt-5 mb-2">
            <div>
              <GoClock className="mr-5 text-3xl text-[#c583f1]" />
            </div>
            <div>
              <h2 style={{ color: "#c583f1" }}>Salah Times</h2>
              <p className="text-sm">
                {" "}
                You can now view daily Salah times in the app to help you stay
                on track throughout the day. Head over to the Salah Times page
                to get started.
              </p>
            </div>
          </div>

          <div className="flex items-center mb-2">
            <div>
              <GoBug className="mr-5 text-3xl text-[#f7cb22]" />
            </div>
            <div>
              <h2 style={{ color: "#f7cb22" }}>Bug Fixes</h2>
              <p className="text-sm"> Fixed several minor bugs.</p>
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
    </section>
  );
};

export default MajorUpdateOverlay;
