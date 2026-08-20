import { GoCalendar } from "react-icons/go";
import { LATEST_APP_VERSION } from "../utils/changelog";
import { IoBugOutline } from "react-icons/io5";
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
        backgroundColor: "rgb(20, 20, 20)",
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

        <p className="bg-[#9332ed] py-2 px-2 rounded-lg w-fit text-sm font-bold">
          MAJOR UPDATE
          {/* Version {LATEST_APP_VERSION} */}
        </p>

        <p className="mt-2 text-2xl font-extrabold">
          New Feature: Update Multiple Salahs
        </p>

        <section className="mb-[10rem] mt-6">
          <div className="flex mt-5 mb-2">
            <div>
              <GoCalendar className="mr-5 mt-1 text-xl text-[#c583f1]" />
            </div>

            <div>
              <h2 className="m-0 text-lg" style={{ color: "#c583f1" }}>
                Bulk Salah Updates
              </h2>

              <p className="mt-2 text-sm">
                You can now update multiple Salah entries at once from the
                Settings page across a selected date range. Select the prayers,
                status, reasons, and notes you want to apply, then update your
                Salah history in one go.
              </p>
            </div>
          </div>

          <div className="flex mb-2 mt-7">
            <div>
              <IoBugOutline className="mr-5 mt-1 text-xl text-[#b4ae12]" />
            </div>

            <div>
              <h2 className="m-0 text-lg text-[#b4ae12]">
                Bug Fixes & Performance
              </h2>

              <p className="mt-2 text-sm">
                Fixed bugs and improved performance for a smoother experience.
              </p>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => {
            setShowMajorUpdateOverlay(false);
          }}
          className="text-center bg-[#9332ed] p-5 rounded-xl fixed left-1/2 -translate-x-1/2 w-[90%] bottom-5 mb-[env(safe-area-inset-bottom)]"
        >
          Continue
        </button>
      </section>
    </section>
  );
};

export default MajorUpdateOverlay;
