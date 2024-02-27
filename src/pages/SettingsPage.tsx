import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import Modal from "react-modal";
// import Switch from "react-ios-switch";
import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
// import { LocalNotifications } from "@capacitor/local-notifications";
// import { StatusBar, Style } from "@capacitor/status-bar";

const SettingsPage = ({
  title,
  pageStyles,
}: {
  title: React.ReactNode;
  pageStyles: string;
}) => {
  let appLink: string;
  const shareThisAppLink = async () => {
    if (Capacitor.getPlatform() == "ios") {
      appLink = "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967";
    } else if (Capacitor.getPlatform() == "android") {
      appLink = "https://play.google.com/store/apps/details?id=com.tasbeeh.my";
    }

    await Share.share({
      title: "",
      text: "",
      url: appLink,
      dialogTitle: "",
    });
  };

  const link = (url: string) => {
    window.location.href = url;
  };

  const [showModal, setShowModal] = useState(false);
  setShowModal;

  return (
    <section className={pageStyles}>
      <div className="text-center settings-page-header ">
        <h1>{title}</h1>
      </div>
      <div className="settings-page-options-wrap">
        <SettingIndividual
          indvidualStyles={"mb-[1rem] rounded-md"}
          headingText={"Contribute"}
          subText={"Support our work"}
          onClick={() => {}}
        />
        <SettingIndividual
          indvidualStyles={"my-[1rem] rounded-md"}
          headingText={"Notifications"}
          subText={"Set Notifications"}
          onClick={() => {
            // checkNotificationPermissions();
            // handleOpenModal2();
            alert("Notifications clicked");
          }}
        />
        {Capacitor.getPlatform() === "android" ? (
          <SettingIndividual
            indvidualStyles={"rounded-t-md"}
            headingText={"Review"}
            subText={"Rate us on the Google Play Store"}
            onClick={() => {
              link(
                "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
              );
            }}
          />
        ) : null}
        {Capacitor.getPlatform() === "ios" ? (
          <SettingIndividual
            indvidualStyles={"rounded-t-md"}
            headingText={"Review"}
            subText={"Rate us on the App Store"}
            onClick={() => {
              link(
                "https://play.google.com/store/apps/details?id=com.tasbeeh.my"
              );
            }}
          />
        ) : null}
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
          indvidualStyles="rounded-b-md"
          headingText={"About"}
          subText={"About us"}
          onClick={() => {
            // handleOpenModal4();
          }}
        />
        <Modal
          //   style={modalStyles}
          isOpen={showModal}
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
    </section>
  );
};

export default SettingsPage;
