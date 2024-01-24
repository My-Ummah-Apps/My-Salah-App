import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Modal from "react-modal";
// @ts-ignore
import Switch from "react-ios-switch";
import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
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
        <SettingIndividual
          icon={<FaHandHoldingHeart />}
          headingText={"Contribute"}
          subText={"Support our work"}
        />
        {/* {Capacitor.getPlatform() == "ios" ? ( */}

        {/* ) : null}{" "} */}
        {Capacitor.isNativePlatform() ? (
          <div className="rounded-md shadow-md individual-section-wrap bg-slate-500 my-[1rem] w-[90%] mx-auto p-0.5 relative ">
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
        <div className="rounded-md shadow-md individual-section-wrap bg-slate-500 my-[1rem] w-[90%] mx-auto p-0.5 relative ">
          <div
            className="flex items-center justify-between py-2 mx-2 theme-wrap"
            onClick={() => {
              //   handleOpenModal();
              //   setFormTheme(true);
            }}
          >
            <div
              className="self-center py-2 mx-2 text-wrap"
              style={{ display: "block" }}
            >
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

        <div className="rounded-md shadow-md individual-section-wrap bg-slate-500 my-[1rem] w-[90%] mx-auto p-0.5 relative ">
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
            className="flex items-center justify-between py-2 mx-2 feedback-wrap"
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
            className="flex items-center justify-between py-2 mx-2 website-wrap"
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
