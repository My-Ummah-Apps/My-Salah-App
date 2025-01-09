import { useState, useEffect, useRef } from "react";

// import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Switch from "react-ios-switch";

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
import BottomSheetNotifications from "../components/BottomSheets/BottomSheetNotifications";
import { SQLiteConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";
import { showToast } from "../utils/constants";

interface SettingsPageProps {
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  sqliteConnection: React.MutableRefObject<SQLiteConnection | undefined>;
  dbConnection: any;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  fetchDataFromDB: (isDBImported: boolean) => Promise<void>;
  pageStyles: string;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setShowChangelogModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  setShowChangelogModal,
}: SettingsPageProps) => {
  useEffect(() => {
    setHeading("Settings");
  }, []);

  const importDBRef = useRef<HTMLInputElement | null>(null);
  const diaglogElement = useRef<HTMLDialogElement | null>(null);
  const [dialogElementText, setDialogElementText] = useState<string>("");
  const [
    isMissedSalahCounterOptionChecked,
    setIsMissedSalahCounterOptionChecked,
  ] = useState<boolean>(
    userPreferences.showMissedSalahCount === "0" ? false : true
  );
  const triggerInput = () => {
    if (importDBRef.current) {
      importDBRef.current.click();
    } else {
      console.error("importDBRef.current does not exist");
    }
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
      diaglogElement.current?.close();
      setDialogElementText("");
      await checkAndOpenOrCloseDBConnection("close");
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

          const isDBImported = true;
          await fetchDataFromDB(isDBImported);
        } catch (error) {
          console.error("Error importing backup file", error);
          // Below is in the finally block but had to be duplicated here otherwise wouldn't close on Android
          diaglogElement.current?.close();
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

  useEffect(() => {
    const updateStateAndDB = async () => {
      if (isMissedSalahCounterOptionChecked) {
        await modifyDataInUserPreferencesTable("showMissedSalahCount", "1");
      } else {
        await modifyDataInUserPreferencesTable("showMissedSalahCount", "0");
      }
    };

    updateStateAndDB();
  }, [isMissedSalahCounterOptionChecked]);

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
            <p className="pt-[0.3rem] pb-[0.1rem] text-lg">{"Notifications"}</p>
            <p className="pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
              {"Toggle Notifications"}
            </p>
          </div>
          <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
          <BottomSheetNotifications
            modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
            setShowNotificationsModal={setShowNotificationsModal}
            showNotificationsModal={showNotificationsModal}
            setUserPreferences={setUserPreferences}
            userPreferences={userPreferences}
          />
        </div>{" "}
        <div
          className={`flex items-center justify-between shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto py-3 px-1 mb-5 rounded-md`}
        >
          <div className="mx-2">
            <p className="pt-[0.3rem] pb-[0.1rem] text-lg">
              {"Missed Salah Counter"}
            </p>
            <p className=" pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
              {"Show Missed Salah Counter"}
            </p>
          </div>
          <Switch
            onColor="#3b82f6"
            checked={isMissedSalahCounterOptionChecked}
            onChange={async () => {
              setIsMissedSalahCounterOptionChecked((prev) => !prev);
            }}
          />
        </div>{" "}
        <div className="my-5">
          <SettingIndividual
            headingText={"Import Data"}
            subText={"Supports backups exported by this app"}
            onClick={triggerInput}
          />
          <SettingIndividual
            headingText={"Export Data"}
            subText={"Generates a file that contains all your data"}
            onClick={async () => {
              await handleDBExport();
            }}
          />
        </div>
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
          headingText={"Changelog"}
          subText={"View Changelog"}
          onClick={() => {
            setShowChangelogModal(true);
          }}
        />
        <SettingIndividual
          headingText={"Feedback"}
          subText={"Report Bugs / Request Features"}
          onClick={() => {
            link(
              "mailto: contact@myummahapps.com?subject=My Salah App Feedback"
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
        <SettingIndividual
          headingText={"Privacy Policy"}
          subText={"View Privacy Policy"}
          onClick={() => {
            link(
              "https://sites.google.com/view/my-salah-app-privacy-policy/home"
            );
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
