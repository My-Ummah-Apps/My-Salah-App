import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
import {
  LocationsDataObjTypeArr,
  themeType,
  userPreferencesType,
} from "../types/types";
import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
import { MdOutlineChevronRight } from "react-icons/md";
import BottomSheetNotifications from "../components/BottomSheets/BottomSheetNotifications";
import {
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";
import {
  updateUserPrefs,
  //  pageTransitionStyles,
  showToast,
} from "../utils/helpers";
import BottomSheetStartDate from "../components/BottomSheets/BottomSheetStartDate";
import BottomSheetAboutUs from "../components/BottomSheets/BottomSheetAboutUs";
import BottomSheetEditReasons from "../components/BottomSheets/BottomSheetEditReasons";
import BottomSheetChangelog from "../components/BottomSheets/BottomSheetChangeLog";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import BottomSheetThemeOptions from "../components/BottomSheets/BottomSheetThemeOptions";
import { toggleDBConnection } from "../utils/dbUtils";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahTimesSettings";

interface SettingsPageProps {
  sqliteConnection: React.MutableRefObject<SQLiteConnection | undefined>;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  isAppActive: boolean;
  theme: themeType;
  handleTheme: (theme?: themeType) => string;
  fetchDataFromDB: (isDBImported?: boolean) => Promise<void>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setShowSalahTimesSettingsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showSalahTimesSettingsSheet: boolean;
  userPreferences: userPreferencesType;
  userLocations: LocationsDataObjTypeArr;
}

const SettingsPage = ({
  sqliteConnection,
  dbConnection,
  isAppActive,
  theme,
  handleTheme,
  fetchDataFromDB,
  setUserPreferences,
  setShowSalahTimesSettingsSheet,
  showSalahTimesSettingsSheet,
  userPreferences,
  userLocations,
}: SettingsPageProps) => {
  const shareThisAppLink = async (link: string) => {
    await Share.share({
      title: "",
      text: "",
      url: link,
      dialogTitle: "",
    });
  };

  const importDBRef = useRef<HTMLInputElement | null>(null);
  // const datePickerRef = useRef<HTMLInputElement | null>(null);
  const diaglogElement = useRef<HTMLDialogElement | null>(null);
  const [dialogElementText, setDialogElementText] = useState<string>("");
  const [
    isMissedSalahCounterOptionChecked,
    setIsMissedSalahCounterOptionChecked,
  ] = useState<boolean>(
    userPreferences.showMissedSalahCount === "0" ? false : true,
  );

  // const page = useRef(null);
  // const [presentingElement, setPresentingElement] =
  //   useState<HTMLElement | null>(null);

  // useEffect(() => {
  //   setPresentingElement(page.current);
  // }, []);

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
      await toggleDBConnection(dbConnection, "open");
      const rawBackupData = await dbConnection.current!.exportToJson("full");
      rawBackupData.export!.overwrite = true;
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
      await toggleDBConnection(dbConnection, "close");
    }
  };

  const handleDBImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await toggleDBConnection(dbConnection, "close");
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

  const link = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    const updateStateAndDB = async () => {
      if (isMissedSalahCounterOptionChecked) {
        await updateUserPrefs(
          dbConnection,
          "showMissedSalahCount",
          "1",
          setUserPreferences,
        );
      } else {
        await updateUserPrefs(
          dbConnection,
          "showMissedSalahCount",
          "0",
          setUserPreferences,
        );
      }
    };

    updateStateAndDB();
  }, [isMissedSalahCounterOptionChecked]);

  return (
    <IonPage
    // ref={page}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-header-toolbar">
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <motion.section
          // {...pageTransitionStyles}
          className={`settings-page-wrap`}
        >
          <div className="settings-page-options-wrap">
            <div
              className={`flex items-center justify-between individual-setting-wrap bg-[var(--card-bg-color)] mx-auto py-3 px-1 mb-5 rounded-md`}
              id="open-notification-options-sheet"
            >
              <div className="mx-2">
                <p className="pt-[0.3rem] pb-[0.1rem] text-lg">Notifications</p>
                <p className="pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
                  Toggle Notifications
                </p>
              </div>
              <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
              <BottomSheetNotifications
                dbConnection={dbConnection}
                triggerId="open-notification-options-sheet"
                isAppActive={isAppActive}
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                userLocations={userLocations}
              />
            </div>{" "}
            <div className="my-5 rounded-md">
              <SettingIndividual
                id="open-theme-options-sheet"
                headingText={"Theme"}
                subText={`Change theme`}
              />
            </div>
            <div className="my-5 rounded-md">
              <SettingIndividual
                onClick={() => {
                  if (userLocations.length === 0) {
                    alert(
                      "Please add a location or set up Salah times on the Salah times page first.",
                    );
                    return;
                  }
                  setShowSalahTimesSettingsSheet(true);
                }}
                headingText={"Salah Times Settings"}
                subText={`Adjust how Salah times are calculated for your location`}
              />
              <BottomSheetSalahTimesSettings
                setShowSalahTimesSettingsSheet={setShowSalahTimesSettingsSheet}
                showSalahTimesSettingsSheet={showSalahTimesSettingsSheet}
                dbConnection={dbConnection}
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                userLocations={userLocations}
              />
            </div>
            <BottomSheetThemeOptions
              dbConnection={dbConnection}
              triggerId={"open-theme-options-sheet"}
              setUserPreferences={setUserPreferences}
              theme={theme}
              handleTheme={handleTheme}
            />
            <div
              className={`flex items-center justify-between individual-setting-wrap bg-[var(--card-bg-color)] mx-auto py-3 px-1 mb-5 rounded-md`}
            >
              <div className="mx-2">
                <p className="pt-[0.3rem] pb-[0.1rem] text-lg">
                  {"Missed Salah Counter"}
                </p>
                <p className=" pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
                  {"Display missed salah counter (when applicable) on homepage"}
                </p>
              </div>
              <section className="pl-4 pr-2">
                <IonToggle
                  style={{ "--track-background": "#555" }}
                  checked={isMissedSalahCounterOptionChecked}
                  onIonChange={async () => {
                    setIsMissedSalahCounterOptionChecked((prev) => !prev);
                  }}
                ></IonToggle>
              </section>
            </div>{" "}
            <div className="my-5">
              <SettingIndividual
                indvidualStyles={"border-b border-[var(--app-border-color)]"}
                id="open-change-start-date-sheet"
                headingText={"Change Start Date"}
                subText={`Change app start date`}
              />
              <BottomSheetStartDate
                dbConnection={dbConnection}
                triggerId={"open-change-start-date-sheet"}
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                fetchDataFromDB={fetchDataFromDB}
              />
              <SettingIndividual
                id="open-edit-reasons-sheet"
                headingText={"Edit Reasons"}
                subText={`Add or remove reasons`}
              />
              <BottomSheetEditReasons
                dbConnection={dbConnection}
                triggerId={"open-edit-reasons-sheet"}
                setUserPreferences={setUserPreferences}
                userPreferences={userPreferences}
                // presentingElement={presentingElement}
              />
            </div>
            <div className="my-5">
              <SettingIndividual
                indvidualStyles={"border-b border-[var(--app-border-color)]"}
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
            {Capacitor.getPlatform() === "android" && (
              <SettingIndividual
                indvidualStyles={
                  "rounded-t-md, border-b border-[var(--app-border-color)]"
                }
                headingText={"Review"}
                subText={"Rate us on the Google Play Store"}
                onClick={() => {
                  link(
                    "https://play.google.com/store/apps/details?id=com.mysalahapp.app",
                  );
                }}
              />
            )}
            {Capacitor.getPlatform() === "ios" && (
              <SettingIndividual
                indvidualStyles={"rounded-t-md"}
                headingText={"Review"}
                subText={"Rate us on the App Store"}
                onClick={() => {
                  link(
                    "https://apps.apple.com/gb/app/my-salah-app/id6478277078",
                  );
                }}
              />
            )}
            {Capacitor.isNativePlatform() && (
              <SettingIndividual
                indvidualStyles={"rounded-t-md"}
                headingText={"Share"}
                subText={"Share application"}
                onClick={() => {
                  if (Capacitor.getPlatform() === "android") {
                    shareThisAppLink(
                      "https://play.google.com/store/apps/details?id=com.mysalahapp.app",
                    );
                  } else if (Capacitor.getPlatform() === "ios") {
                    shareThisAppLink(
                      "https://apps.apple.com/gb/app/my-salah-app/id6478277078",
                    );
                  }
                }}
              />
            )}
            <SettingIndividual
              indvidualStyles={
                "rounded-t-md border-b border-[var(--app-border-color)]"
              }
              id="open-changelog-sheet"
              headingText={"Changelog"}
              subText={"View Changelog"}
            />
            <BottomSheetChangelog triggerId="open-changelog-sheet" />
            <SettingIndividual
              indvidualStyles={"border-b border-[var(--app-border-color)]"}
              headingText={"Feedback"}
              subText={"Report Bugs / Request Features"}
              onClick={() => {
                link(
                  "mailto: contact@myummahapps.com?subject=My Salah App Feedback",
                );
              }}
            />
            <SettingIndividual
              indvidualStyles={"border-b border-[var(--app-border-color)]"}
              headingText={"Website"}
              subText={"Visit our website"}
              onClick={() => {
                link("https://myummahapps.com/");
              }}
            />
            <SettingIndividual
              indvidualStyles={"border-b border-[var(--app-border-color)]"}
              headingText={"Privacy Policy"}
              subText={"View Privacy Policy"}
              onClick={() => {
                link(
                  "https://sites.google.com/view/my-salah-app-privacy-policy/home",
                );
              }}
            />
            <SettingIndividual
              indvidualStyles={"border-b border-[var(--app-border-color)]"}
              headingText={"Source Code"}
              subText={"View Source Code"}
              onClick={() => {
                link("https://github.com/My-Ummah-Apps/My-Salah-App");
              }}
            />
            <SettingIndividual
              id="open-about-us-sheet"
              headingText={"About"}
              subText={"About Us"}
            />
            <BottomSheetAboutUs triggerId="open-about-us-sheet" />
          </div>
        </motion.section>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
