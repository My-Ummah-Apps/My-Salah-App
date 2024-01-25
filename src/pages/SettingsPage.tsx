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
      <div className="text-center settings-page-header">
        <p>Settings</p>
      </div>
      <div className="settings-page-options-wrap">
        <SettingIndividual
          className="my-[1rem] rounded-md"
          headingText={"Contribute"}
          subText={"Support our work"}
        />
        <SettingIndividual
          className="my-[1rem] rounded-md"
          headingText={"Notifications"}
          subText={"Set Notifications"}
          onClick={() => {
            // checkNotificationPermissions();
            // handleOpenModal2();
            alert("Notifications clicked");
          }}
        />
        <SettingIndividual
          className="rounded-t-md"
          headingText={"Review"}
          subText={"Rate us on the App Store"}
          onClick={() => {
            link(
              "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
            );
          }}
        />
        {/* {Capacitor.getPlatform() === "android" ? ( */}
        <SettingIndividual
          headingText={"Share"}
          subText={"Share application"}
          onClick={shareThisAppLink}
        />
        <SettingIndividual
          headingText={"Feedback"}
          subText={"Send us your feedback"}
          onClick={() => {
            link(
              "mailto: contact@myummahapps.com?subject=My Tasbeeh App Feedback"
            );
          }}
        />
        <SettingIndividual
          headingText={"Website"}
          subText={"Visit our website"}
          onClick={() => {
            link("https://myummahapps.com/");
          }}
        />
        <SettingIndividual
          className="rounded-b-md"
          headingText={"About"}
          subText={"About us"}
          onClick={() => {
            // handleOpenModal4();
          }}
        />
        <Modal
          //   style={modalStyles}
          //   isOpen={showModal2}
          //   onRequestClose={handleCloseModal2}
          closeTimeoutMS={250}
          contentLabel="Modal #2 Global Style Override Example"
        ></Modal>
        {/* <NotificationOptions
                    setMorningNotification={setMorningNotification}
                    morningNotification={morningNotification}
                    afternoonNotification={afternoonNotification}
                    setAfternoonNotification={setAfternoonNotification}
                    eveningNotification={eveningNotification}
                    setEveningNotification={setEveningNotification}
                    activeBackgroundColor={activeBackgroundColor}
                  /> */}
      </div>
    </div>
  );
};

export default SettingsPage;
