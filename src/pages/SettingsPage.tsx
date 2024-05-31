import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Switch from "react-ios-switch";
import Modal from "react-modal";
// import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
import {
  checkNotificationPermissions,
  requestPermissionFunction,
} from "../utils/notifications";
import { MdOutlineChevronRight } from "react-icons/md";
// import Switch from "rc-switch";
// import { StatusBar, Style } from "@capacitor/status-bar";

const SettingsPage = ({
  // title,
  setHeading,
  pageStyles,
}: {
  // title: React.ReactNode;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
}) => {
  useEffect(() => {
    setHeading("Settings");
  }, []);

  const [dailyNotification, setDailyNotification] = useState(false);

  // Check if notification permissions have been granted
  useEffect(() => {
    const initialiseNotifications = async () => {
      const permissionStatus = await checkNotificationPermissions();
      if (permissionStatus === "denied") {
        setDailyNotification(false);
        // await scheduleMorningNotifications();
      } else if (
        permissionStatus === "prompt" ||
        permissionStatus === "prompt-with-rationale"
      ) {
        setDailyNotification(false);
        requestPermissionFunction();
      } else if (permissionStatus === "granted") {
        setDailyNotification(true);
      }
    };

    initialiseNotifications();
  }, []);

  // console.log(checkNotificationPermissions());
  // console.log(requestPermissionFunction());

  // let appLink: string;
  // const shareThisAppLink = async () => {
  //   if (Capacitor.getPlatform() == "ios") {
  //     appLink = "https://apps.apple.com/us/app/my-tasbeeh-app/id6449438967";
  //   } else if (Capacitor.getPlatform() == "android") {
  //     appLink = "https://play.google.com/store/apps/details?id=com.tasbeeh.my";
  //   }

  //   await Share.share({
  //     title: "",
  //     text: "",
  //     url: appLink,
  //     dialogTitle: "",
  //   });
  // };

  const link = (url: string) => {
    window.location.href = url;
  };

  const [showModal, setShowModal] = useState(false);
  setShowModal;

  return (
    <section className={pageStyles}>
      <div className="text-center settings-page-header ">
        {/* <h1>{title}</h1> */}
      </div>
      <div className="settings-page-options-wrap">
        {/* <SettingIndividual
          indvidualStyles={"mb-[1rem] rounded-md"}
          headingText={"Contribute"}
          subText={"Support our work"}
          onClick={() => {}}
        /> */}
        <div
          className={`flex items-center justify-between py-1 shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto p-0.5 mb-[1rem] rounded-md`}
          // onClick={onClick}
        >
          <div className="mx-2">
            <p className="support-main-text-heading pt-[0.3rem] pb-[0.1rem] text-lg">
              {"Notifications"}
            </p>
            <p className="support-sub-text pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
              {"Notification time"}
            </p>
          </div>
          <Switch
            checked={dailyNotification}
            className={undefined}
            disabled={undefined}
            handleColor="white"
            name={undefined}
            offColor="white"
            onChange={() => {
              // if (checked === false) {
              // }
            }}
            onColor="lightblue"
            pendingOffColor={undefined}
            pendingOnColor={undefined}
            readOnly={undefined}
            style={undefined}
          />
        </div>
        {/* <SettingIndividual
          indvidualStyles={"my-[1rem] rounded-md"}
          headingText={"Notifications"}
          subText={"Set Notifications"}
          onClick={() => {
            // checkNotificationPermissions();
            // handleOpenModal2();
            alert("Notifications clicked");
          }}
        /> */}
        {/* 
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
        ) : null} */}
        {/* {Capacitor.getPlatform() === "android" ? ( */}
        {/* <SettingIndividual
          headingText={"Share"}
          subText={"Share application"}
          onClick={shareThisAppLink}
        /> */}
        <SettingIndividual
          headingText={"Feedback"}
          subText={"Report Bugs"}
          onClick={() => {
            link(
              "mailto: contact@myummahapps.com?subject=My Salah App (Beta) Feedback"
            );
          }}
        />
        {/* <SettingIndividual
          headingText={"Website"}
          subText={"Visit our website"}
          onClick={() => {
            link("https://myummahapps.com/");
          }}
        /> */}
        {/* <SettingIndividual
          indvidualStyles="rounded-b-md"
          headingText={"About"}
          subText={"About us"}
          onClick={() => {
            // handleOpenModal4();
          }}
        /> */}
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
