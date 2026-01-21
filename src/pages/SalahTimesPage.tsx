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
  nextSalahTimeType,
  SalahNamesTypeAdhanLibrary,
  salahTimesObjType,
  userPreferencesType,
} from "../types/types";
import BottomSheetSalahTimesSettings from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahTimesSettings";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  chevronBackOutline,
  chevronForwardOutline,
  listOutline,
  megaphone,
  navigate,
  notifications,
  notificationsOff,
  settingsOutline,
} from "ionicons/icons";

import { useState } from "react";
import Toast from "../components/Toast";
import {
  checkNotificationPermissions,
  getSalahTimes,
  prayerCalculationMethodLabels,
  promptToOpenDeviceSettings,
  upperCaseFirstLetter,
} from "../utils/constants";
import BottomSheetLocationsList from "../components/BottomSheets/SalahTimesSheets/BottomSheetLocationsList";
import BottomSheetAddLocation from "../components/BottomSheets/SalahTimesSheets/BottomSheetAddLocation";
import BottomSheetSalahNotifications from "../components/BottomSheets/SalahTimesSheets/BottomSheetSalahNotifications";
import { AndroidSettings } from "capacitor-native-settings";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, isSameDay } from "date-fns";

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
  nextSalahNameAndTime: nextSalahTimeType;
  setShowSalahTimesSettingsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showSalahTimesSettingsSheet: boolean;
}

const SalahTimesPage = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setUserLocations,
  userLocations,
  setSalahtimes,
  salahTimes,
  nextSalahNameAndTime,
  setShowSalahTimesSettingsSheet,
  showSalahTimesSettingsSheet,
}: SalahTimesPageProps) => {
  const [showAddLocationSheet, setShowAddLocationSheet] = useState(false);
  const [showLocationsListSheet, setShowLocationsListSheet] = useState(false);
  const [showLocationFailureToast, setShowLocationFailureToast] =
    useState<boolean>(false);
  const [showLocationAddedToast, setShowLocationAddedToast] =
    useState<boolean>(false);

  const [selectedSalah, setSelectedSalah] =
    useState<SalahNamesTypeAdhanLibrary>("fajr");
  const [showSalahNotificationsSheet, setShowSalahNotificationsSheet] =
    useState(false);
  const [dateToShow, setDateToShow] = useState(new Date());

  useIonViewWillLeave(() => {
    setDateToShow(new Date());
  });

  const handleNotificationPermissions = async () => {
    const userNotificationPermission = await checkNotificationPermissions();

    if (userNotificationPermission === "denied") {
      await promptToOpenDeviceSettings(
        `Notifications are turned off`,
        `You currently have notifications turned off for this application, you can open Settings to re-enable them`,
        AndroidSettings.AppNotification,
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

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="header-toolbar">
          <IonTitle>Salah Times</IonTitle>
          {/* <IonButtons slot="primary">
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
          </IonButtons> */}
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
          {userLocations?.map((location) => (
            <section className="" key={location.id}>
              {location.isSelected === 1 ? (
                <div
                  key={location.id}
                  className="flex items-center justify-center mb-1 text-lg font-light"
                >
                  <IonIcon
                    className="text-[var(--ion-text-color)] mr-1"
                    icon={navigate}
                  />
                  <p>{location.locationName}</p>
                </div>
              ) : (
                ""
              )}
            </section>
          ))}{" "}
          {userPreferences.prayerCalculationMethod !== "" &&
            userLocations?.length !== 0 && (
              <section className="p-4 rounded-lg bg-[var(--card-bg-color)] ">
                {nextSalahNameAndTime.currentSalah !== "sunrise" &&
                  nextSalahNameAndTime.currentSalah !== "none" && (
                    <>
                      <p className="mb-1 text-lg text-center font-extralight ">
                        Current Salah
                      </p>
                      <p className="text-6xl font-bold text-center">
                        {upperCaseFirstLetter(
                          nextSalahNameAndTime.currentSalah,
                        )}
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
                <p className="mt-2 mb-2 text-2xl font-light text-center">
                  {upperCaseFirstLetter(nextSalahNameAndTime.nextSalah)}
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
                  {userPreferences.prayerCalculationMethod === ""
                    ? "Set Up Salah Times"
                    : "Add Location"}
                </IonButton>
                <BottomSheetAddLocation
                  setShowAddLocationSheet={setShowAddLocationSheet}
                  showAddLocationSheet={showAddLocationSheet}
                  // setShowSalahTimesSettingsSheet={
                  //   setShowSalahTimesSettingsSheet
                  // }
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
          <section
            className={` ${
              userLocations?.length === 0 ||
              userPreferences.prayerCalculationMethod === ""
                ? "opacity-50"
                : "opacity-100"
            } flex items-center justify-between w-5/6 mx-auto mt-5`}
          >
            {" "}
            <IonButton
              fill="clear"
              onClick={async () => {
                if (!userLocations || userLocations.length === 0) {
                  return;
                }

                const nextDate = addDays(dateToShow, -1);
                setDateToShow(nextDate);

                console.log("nextDate: ", nextDate);

                await getSalahTimes(
                  userLocations,
                  nextDate,
                  userPreferences,
                  setSalahtimes,
                );
              }}
            >
              <IonIcon
                className="text-[var(--ion-text-color)]"
                icon={chevronBackOutline}
              />
            </IonButton>
            <p>
              {isSameDay(dateToShow, new Date())
                ? "Today"
                : isSameDay(addDays(new Date(), -1), dateToShow)
                  ? "Yesterday"
                  : isSameDay(addDays(new Date(), 1), dateToShow)
                    ? "Tomorrow"
                    : dateToShow.toLocaleDateString()}
            </p>
            <IonButton
              fill="clear"
              onClick={async () => {
                if (!userLocations || userLocations.length === 0) {
                  return;
                }

                const nextDate = addDays(dateToShow, 1);
                setDateToShow(nextDate);

                console.log("nextDate: ", nextDate);

                await getSalahTimes(
                  userLocations,
                  nextDate,
                  userPreferences,
                  setSalahtimes,
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
                    ? "my-2 rounded-lg shadow-md scale-102 border-[var(--ion-text-color)] border-2 font-bold"
                    : "opacity-80"
                }`}
                key={name + time}
              >
                <p className="ml-2">{upperCaseFirstLetter(name)}</p>
                <div className="flex items-center">
                  <p>
                    {time === "Invalid Date" || userLocations?.length === 0
                      ? "--:--"
                      : time}
                  </p>
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
              <p className="mx-10 my-5 text-xs text-center opacity-50">
                {`Note: These times have been calculated using the
            ${
              prayerCalculationMethodLabels[
                userPreferences.prayerCalculationMethod
              ]
            } method with Fajr Angle ${
              userPreferences.fajrAngle
            }° and Isha Angle ${
              userPreferences.ishaAngle
            }°, your local mosque (beginning) times may differ.`}
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

      <BottomSheetSalahNotifications
        setShowSalahNotificationsSheet={setShowSalahNotificationsSheet}
        showSalahNotificationsSheet={showSalahNotificationsSheet}
        dbConnection={dbConnection}
        selectedSalah={selectedSalah}
        setUserPreferences={setUserPreferences}
        userPreferences={userPreferences}
        userLocations={userLocations}
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
