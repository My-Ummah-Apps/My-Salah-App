import { useState, useEffect } from "react";
// import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Switch from "react-ios-switch";
import Modal from "react-modal";
// import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";

// import {
//   checkNotificationPermissions,
//   requestPermissionFunction,
// } from "../utils/notifications";

import { MdOutlineChevronRight } from "react-icons/md";
import NotificationsBottomSheet from "../components/BottomSheets/NotificationsBottomSheet";
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

  const [handleNotificationsModal, setHandleNotificationsModal] =
    useState(false);

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
        <div
          // style={{ display: "none" }}
          className={` flex items-center justify-between  shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto py-3 px-1 mb-[1rem] rounded-md`}
          onClick={() => {
            setHandleNotificationsModal(true);
          }}
        >
          <div className="mx-2">
            <p className="support-main-text-heading pt-[0.3rem] pb-[0.1rem] text-lg">
              {"Notifications"}
            </p>
            <p className="support-sub-text pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
              {"Notification time"}
            </p>
          </div>
          <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
          <NotificationsBottomSheet
            setHandleNotificationsModal={setHandleNotificationsModal}
            handleNotificationsModal={handleNotificationsModal}
          />
        </div>{" "}
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
  );
};

export default SettingsPage;
