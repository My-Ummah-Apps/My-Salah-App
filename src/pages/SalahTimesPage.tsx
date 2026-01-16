import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillLeave,
} from "@ionic/react";
import {
  LocationsDataObjTypeArr,
  SalahNamesTypeAdhanLibrary,
  salahTimesObjType,
  userPreferencesType,
} from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  chevronBackOutline,
  chevronDownOutline,
  chevronForwardOutline,
  listOutline,
  megaphone,
  notifications,
  notificationsOff,
  settingsOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import {
  checkNotificationPermissions,
  getNextSalah,
  getSalahTimes,
  prayerCalculationMethodLabels,
  promptToOpenDeviceSettings,
} from "../utils/constants";
import BottomSheetLocationsList from "../components/BottomSheets/SalahTimesSheets/BottomSheetLocationsList";
import BottomSheetAddLocation from "../components/BottomSheets/SalahTimesSheets/BottomSheetAddLocation";
import BottomSheetSalahNotifications from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahNotifications";
import { AndroidSettings } from "capacitor-native-settings";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, format, subDays } from "date-fns";

interface SalahTimesPageProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr>
  >;
  userLocations: LocationsDataObjTypeArr | undefined;
  setSalahtimes: React.Dispatch<React.SetStateAction<salahTimesObjType>>;
  salahTimes: salahTimesObjType;
}

