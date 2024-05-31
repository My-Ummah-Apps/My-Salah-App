import { useState } from "react";
// import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Modal from "react-modal";
// @ts-ignore
// import Switch from "react-ios-switch";
// import { Share } from "@capacitor/share";
// import { FaHandHoldingHeart } from "react-icons/fa";

// import { StatusBar, Style } from "@capacitor/status-bar";
import { MdOutlineChevronRight } from "react-icons/md";
// import Switch from "rc-switch";

const SettingIndividual = ({
  headingText,
  subText,
  indvidualStyles,
  onClick,
}: {
  headingText: string;
  subText: string;
  indvidualStyles?: string;
  onClick: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  setShowModal;
  return (
    <>
      <div
        className={`flex items-center justify-between py-1 shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto p-0.5 ${indvidualStyles}`}
        onClick={onClick}
      >
        {/* {headingText === "Contribute" ? (
            <FaHandHoldingHeart
              style={{
                fontSize: "32px",
              }}
            />
          ) : null} */}
        <div className="mx-2">
          <p className="support-main-text-heading pt-[0.3rem] pb-[0.1rem] text-lg">
            {headingText}
          </p>
          <p className="support-sub-text pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
            {subText}
          </p>
        </div>
        <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
      </div>

      <Modal
        // style={modalStyles}
        isOpen={showModal}
        // onRequestClose={handleCloseModal5}
        closeTimeoutMS={250}
        contentLabel="Modal #2 Global Style Override Example"
      >
        <div className="tip-box-wrap">
          {/* <div> */}
          <p
            className="tip-jar-box-first-line-of-text tip-jar-box-text"
            style={
              {
                //   backgroundColor: activeBackgroundColor,
              }
            }
          ></p>

          <p
            className="tip-jar-box-text"
            style={
              {
                //   backgroundColor: activeBackgroundColor,
              }
            }
          >
            MyUmmahApps Ltd provides free, open source applications for the
            Muslim community, these applications contain no ads.
          </p>

          <p
            className="tip-jar-box-text"
            style={
              {
                //   backgroundColor: activeBackgroundColor,
              }
            }
          >
            {" "}
            Your support will help us continue serving the Ummah in this
            endeavor.
          </p>

          <p
            className="tip-jar-box-text"
            style={
              {
                //   backgroundColor: activeBackgroundColor,
              }
            }
          >
            {" "}
            May Allah reward you.
          </p>

          {/* </div> */}

          {/* {!iapProducts ? (
                    <p style={{ padding: "2rem" }}>Loading...</p>
                  ) : (
                    iapProducts.map((item) => {
                      return (
                        <div
                          className="tip-wrap"
                          onClick={() => {
                            triggerPurchase(item.identifier);
                            handleOpenModal6();
                          }}
                        >
                          <p>{item.title}</p>
                          <p>{item.priceString}</p>
                        </div>
                      );
                    })
                  )} */}
          <Modal
            // style={modalStyles}
            isOpen={showModal}
            // onRequestClose={handleCloseModal
            closeTimeoutMS={250}
            contentLabel="Modal #2 Global Style Override Example"
          >
            {" "}
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Modal>
        </div>
      </Modal>
    </>
  );
};

export default SettingIndividual;

// <Switch
// //   checked={theme == "light" ? false : true}
// className={undefined}
// disabled={undefined}
// handleColor="white"
// name={undefined}
// offColor="white"
// onChange={() => {
//   // if (theme == "light") {
//   if (false) {
//     //   setTheme("dark");
//     if (Capacitor.isNativePlatform()) {
//       StatusBar.setBackgroundColor({ color: "#242424" });
//       StatusBar.setStyle({ style: Style.Dark });
//     }

//     localStorage.setItem("theme", JSON.stringify("dark"));
//     document.body.classList.add("dark");
//     // } else if (theme == "dark") {
//   } else if (false) {
//     //   setTheme("light");
//     if (Capacitor.isNativePlatform()) {
//       StatusBar.setBackgroundColor({ color: "#EDEDED" });
//       StatusBar.setStyle({ style: Style.Light });
//     }

//     localStorage.setItem("theme", JSON.stringify("light"));
//     document.body.classList.remove("dark");
//   }
// }}
// //   onColor={activeBackgroundColor}
// pendingOffColor={undefined}
// pendingOnColor={undefined}
// readOnly={undefined}
// style={undefined}
// />
