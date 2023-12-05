import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Modal from "react-modal";
// @ts-ignore
import Switch from "react-ios-switch";
import { Share } from "@capacitor/share";
// import { LocalNotifications } from "@capacitor/local-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";
import { MdOutlineChevronRight } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";

const SettingsPage = () => {
  let link: any;
  const shareThisAppLink = async () => {
    let link;
    if (Capacitor.getPlatform() == "ios") {
      link = "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967";
    } else if (Capacitor.getPlatform() == "android") {
      link = "https://play.google.com/store/apps/details?id=com.tasbeeh.my";
    }

    await Share.share({
      title: "",
      text: "",
      url: link,
      dialogTitle: "",
    });
  };
  return (
    <div className="settings-page-wrap">
      <div className="settings-page-header">
        <p>Settings</p>
      </div>

      {/* <Modal
            style={modalStyles}
            isOpen={showModal}
            onRequestClose={handleCloseModal}
            closeTimeoutMS={250}
            contentLabel="Modal #2 Global Style Override Example"
          >
            <ThemeOptions
              formTheme={formTheme}
              theme={theme}
              activeBackgroundColor={activeBackgroundColor}
              setTheme={setTheme}
            />
          
          </Modal> */}

      <div className="settings-page-options-and-info-wrap">
        {/* {Capacitor.getPlatform() == "ios" ? ( */}
        <div className="individual-section-wrap">
          <div
            className="support-box-wrap"
            onClick={() => {
              //   handleOpenModal5();
            }}
          >
            <div className="support-box-icon-and-text-wrap">
              {/* <FaJar */}
              <FaHandHoldingHeart
                style={{
                  fontSize: "32px",
                  //   color: activeBackgroundColor,
                }}
              />
              <div className="support-box-text-wrap">
                <p className="support-main-text-heading">Contribute</p>
                <p className="support-sub-text">Support our work</p>
              </div>
            </div>
            <MdOutlineChevronRight className="chevron" />
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
        {/* ) : null}{" "} */}
        {Capacitor.isNativePlatform() ? (
          <div className="individual-section-wrap">
            <div
              className="notifications-wrap"
              onClick={() => {
                // checkNotificationPermissions();
                // handleOpenModal2();
              }}
            >
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Notifications</p>
                <p>Set Notifications</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
            <Modal
              //   style={modalStyles}
              //   isOpen={showModal2}
              //   onRequestClose={handleCloseModal2}
              closeTimeoutMS={250}
              contentLabel="Modal #2 Global Style Override Example"
            >
              {/* <NotificationOptions
                    setMorningNotification={setMorningNotification}
                    morningNotification={morningNotification}
                    afternoonNotification={afternoonNotification}
                    setAfternoonNotification={setAfternoonNotification}
                    eveningNotification={eveningNotification}
                    setEveningNotification={setEveningNotification}
                    activeBackgroundColor={activeBackgroundColor}
                  /> */}
            </Modal>
          </div>
        ) : null}
        <div className="individual-section-wrap">
          <div
            className="theme-wrap"
            onClick={() => {
              //   handleOpenModal();
              //   setFormTheme(true);
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Dark Theme</p>
              <p>
                Toggle between Light / Dark Theme
                {/* Current Theme: {theme == "light" ? "Light" : "Dark"} */}
                {/* Current Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} */}
              </p>
            </div>
            {/* <MdOutlineChevronRight className="chevron" /> */}
            <Switch
              //   checked={theme == "light" ? false : true}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={() => {
                // if (theme == "light") {
                if (false) {
                  //   setTheme("dark");
                  if (Capacitor.isNativePlatform()) {
                    StatusBar.setBackgroundColor({ color: "#242424" });
                    StatusBar.setStyle({ style: Style.Dark });
                  }

                  localStorage.setItem("theme", JSON.stringify("dark"));
                  document.body.classList.add("dark");
                  // } else if (theme == "dark") {
                } else if (false) {
                  //   setTheme("light");
                  if (Capacitor.isNativePlatform()) {
                    StatusBar.setBackgroundColor({ color: "#EDEDED" });
                    StatusBar.setStyle({ style: Style.Light });
                  }

                  localStorage.setItem("theme", JSON.stringify("light"));
                  document.body.classList.remove("dark");
                }
              }}
              //   onColor={activeBackgroundColor}
              pendingOffColor={undefined}
              pendingOnColor={undefined}
              readOnly={undefined}
              style={undefined}
            />
          </div>
        </div>
        <div className="individual-section-wrap">
          <div className="individual-row-wrap haptic-wrap">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Haptic Vibration</p>
              <p>Set vibration on every increment</p>
            </div>
            <Switch
              //   checked={haptics}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={() => {
                if (JSON.parse("hi")) {
                  //   setHaptics(false);
                  localStorage.setItem("haptics", JSON.stringify(false));
                } else if (
                  //   JSON.parse(localStorage.getItem("haptics")) == false
                  "hi"
                ) {
                  //   setHaptics(true);
                  localStorage.setItem("haptics", JSON.stringify(true));
                }
              }}
              //   onColor={activeBackgroundColor}
              pendingOffColor={undefined}
              pendingOnColor={undefined}
              readOnly={undefined}
              style={undefined}
            />
            {/* <span className="mt-ios">
                <input id="1" type="checkbox" checked={haptics} />
                <label
                  style={
                    {
                      // boxShadow: `inset 0 0 0 1.5em ${activeBackgroundColor},0 0 0 .1875em ${activeBackgroundColor}`,
                      // boxShadow: 0 0 0 .1875em transparent,0 .375em .375em rgba(0,0,0,.3),
                    }
                  }
                  for="1"
                  onClick={(e) => {
                    if (JSON.parse(localStorage.getItem("haptics")) == true) {
                      setHaptics(false);
                      localStorage.setItem("haptics", JSON.stringify(false));
                    } else if (
                      JSON.parse(localStorage.getItem("haptics")) == false
                    ) {
                      setHaptics(true);
                      localStorage.setItem("haptics", JSON.stringify(true));
                    }
                  }}
                ></label>
              </span> */}
          </div>
          <div className="individual-row-wrap">
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Auto Reset Adhkar</p>
              <p>Adhkar will be reset daily</p>
            </div>
            <Switch
              //   checked={dailyCounterReset}
              className={undefined}
              disabled={undefined}
              handleColor="white"
              name={undefined}
              offColor="white"
              onChange={() => {
                if (
                  //   JSON.parse(localStorage.getItem("dailyCounterReset")) == true
                  "hello"
                ) {
                  //   setDailyCounterReset(false);
                  localStorage.setItem(
                    "dailyCounterReset",
                    JSON.stringify(false)
                  );
                } else if (
                  "bye"
                  //   JSON.parse(localStorage.getItem("dailyCounterReset")) == false
                ) {
                  //   setDailyCounterReset(true);
                  localStorage.setItem(
                    "dailyCounterReset",
                    JSON.stringify(true)
                  );
                }
              }}
              //   onColor={activeBackgroundColor}
              pendingOffColor={undefined}
              pendingOnColor={undefined}
              readOnly={undefined}
              style={undefined}
            />
            {/* <span className="mt-ios">
                <input id="2" type="checkbox" checked={dailyCounterReset} />
                <label
                  for="2"
                  onClick={(e) => {
                    if (
                      JSON.parse(localStorage.getItem("dailyCounterReset")) == true
                    ) {
                      setDailyCounterReset(false);
                      localStorage.setItem(
                        "dailyCounterReset",
                        JSON.stringify(false)
                      );
                    } else if (
                      JSON.parse(localStorage.getItem("dailyCounterReset")) == false
                    ) {
                      setDailyCounterReset(true);
                      localStorage.setItem(
                        "dailyCounterReset",
                        JSON.stringify(true)
                      );
                    }
                  }}
                ></label>
              </span> */}
          </div>
          <div className="reset-adkhar-text-wrap">
            <p
              onClick={() => {
                // handleOpenModal3();
              }}
            >
              Clear all Adhkar
            </p>
            <Modal
              //   style={modalStyles}
              //   isOpen={showModal3}
              //   onRequestClose={handleCloseModal3}
              closeTimeoutMS={250}
              contentLabel="Modal #2 Global Style Override Example"
            >
              {/* <ResetAllCountersAlert
                    resetAllCounters={resetAllCounters}
                    handleCloseModal3={handleCloseModal3}
                  /> */}
            </Modal>
          </div>
        </div>
        <div className="individual-section-wrap">
          {Capacitor.getPlatform() == "android" ? (
            <div
              className="review-wrap"
              onClick={() => {
                link(
                  "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
                );
              }}
            >
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Write a review</p>
                <p>Rate us on the Play Store</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          {Capacitor.getPlatform() == "ios" ? (
            <div
              className="review-wrap"
              onClick={() => {
                link(
                  "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967"
                );
              }}
            >
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Write a review</p>
                <p>Rate us on the App Store</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          {Capacitor.isNativePlatform() ? (
            <div className="share-wrap" onClick={shareThisAppLink}>
              <div className="text-wrap" style={{ display: "block" }}>
                <p>Share</p>
                <p>Share application</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          <div
            className="feedback-wrap"
            onClick={() => {
              link(
                "mailto: contact@myummahapps.com?subject=My Tasbeeh App Feedback"
              );
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Feedback</p>
              <p>Send us your feedback</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          <div
            className="website-wrap"
            onClick={() => {
              link("https://myummahapps.com/");
            }}
          >
            <div className="text-wrap" style={{ display: "block" }}>
              <p>Website</p>
              <p>Visit our website</p>
            </div>
            <MdOutlineChevronRight className="chevron" />
          </div>
          {Capacitor.isNativePlatform() ? (
            <div
              onClick={() => {
                // handleOpenModal4();
              }}
            >
              <div className="text-wrap" style={{ display: "block" }}>
                <p>About</p>
                <p>About us</p>
              </div>
              <MdOutlineChevronRight className="chevron" />
            </div>
          ) : null}
          {/* <Modal
                style={modalStyles}
                isOpen={showModal4}
                onRequestClose={handleCloseModal4}
                closeTimeoutMS={250}
                contentLabel="Modal #2 Global Style Override Example"
              >
                <AboutUs />
              </Modal> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
