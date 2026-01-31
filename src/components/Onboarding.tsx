import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { LocationsDataObjTypeArr, userPreferencesType } from "../types/types";
import {
  updateUserPrefs,
  scheduleDailyNotification,
  handleNotificationPermissions,
  scheduleSalahTimesNotifications,
  isBatteryOptimizationEnabled,
  requestIgnoreBatteryOptimization,
} from "../utils/helpers";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import appLogo from "/src/assets/images/icon-512.png";
import { IonButton, IonIcon } from "@ionic/react";
import { arrowForwardOutline, chevronBackOutline } from "ionicons/icons";
import CalculationMethodOptions from "./CalculationMethodOptions";
import AddLocationOptions from "./AddLocationOptions";
import { Capacitor } from "@capacitor/core";

interface OnboardingProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  showOnboarding: boolean;
  showSalahTimesOnboarding: boolean;
  // startingSlide?: number;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr>
  >;
  userLocations: LocationsDataObjTypeArr;
  setShowLocationFailureToast: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLocationAddedToast: React.Dispatch<React.SetStateAction<boolean>>;
}

const Onboarding = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setShowOnboarding,
  showOnboarding,
  showSalahTimesOnboarding,
  // startingSlide,
  setShowJoyRideEditIcon,
  setUserLocations,
  userLocations,
  setShowLocationFailureToast,
  setShowLocationAddedToast,
}: OnboardingProps) => {
  const swiperRef = useRef<SwiperInstance | null>(null);

  const switchToNextPage = () => {
    swiperRef.current?.slideNext();
  };
  const switchToPreviousPage = () => {
    const activeIndex = swiperRef.current?.activeIndex;
    console.log("activeIndex: ", activeIndex);

    if (activeIndex === 7) {
      swiperRef.current?.slideTo(3, 0);
    }

    swiperRef.current?.slidePrev();
  };

  const [segmentOption, setSegmentOption] = useState<"manual" | "country">(
    "country",
  );

  // const [isSalahTimesOnboarding, setIsSalahTimesOnboarding] = useState(false);

  const [isBatteryOptEnabled, setIsBatteryOptEnabled] = useState<
    boolean | null
  >(null);

  // <IonButton
  //         style={{
  //           "--padding-start": "0",
  //           "--padding-end": "0",
  //         }}
  //         fill="clear"
  //         color="light"
  //         size="small"
  //         className="absolute top-[-10px] left-0 z-10 text-lg"
  //         onClick={switchToPreviousPage}
  //       >
  //         <IonIcon icon={chevronBackOutline} />
  //       </IonButton>

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android" || !Capacitor.isNativePlatform())
      return;

    const getBatteryOptimizationStatus = async () => {
      const res = await isBatteryOptimizationEnabled();
      setIsBatteryOptEnabled(res);
    };

    getBatteryOptimizationStatus();
  }, []);

  // console.log("startingSlide: ", startingSlide);

  return (
    <section
      style={{
        display: "flex",
        // alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgb(27, 27, 28)",
        color: "#fff",
        zIndex: 9999,
        // padding: 20,
        overflowY: "auto",
        paddingTop: "calc(env(safe-area-inset-top) + 20px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)",
        paddingLeft: "calc(env(safe-area-inset-left) + 20px)",
        paddingRight: "calc(env(safe-area-inset-right) + 20px)",
      }}
    >
      <IonButton
        fill="clear"
        color="light"
        size="small"
        className="absolute text-lg z-10 left-[-5px] top-2"
        onClick={switchToPreviousPage}
      >
        <IonIcon icon={chevronBackOutline} />
      </IonButton>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        style={{ margin: 0 }}
        className="swiper"
        spaceBetween={50}
        slidesPerView={1}
        allowTouchMove={false}
        // initialSlide={startingSlide ? startingSlide : 0}
        initialSlide={showSalahTimesOnboarding ? 3 : 0}
        pagination
        navigation
        // navigation={{
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev",
        // }}
        modules={[Pagination, Navigation]}
        // pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <h1 className="text-2xl text-center">Welcome to My Salah App</h1>
            <div className="text-center">
              <img
                className="block mx-auto mb-2"
                src={appLogo}
                height="70"
                width="60%"
                alt=""
              />
              <p className="p-4 text-sm leading-5">
                Open-source, ad-free, privacy friendly. This app collects zero
                data from you and everything works completely offline.
              </p>
            </div>
            <IonButton
              className="absolute bottom-0 w-full"
              onClick={() => {
                switchToNextPage();
                // setIsOnboarding(true);
              }}
            >
              <IonIcon slot="end" icon={arrowForwardOutline} />
              Bismillah, Lets Go!
            </IonButton>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <h1 className="text-3xl">I am a...</h1>
            <section>
              <IonButton
                expand="block"
                onClick={async () => {
                  switchToNextPage();
                  await updateUserPrefs(
                    dbConnection,
                    "userGender",
                    "male",
                    setUserPreferences,
                  );
                }}
              >
                <div>
                  <p>Brother</p>
                </div>
              </IonButton>

              <IonButton
                color="tertiary"
                className="mt-5"
                expand="block"
                onClick={async () => {
                  switchToNextPage();
                  await updateUserPrefs(
                    dbConnection,
                    "userGender",
                    "female",
                    setUserPreferences,
                  );
                }}
              >
                <div>
                  <p>Sister</p>
                </div>
              </IonButton>
            </section>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <section className="m-4 text-center">
              <h1 className="mb-2 text-2xl font-bold">
                Do you want to turn on prayer times?
              </h1>
              <p>Turn on prayer times</p>
            </section>
            <section className="flex flex-col ">
              <IonButton
                onClick={async () => {
                  switchToNextPage();
                  // setIsSalahTimesOnboarding(true);
                }}
                className="mb-4"
              >
                Yes
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => {
                  swiperRef.current?.slideTo(8, 0);
                  // setIsSalahTimesOnboarding(false);
                }}
                className="text-white mb-2text-center rounded-2xl"
              >
                No
              </IonButton>
            </section>
          </section>
        </SwiperSlide>

        {/* {showPrayerTimesOnboarding && ( */}
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <section className="m-4 text-center">
              <h1 className="mb-2 text-2xl font-bold">Location</h1>
              <p>Select your Location</p>
            </section>
            <AddLocationOptions
              dbConnection={dbConnection}
              setUserLocations={setUserLocations}
              userLocations={userLocations}
              setShowLocationFailureToast={setShowLocationFailureToast}
              setShowLocationAddedToast={setShowLocationAddedToast}
              showOnboarding={showOnboarding}
              switchToNextPage={switchToNextPage}
            />
            {/* <section className="flex flex-col"></section> */}
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <section className="m-4 text-center">
              <h1 className="mb-2 text-2xl font-bold">Calculation Method</h1>
              <p>Select your calculation method</p>
            </section>
            <CalculationMethodOptions
              dbConnection={dbConnection}
              setSegmentOption={setSegmentOption}
              segmentOption={segmentOption}
              userLocations={userLocations}
              userPreferences={userPreferences}
              setUserPreferences={setUserPreferences}
            />
            <section className="">
              <IonButton
                disabled={
                  userPreferences.prayerCalculationMethod === "" ? true : false
                }
                onClick={async () => {
                  switchToNextPage();
                }}
                className={`absolute bottom-0 w-full ${userPreferences.prayerCalculationMethod === "" ? "hidden" : "visible"}`}
              >
                Next
              </IonButton>
            </section>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <section className="m-4 text-center">
              <h1 className="mb-2 text-2xl font-bold">Madhab</h1>
              <p>Select Madhab</p>
            </section>
            <section className="mx-4">
              <IonButton
                expand="block"
                onClick={async () => {
                  if (switchToNextPage && showOnboarding) switchToNextPage();
                  await updateUserPrefs(
                    dbConnection,
                    "madhab",
                    "shafi",
                    setUserPreferences,
                  );
                }}
              >
                <div>
                  <p className="mt-0">Shafi'i, Maliki & Hanbali</p>
                  <p className="mt-2 text-xs">Earlier Asr time</p>
                </div>
              </IonButton>
              <IonButton
                color="secondary"
                className="mt-5"
                expand="block"
                onClick={async () => {
                  if (switchToNextPage && showOnboarding) switchToNextPage();
                  await updateUserPrefs(
                    dbConnection,
                    "madhab",
                    "hanafi",
                    setUserPreferences,
                  );
                }}
              >
                <div>
                  <p className="mt-0">Hanafi</p>
                  <p className="mt-2 text-xs">Later Asr time</p>
                </div>
              </IonButton>
            </section>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <section className="m-4 text-center">
              <h1 className="mb-2 text-2xl font-bold">Enable Notifications</h1>
              <p>
                We’ll notify you at each prayer time and once daily to log your
                prayers. You can change sounds and customise individual
                reminders anytime in settings.
              </p>
            </section>
            <section className="flex flex-col ">
              <IonButton
                onClick={async () => {
                  const res = await handleNotificationPermissions();
                  if (res === "granted") {
                    const notifications = [
                      "fajrNotification",
                      "dhuhrNotification",
                      "asrNotification",
                      "maghribNotification",
                      "ishaNotification",
                    ] as const;

                    for (const notification of notifications) {
                      await updateUserPrefs(
                        dbConnection,
                        notification,
                        "on",
                        setUserPreferences,
                      );
                    }

                    const salahs = [
                      "fajr",
                      "dhuhr",
                      "asr",
                      "maghrib",
                      "isha",
                    ] as const;

                    for (const salah of salahs) {
                      await scheduleSalahTimesNotifications(
                        userLocations,
                        salah,
                        userPreferences,
                        "on",
                      );
                    }
                  }
                  // switchToNextPage();
                  setShowOnboarding(false);
                  setShowJoyRideEditIcon(true);
                }}
                className="mb-4"
              >
                Allow notifications
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => {
                  // switchToNextPage();
                  setShowOnboarding(false);
                  setShowJoyRideEditIcon(true);
                }}
                className="text-white mb-2text-center rounded-2xl"
              >
                Skip for now
              </IonButton>
            </section>
          </section>
        </SwiperSlide>

        {Capacitor.getPlatform() === "android" &&
          isBatteryOptEnabled === false && (
            <SwiperSlide>
              <section className="flex flex-col justify-center h-full">
                <section className="m-4 text-center">
                  <h1 className="mb-2 text-2xl font-bold">
                    Make sure reminders arrive on time
                  </h1>
                  <p>
                    Some phones delay notifications to save battery. Turning off
                    battery optimisation helps ensure Salah reminders are
                    delivered on time.
                  </p>
                </section>
                <section className="flex flex-col">
                  <IonButton
                    onClick={async () => {
                      await requestIgnoreBatteryOptimization();
                      switchToNextPage();
                    }}
                    className="mb-4"
                  >
                    Improve notification reliability
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      switchToNextPage();
                    }}
                    className="text-white mb-2text-center rounded-2xl"
                  >
                    Skip for now
                  </IonButton>
                </section>
              </section>
            </SwiperSlide>
          )}
        {/* )} */}
        <SwiperSlide>
          <section className="flex flex-col justify-center h-full">
            <section className="m-4 text-center">
              <h1 className="mb-2 text-2xl font-bold">
                Stay Consistent with Your Salah
              </h1>
              <p>
                We’ll send you a gentle reminder each day to log which prayers
                you prayed or missed. You can adjust the time or turn this off
                anytime in settings.
              </p>
            </section>
            <section className="flex flex-col ">
              <IonButton
                onClick={async () => {
                  const permission =
                    await LocalNotifications.requestPermissions();
                  if (permission.display === "granted") {
                    setShowOnboarding(false);
                    setShowJoyRideEditIcon(true);
                    scheduleDailyNotification(21, 0);
                    await updateUserPrefs(
                      dbConnection,
                      "dailyNotification",
                      "1",
                      setUserPreferences,
                    );
                    await updateUserPrefs(
                      dbConnection,
                      "dailyNotificationTime",
                      "21:00",
                      setUserPreferences,
                    );
                  } else {
                    setShowOnboarding(false);
                    setShowJoyRideEditIcon(true);
                  }

                  // setIsOnboarding(false);
                }}
                className="mb-4"
              >
                Remind me each day
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => {
                  // setIsOnboarding(false);
                  setShowOnboarding(false);
                  setShowJoyRideEditIcon(true);
                }}
                className="text-white mb-2text-center rounded-2xl"
              >
                Skip for now
              </IonButton>
            </section>
          </section>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Onboarding;
