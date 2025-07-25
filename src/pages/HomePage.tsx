import MissedSalahsListBottomSheet from "../components/BottomSheets/BottomSheetMissedSalahsList";
import { AnimatePresence, motion } from "framer-motion";
import SalahTable from "../components/SalahTable/SalahTable";
import MissedSalahCounter from "../components/Stats/MissedSalahCounter";
import wreathLeft from "../assets/images/wreath-left.png";
import wreathRight from "../assets/images/wreath-right.png";
import { Dialog } from "@capacitor/dialog";

import {
  SalahRecordsArrayType,
  DBConnectionStateType,
  userPreferencesType,
  SalahByDateObjType,
  PreferenceType,
} from "../types/types";
import { useEffect, useRef, useState } from "react";
import {
  getMissedSalahCount,
  // pageTransitionStyles
} from "../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface HomePageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  checkAndOpenOrCloseDBConnection: (
    action: DBConnectionStateType
  ) => Promise<void>;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
  showJoyRideEditIcon: boolean;
  setFetchedSalahData: React.Dispatch<
    React.SetStateAction<SalahRecordsArrayType>
  >;
  fetchedSalahData: SalahRecordsArrayType;
  userPreferences: userPreferencesType;
  setShowMissedSalahsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showMissedSalahsSheet: boolean;
  setMissedSalahList: React.Dispatch<React.SetStateAction<SalahByDateObjType>>;
  missedSalahList: SalahByDateObjType;
  setIsMultiEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMultiEditMode: boolean;
  activeStreakCount: number;
  generateStreaks: (fetchedSalahData: SalahRecordsArrayType) => void;
}

const HomePage = ({
  dbConnection,
  checkAndOpenOrCloseDBConnection,
  modifyDataInUserPreferencesTable,
  setShowJoyRideEditIcon,
  showJoyRideEditIcon,
  setFetchedSalahData,
  fetchedSalahData,
  userPreferences,
  setShowMissedSalahsSheet,
  showMissedSalahsSheet,
  missedSalahList,
  setIsMultiEditMode,
  isMultiEditMode,
  activeStreakCount,
  generateStreaks,
}: HomePageProps) => {
  const [selectedSalahAndDate, setSelectedSalahAndDate] =
    useState<SalahByDateObjType>({});
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [animateStreakCounter, setAnimateStreakCounter] =
    useState<boolean>(false);
  const prevActiveStreakCount = useRef<number>(0);

  // const page = useRef(null);

  // const [presentingElement, setPresentingElement] =
  //   useState<HTMLElement | null>(null);

  // useEffect(() => {
  //   setPresentingElement(page.current);
  // }, []);

  const showStreakInfoHomePage = async () => {
    await Dialog.alert({
      title: "Streaks Explained",
      message: `Your current streak shows how many consecutive days you've completed all your Salah, starting from the first day where all Salah have been prayed. ${
        userPreferences.userGender === "male"
          ? "If you miss a Salah or are late, the streak will reset."
          : "If you're late, the streak will reset, selecting 'Excused' will pause the streak, but won't break it."
      }`,
    });
  };

  useEffect(() => {
    if (activeStreakCount > prevActiveStreakCount.current) {
      setAnimateStreakCounter(true);
    }
    prevActiveStreakCount.current = activeStreakCount;
  }, [activeStreakCount]);

  return (
    <IonPage
    // ref={page}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Home</IonTitle>
          <IonButtons slot="secondary">
            <IonButton
              style={{
                "--padding-end": "12px",
                "--ripple-color": "transparent",
              }}
            >
              {" "}
              {getMissedSalahCount(missedSalahList) > 0 &&
              userPreferences.showMissedSalahCount === "1" ? (
                <MissedSalahCounter
                  setShowMissedSalahsSheet={setShowMissedSalahsSheet}
                  isMultiEditMode={isMultiEditMode}
                  missedSalahList={missedSalahList}
                  modifyDataInUserPreferencesTable={
                    modifyDataInUserPreferencesTable
                  }
                  userPreferences={userPreferences}
                />
              ) : null}
            </IonButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton
              style={{
                "--ripple-color": "transparent",
              }}
            >
              {" "}
              <div className="w-[50px]" onClick={showStreakInfoHomePage}>
                <div className="relative flex items-center justify-center w-full">
                  <img
                    style={{
                      width: "40px",
                      height: "35px",
                      marginRight: "-2rem",
                    }}
                    src={wreathLeft}
                    alt=""
                    srcSet=""
                  />
                  <div className="absolute -translate-x-1/2 -translate-y-[50%] top-[58%] left-1/2">
                    <AnimatePresence mode="wait">
                      <motion.p
                        className="text-xs text-white"
                        key={activeStreakCount}
                        {...(animateStreakCounter
                          ? {
                              initial: { opacity: 0, y: -10 },
                              animate: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 5,
                                  // delay: 0.2,
                                },
                              },
                              exit: { opacity: 0, y: 10 },
                            }
                          : {})}
                      >
                        {activeStreakCount}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <img
                    style={{
                      width: "40px",
                      height: "35px",
                      marginLeft: "2rem",
                    }}
                    src={wreathRight}
                    alt=""
                    srcSet=""
                  />
                </div>
              </div>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <motion.section
          // {...pageTransitionStyles}
          className={`home-page-wrap`}
        >
          <section className="home-page-components-wrap">
            <SalahTable
              dbConnection={dbConnection}
              checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
              modifyDataInUserPreferencesTable={
                modifyDataInUserPreferencesTable
              }
              setShowJoyRideEditIcon={setShowJoyRideEditIcon}
              showJoyRideEditIcon={showJoyRideEditIcon}
              userPreferences={userPreferences}
              setFetchedSalahData={setFetchedSalahData}
              fetchedSalahData={fetchedSalahData}
              setSelectedSalahAndDate={setSelectedSalahAndDate}
              selectedSalahAndDate={selectedSalahAndDate}
              setIsMultiEditMode={setIsMultiEditMode}
              isMultiEditMode={isMultiEditMode}
              setShowUpdateStatusModal={setShowUpdateStatusModal}
              showUpdateStatusModal={showUpdateStatusModal}
              generateStreaks={generateStreaks}
            />
            <MissedSalahsListBottomSheet
              dbConnection={dbConnection}
              checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
              setFetchedSalahData={setFetchedSalahData}
              // presentingElement={presentingElement}
              setShowMissedSalahsSheet={setShowMissedSalahsSheet}
              showMissedSalahsSheet={showMissedSalahsSheet}
              missedSalahList={missedSalahList}
            />
          </section>
        </motion.section>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
