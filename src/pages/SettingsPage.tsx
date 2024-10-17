import { useState, useEffect, useRef } from "react";

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
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";

interface SettingsPageProps {
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  sqliteConnection: React.MutableRefObject<SQLiteConnection | undefined>;
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  fetchDataFromDB: () => Promise<void>;
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
  fetchDataFromDB,
  pageStyles,
  modifyDataInUserPreferencesTable,
  setUserPreferences,
  userPreferences,
}: SettingsPageProps) => {
  useEffect(() => {
    setHeading("Settings");
  }, []);

  const importDBRef = useRef<HTMLInputElement | null>(null);
  const diaglogElement = useRef<HTMLDialogElement | null>(null);
  const [dialogElementText, setDialogElementText] = useState<string>("");

  const triggerInput = () => {
    if (importDBRef.current) {
      importDBRef.current.click();
    } else {
      console.error("importDBRef.current does not exist");
    }
  };

  const showToast = async (text: string, duration: "short" | "long") => {
    await Toast.show({
      text: text,
      position: "center",
      duration: duration,
    });
  };

  const handleDBExport = async () => {
    try {
      if (!sqliteConnection.current) {
        throw new Error("sqliteConnection does not exist");
      }
      await checkAndOpenOrCloseDBConnection("open");
      const rawBackupData = await dbConnection.current.exportToJson("full");
      rawBackupData.export.overwrite = true;
      const exportedDBAsJson = JSON.stringify(rawBackupData.export);

      try {
        await sqliteConnection.current.isJsonValid(exportedDBAsJson);
      } catch (error) {
        throw new Error("Invalid JSON format: " + error);
      }

      const date = new Date();
      const formattedDate = date
        .toISOString()
        .replace(/T/, "-")
        .replace(/[:]/g, "-")
        .slice(0, 19);

      const writeResult = await Filesystem.writeFile({
        path: `mysalahapp-backup-${formattedDate}.json`,
        data: exportedDBAsJson,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      const filePath = writeResult.uri;
      diaglogElement.current?.showModal();
      setDialogElementText("Generating file, please wait...");
      if (Capacitor.isNativePlatform()) {
        try {
          await Share.share({
            title: "mysalahapp-backup",
            files: [filePath],
            dialogTitle: "Share your database backup",
          });
        } catch (error) {
          console.error("Error sharing file: ", error);
          throw new Error("Error sharing file");
        }
      }

      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Cache,
      });
    } catch (error) {
      console.error(error);
    } finally {
      try {
        diaglogElement.current?.close();
        setDialogElementText("");
        await checkAndOpenOrCloseDBConnection("close");
      } catch (error) {
        console.error("Error closing DB connection: ", error);
      }
    }
  };

  const handleDBImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await checkAndOpenOrCloseDBConnection("close");
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!sqliteConnection.current) {
          throw new Error("sqliteConnection does not exist");
        }
        if (!e.target) {
          throw new Error("e.target is null");
        }
        const fileContent = e.target.result;
        if (typeof fileContent !== "string") {
          throw new Error("File content is not a string");
        }

        try {
          await sqliteConnection.current.isJsonValid(fileContent);
          console.log("JSON is valid");
        } catch (error) {
          showToast(`File not recognised, file is invalid - ${error}`, "long");
          throw new Error("JSON is not valid");
        }
        try {
          diaglogElement.current?.showModal();
          setDialogElementText("Importing file, please wait...");
          await sqliteConnection.current.importFromJson(fileContent);
          diaglogElement.current?.close();
          showToast("Import Successful", "short");
          await fetchDataFromDB();
        } catch (error) {
          console.error("Error importing backup file", error);
          showToast(`Unable to import file - ${error}`, "long");
          throw new Error("Error importing backup file");
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file: ", error);
      };
      if (!e.target.files) {
        throw new Error("e.target.files does not exist");
      }

      const file = e.target.files[0];

      if (file) {
        reader.readAsText(file);
      } else {
        throw new Error("No file selected");
      }
    } catch (error) {
      console.error(error);
    } finally {
      diaglogElement.current?.close();
      setDialogElementText("");
    }
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
        <div className="px-1 pb-3">
          <input
            ref={importDBRef}
            className="hidden"
            onChange={handleDBImport}
            type="file"
            accept=".json"
            id="backupfile"
            name="backupfile"
          ></input>
          <dialog
            className="fixed z-50 w-1/2 p-3 text-white transform -translate-x-1/2 rounded-lg shadow-lg -translate-y-3/4 bg-zinc-950 top-3/4 left-1/2"
            ref={diaglogElement}
          >
            {dialogElementText}
          </dialog>
          <SettingIndividual
            headingText={"Import Data"}
            subText={"Supports backups exported by this app"}
            onClick={triggerInput}
          />
        </div>
        <div className="px-1 pb-3 mb-5">
          <SettingIndividual
            headingText={"Export Data"}
            subText={"Generates a file that contains all your data"}
            onClick={async () => {
              await handleDBExport();
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
