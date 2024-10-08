import { useState, useEffect } from "react";

// import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Switch from "react-ios-switch";
import Modal from "react-modal";
// import { SQLiteDBConnection } from "@capacitor-community/sqlite";
// import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
import { PreferenceType, userPreferencesType } from "../types/types";
import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
// import { DBConnectionStateType } from "../types/types";

import { MdOutlineChevronRight } from "react-icons/md";
import NotificationsBottomSheet from "../components/BottomSheets/NotificationsBottomSheet";

interface SettingsPageProps {
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  pageStyles: string;
  modifyDataInUserPreferencesTable: (
    value: string,
    preference: PreferenceType
  ) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const SettingsPage = ({
  setHeading,
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  pageStyles,
  modifyDataInUserPreferencesTable,
  setUserPreferences,
  userPreferences,
}: SettingsPageProps) => {
  useEffect(() => {
    setHeading("Settings");
  }, []);

  // ! CONTINUE FROM HERE
  const exportDB = async () => {
    try {
      let exportedFile = await dbConnection.current.exportToJson("full");
    } catch (error) {
      console.log("Error within exportDB: ", error);
    }
  };

  const writeDBFile = async () => {
    console.log("clicked");

    await Filesystem.writeFile({
      path: "text-txt.txt",
      data: "yo",
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const link = (url: string) => {
    window.location.href = url;
  };

  const [showModal, setShowModal] = useState(false);
  setShowModal;

  return (
    <section className={pageStyles}>
      <div className="settings-page-options-wrap">
        <div
          className={`flex items-center justify-between shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto py-3 px-1 mb-5 rounded-md`}
          onClick={() => {
            setShowNotificationsModal(true);
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
            modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
            setShowNotificationsModal={setShowNotificationsModal}
            showNotificationsModal={showNotificationsModal}
            setUserPreferences={setUserPreferences}
            userPreferences={userPreferences}
          />
        </div>{" "}
        <div className="px-1 py-3 mb-5">
          <SettingIndividual
            headingText={"Export Data"}
            subText={"Generates a file that contains all your data."}
            onClick={() => {
              writeDBFile();
            }}
          />
        </div>
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
