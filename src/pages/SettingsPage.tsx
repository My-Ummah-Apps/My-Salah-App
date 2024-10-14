import { useState, useEffect } from "react";

// import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Switch from "react-ios-switch";
import Modal from "react-modal";
// import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
import {
  DBConnectionStateType,
  PreferenceType,
  userPreferencesType,
} from "../types/types";
import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
// import { DBConnectionStateType } from "../types/types";

import { MdOutlineChevronRight } from "react-icons/md";
import NotificationsBottomSheet from "../components/BottomSheets/NotificationsBottomSheet";
import { SQLiteConnection } from "@capacitor-community/sqlite";

interface SettingsPageProps {
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  sqliteConnection: React.MutableRefObject<SQLiteConnection | undefined>;
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
  sqliteConnection,
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

  const exportDB = async () => {
    try {
      if (!sqliteConnection.current) {
        throw new Error("sqliteConnection does not exist");
      }
      await checkAndOpenOrCloseDBConnection("open");
      const rawBackupData = await dbConnection.current.exportToJson("full");
      const exportedDBAsJson = JSON.stringify(rawBackupData.export);

      try {
        await sqliteConnection.current.isJsonValid(exportedDBAsJson);
      } catch (error) {
        throw new Error("Invalid JSON format: " + error);
      }

      console.log(exportedDBAsJson);

      await Filesystem.writeFile({
        path: "mysalahapp-backup.json",
        data: exportedDBAsJson,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      // await Share.share({
      //   title: "mysalahapp-backup",
      //   text: exportedDBAsJson,
      //   dialogTitle: "Share your database backup",
      // });
    } catch (error) {
      console.error(error);
      // alert(error);
    } finally {
      try {
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error(error);
        // alert(error);
      }
    }
  };

  const handleDBImport = async (e) => {
    console.log("E: ", e);

    try {
      await checkAndOpenOrCloseDBConnection("close");
      const reader = new FileReader();
      // let fileContent;
      reader.onload = async (e) => {
        if (!sqliteConnection.current) {
          throw new Error("sqliteConnection does not exist");
        }
        const fileContent = e.target?.result;
        console.log("File content:", fileContent);

        try {
          await sqliteConnection.current.isJsonValid(fileContent);
          console.log("JSON is valid");
        } catch (error) {
          throw new Error("JSON is not valid");
        }

        await sqliteConnection.current.importFromJson(fileContent);
      };
      reader.onerror = (error) => {
        console.error("Error reading file: ", error);
      };
      const file = e.target.files[0];

      if (file) {
        reader.readAsText(file);
      } else {
        throw new Error("No file selected");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const writeDBFile = async () => {
    console.log("clicked");
    await exportDB();
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
        <div
          // onClick={(e) => {
          //   handleDBImport(e);
          // }}
          className="px-1 pb-3"
        >
          {/* <label for="backupfile">Select a file:</label> */}
          <input
            className=""
            onChange={handleDBImport}
            type="file"
            // accept=".json"
            id="backupfile"
            name="backupfile"
          ></input>
          <SettingIndividual
            headingText={"Import Data"}
            subText={"Supports backups exported by this app"}
          />
        </div>
        <div className="px-1 pb-3 mb-5">
          <SettingIndividual
            headingText={"Export Data"}
            subText={"Generates a file that contains all your data"}
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