const SalahTimesPage = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
  setSalahtimes,
  salahTimes,
}: SalahTimesPageProps) => {
  const [showAddLocationSheet, setShowAddLocationSheet] = useState(false);
  const [showSalahTimesSettingsSheet, setShowSalahTimesSettingsSheet] =
    useState(false);
  const [showLocationsListSheet, setShowLocationsListSheet] = useState(false);
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState<boolean>(false);
  const [showLocationAddedToast, setShowLocationAddedToast] =
    useState<boolean>(false);

  const [nextSalahNameAndTime, setNextSalahNameAndTime] = useState({
    currentSalah: "",
    nextSalah: "",
    nextSalahTime: null as Date | null,
    hoursRemaining: 0,
    minsRemaining: 0,
  });

  const [selectedSalah, setSelectedSalah] =
    useState<SalahNamesTypeAdhanLibrary>("fajr");
  const [showSalahNotificationsSheet, setShowSalahNotificationsSheet] =
    useState(false);
  const [dateIncrement, setDateIncrement] = useState(0);

  useIonViewWillLeave(() => {
    setDateIncrement(0);
  });

  useEffect(() => {
    const getNextSalahDetails = async () => {
      // const { currentSalah, nextSalah, hoursRemaining, minsRemaining } =
      //   await calculateActiveLocationSalahTimes();
      const result = await getNextSalah(dbConnection, userPreferences);
      if (!result) return;
      const {
        currentSalah,
        nextSalah,
        nextSalahTime,
        hoursRemaining,
        minsRemaining,
      } = result;
      setNextSalahNameAndTime({
        currentSalah: currentSalah,
        nextSalah: nextSalah,
        nextSalahTime: nextSalahTime,
        hoursRemaining: hoursRemaining,
        minsRemaining: minsRemaining,
      });
    };

    getNextSalahDetails();

    const interval = setInterval(() => {
      getNextSalahDetails();
    }, 60000);

    return () => clearInterval(interval);
  }, [userLocations]);

  const handleNotificationPermissions = async () => {
    const userNotificationPermission = await checkNotificationPermissions();

    if (userNotificationPermission === "denied") {
      await promptToOpenDeviceSettings(
        `Notifications are turned off`,
        `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
        AndroidSettings.AppNotification
      );
      return "denied";
    } else if (userNotificationPermission === "granted") {
      return "granted";
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      const requestPermission = await LocalNotifications.requestPermissions();

      if (requestPermission.display === "granted") {
        return "granted";
      } else if (requestPermission.display === "denied") {
        return "denied";
      }
    }
  };

  useEffect(() => {
    console.log("dateIncrement: ", dateIncrement);
  }, [dateIncrement]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => setShowSalahTimesSettingsSheet(true)}
              style={{
                "--padding-end": "12px",
                "--ripple-color": "transparent",
              }}
            >
              <IonIcon
                className="text-[var(--ion-text-color)] text-lg"
                icon={settingsOutline}
              />
            </IonButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => setShowLocationsListSheet(true)}
              style={{
                "--padding-end": "12px",
                "--ripple-color": "transparent",
              }}
            >
              <IonIcon
                className="text-[var(--ion-text-color)] text-lg"
                icon={listOutline}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* bg-[var(--card-bg-color)]  */}

        <section className="salah-times-page-components-wrap">
          <section className="flex items-center justify-center mb-1">
            {userLocations?.map((location) => (
              <section key={location.id}>
                <p>{location.isSelected === 1 ? location.locationName : ""}</p>
              </section>
            ))}{" "}
          </section>
          {userPreferences.prayerCalculationMethod !== "" &&
            userLocations?.length !== 0 && (
              <section className="p-4 mb-5 rounded-lg bg-[var(--card-bg-color)] ">
                {nextSalahNameAndTime.currentSalah !== "sunrise" &&
                  nextSalahNameAndTime.currentSalah !== "none" && (
                    <>
                      <p className="mb-1 text-lg text-center font-extralight">
                        Current Salah
                      </p>
                      <p className="mb-5 text-6xl font-bold text-center">
                        {nextSalahNameAndTime.currentSalah
                          .charAt(0)
                          .toUpperCase() +
                          nextSalahNameAndTime.currentSalah.slice(1)}
                      </p>
                    </>
                  )}
                <p className="text-4xl text-center">
                  {/* {format(nextSalahNameAndTime.nextSalahTime, "HH:mm")} */}
                </p>
                {nextSalahNameAndTime.hoursRemaining > 0 && (
                  <p className="mt-2 font-light text-center">
                    {nextSalahNameAndTime.hoursRemaining} hours and{" "}
                  </p>
                )}
                <p className="text-center font-extralight">
                  {nextSalahNameAndTime.minsRemaining} minutes to go until
                </p>
                <p className="mt-2 mb-5 text-2xl text-center">
                  {nextSalahNameAndTime.nextSalah.charAt(0).toUpperCase() +
                    nextSalahNameAndTime.nextSalah.slice(1)}
                </p>
              </section>
            )}
          {/* {userLocations?.length === 0 ? ( */}
          {userLocations?.length === 0 && (
            <>
              <section
                className="text-center"
                // className="flex flex-col items-center justify-center h-full text-center"
              >
                <h4>Salah Times Not Set</h4>
                <IonButton
                  onClick={() => {
                    setShowAddLocationSheet(true);
                  }}
                  className="w-1/2"
                >
                  Set Up Salah Times
                </IonButton>
                <BottomSheetAddLocation
                  setShowAddLocationSheet={setShowAddLocationSheet}
                  showAddLocationSheet={showAddLocationSheet}
                  setShowSalahTimesSettingsSheet={
                    setShowSalahTimesSettingsSheet
                  }
                  dbConnection={dbConnection}
                  setUserLocations={setUserLocations}
                  userLocations={userLocations}
                  setShowLocationFailureToast={setShowLocationFailureToast}
                  setShowLocationAddedToast={setShowLocationAddedToast}
                  // setUserPreferences={setUserPreferences}
                />
              </section>
            </>
          )}

          <section className="flex items-center justify-between w-5/6 mx-auto">
            {" "}
            <IonButton
              fill="clear"
              onClick={async () => {
                const todaysDate = new Date();
                setDateIncrement((prev) => prev - 1);
                const dateToShow = addDays(todaysDate, dateIncrement);

                console.log("dateToShow: ", dateToShow);

                await getSalahTimes(
                  dbConnection,
                  dateToShow,
                  userPreferences,
                  setSalahtimes
                );
              }}
            >
              <IonIcon
                className="text-[var(--ion-text-color)]"
                icon={chevronBackOutline}
              />
            </IonButton>
            <p>
              {dateIncrement === 0
                ? "Today"
                : dateIncrement === -1
                ? "Yesterday"
                : dateIncrement === 1
                ? "Tomorrow"
                : dateIncrement > 0
                ? format(addDays(new Date(), dateIncrement), "PP")
                : dateIncrement < 0
                ? format(addDays(new Date(), dateIncrement), "PP")
                : ""}
            </p>
            <IonButton
              fill="clear"
              onClick={async () => {
                const todaysDate = new Date();
                setDateIncrement((prev) => prev + 1);
                const dateToShow = addDays(todaysDate, dateIncrement);

                console.log("dateToShow: ", dateToShow);

                await getSalahTimes(
                  dbConnection,
                  dateToShow,
                  userPreferences,
                  setSalahtimes
                );
              }}
            >
              <IonIcon
                className="text-[var(--ion-text-color)]"
                icon={chevronForwardOutline}
              />
            </IonButton>
          </section>
          <section
            className={` rounded-lg   ${
              userLocations?.length === 0 ||
              userPreferences.prayerCalculationMethod === ""
                ? "opacity-50"
                : "opacity-100"
            }`}
          >
            {(
              Object.entries(salahTimes) as [keyof typeof salahTimes, string][]
            ).map(([name, time]) => (
              <div
                // && name !== "sunrise"
                className={`bg-[var(--card-bg-color)] flex items-center justify-between py-1 text-sm rounded-lg ${
                  name === nextSalahNameAndTime.currentSalah &&
                  name !== "sunrise"
                    ? "my-2 rounded-lg shadow-md scale-102 border-[var(--app-border-color)] border-2 font-bold"
                    : ""
                }`}
                key={name + time}
              >
                <p className="ml-2">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </p>
                <div className="flex items-center">
                  <p>{time === "Invalid Date" ? "--:--" : time}</p>
                  <IonButton
                    className={name === "sunrise" ? "opacity-0" : "opacity-100"}
                    onClick={async () => {
                      if (
                        name === "sunrise" ||
                        userPreferences.prayerCalculationMethod === null ||
                        userPreferences.prayerCalculationMethod === "" ||
                        userLocations?.length === 0
                      ) {
                        return;
                      }

                      const notificationPermission =
                        await handleNotificationPermissions();

                      if (notificationPermission === "granted") {
                        setSelectedSalah(name);
                        setShowSalahNotificationsSheet(true);
                      }
                    }}
                    fill="clear"
                    size="small"
                  >
                    <IonIcon
                      className="text-[var(--ion-text-color)]"
                      icon={
                        userPreferences[
                          `${
                            name as Exclude<typeof name, "sunrise">
                          }Notification`
                        ] === "off"
                          ? notificationsOff
                          : userPreferences[
                              `${
                                name as Exclude<typeof name, "sunrise">
                              }Notification`
                            ] === "on"
                          ? notifications
                          : userPreferences[
                              `${
                                name as Exclude<typeof name, "sunrise">
                              }Notification`
                            ] === "adhan"
                          ? megaphone
                          : ""
                      }
                    />
                  </IonButton>
                </div>
              </div>
            ))}
            {/* </IonList> */}
          </section>
          {userPreferences.prayerCalculationMethod !== "" &&
            userLocations?.length !== 0 && (
              <p className="mx-10 my-5 text-xs text-center text-gray-400">
                {`Note: These times have been calculated using the
            ${
              prayerCalculationMethodLabels[
                userPreferences.prayerCalculationMethod
              ]
            } method with Fajr Angle ${
                  userPreferences.fajrAngle
                }° and Isha Angle ${
                  userPreferences.ishaAngle
                }°, your local mosque times may differ.`}
              </p>
            )}
        </section>
      </IonContent>
      <BottomSheetLocationsList
        setShowLocationsListSheet={setShowLocationsListSheet}
        showLocationsListSheet={showLocationsListSheet}
        dbConnection={dbConnection}
        setUserLocations={setUserLocations}
        userLocations={userLocations}
        setShowAddLocationSheet={setShowAddLocationSheet}
        showAddLocationSheet={showAddLocationSheet}
        setShowLocationFailureToast={setShowLocationFailureToast}
        setShowLocationAddedToast={setShowLocationAddedToast}
        setSalahtimes={setSalahtimes}
        userPreferences={userPreferences}
        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
      />
      <BottomSheetSalahTimesSettings
        setShowSalahTimesSettingsSheet={setShowSalahTimesSettingsSheet}
        showSalahTimesSettingsSheet={showSalahTimesSettingsSheet}
        dbConnection={dbConnection}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}

        // calculateActiveLocationSalahTimes={calculateActiveLocationSalahTimes}
      />
      <BottomSheetSalahNotifications
        setShowSalahNotificationsSheet={setShowSalahNotificationsSheet}
        showSalahNotificationsSheet={showSalahNotificationsSheet}
        dbConnection={dbConnection}
        selectedSalah={selectedSalah}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
      />
      <Toast
        isOpen={showLocationFailureToast}
        message="Unable to retrieve location, please try again"
        setShow={setShowLocationFailureToast}
        testId={"location-fail-toast"}
      />
      <Toast
        isOpen={showLocationAddedToast}
        message="Location added successfully"
        setShow={setShowLocationAddedToast}
        testId={"location-successfully-added-toast"}
      />
    </IonPage>
  );
};

export default SalahTimesPage;
