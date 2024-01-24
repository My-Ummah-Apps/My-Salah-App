// import { FaHandHoldingHeart } from "react-icons/fa";
import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Modal from "react-modal";
// @ts-ignore
import Switch from "react-ios-switch";
import { Share } from "@capacitor/share";

// import { LocalNotifications } from "@capacitor/local-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";
import { MdOutlineChevronRight } from "react-icons/md";

interface ChildComponentProps {
  icon: React.ReactNode;
}

const SettingIndividual: React.FC<ChildComponentProps> = ({
  icon,
  headingText,
  subText,
}) => {
  console.log(icon);
  return (
    <>
      <div className="rounded-md shadow-md individual-section-wrap bg-slate-500 my-[1rem] w-[90%] mx-auto p-0.5">
        <div
          className="flex items-center justify-between support-box-wrap mx-[0.5rem]"
          onClick={() => {
            //   handleOpenModal5();
          }}
        >
          <div className="support-box-icon-and-text-wrap flex items-center justify-between mx-[0.5rem] py-[0.5rem]">
            <icon
              style={{
                fontSize: "32px",
                //   color: activeBackgroundColor,
              }}
            />
            <div className="mx-2 support-box-text-wrap">
              <p className="support-main-text-heading pt-[0.3rem] pb-[0.1rem] px-2] text-lg">
                {headingText}
              </p>
              <p className="support-sub-text pt-[0.3rem] px-2 pb-[0.1rem] text-[0.8rem] font-light">
                {subText}
              </p>
            </div>
          </div>
          <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
        </div>

        <Modal
          // style={modalStyles}
          // isOpen={showModal5}
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
              // isOpen={showModal6}
              // onRequestClose={handleCloseModal5}
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
      </div>
    </>
  );
};

export default SettingIndividual;
