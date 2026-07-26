import { GoCalendar, GoHome } from "react-icons/go";
import { LATEST_APP_VERSION } from "../utils/changelog";

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
      <section className="flex flex-col justify-center h-full">
        {/* <p className="mb-2 opacity-70">Version 4.8</p> */}

        <p className="bg-[#9332ed] py-2 px-2 rounded-2xl w-fit text-lg">
          {/* MAJOR UPDATE  */}
          Version {LATEST_APP_VERSION}
        </p>

        <p className="mt-5 text-2xl">
          Date navigation is now faster and easier
        </p>

        <section className="mb-[10rem]">
          <div className="flex items-center mt-5 mb-2">
            <div>
              <GoCalendar className="mr-5 text-3xl text-[#c583f1]" />
            </div>

            <div>
              <h2 style={{ color: "#c583f1" }}>Calendar Navigation</h2>

              <p className="text-sm">
                Year navigation buttons have been added to the monthly calendar,
                allowing you to quickly move forwards or backwards by a full
                year.
              </p>
            </div>
          </div>

          <div className="flex items-center mb-2">
            <div>
              <GoHome className="mr-5 text-3xl text-[#f7cb22]" />
            </div>

            <div>
              <h2 style={{ color: "#f7cb22" }}>Homepage Navigation</h2>

              <p className="text-sm">
                Quick navigation buttons have been added to the homepage,
                allowing you to move forwards or backwards through your Salah
                history by 30 days or one year. The buttons automatically appear
                when you scroll.
              </p>
            </div>
          </div>
        </section>

        <button
          type="button"
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
