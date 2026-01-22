import { useRef, useState } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { LATEST_APP_VERSION } from "../utils/changelog";
import { LocationsDataObjTypeArr, userPreferencesType } from "../types/types";
import { updateUserPrefs, scheduleDailyNotification } from "../utils/helpers";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import appLogo from "/src/assets/images/icon-512.png";
import { IonButton, IonIcon } from "@ionic/react";
import { arrowForwardOutline, chevronBackOutline } from "ionicons/icons";
import MadhabOptions from "./MadhabOptions";
import CalculationMethodOptions from "./CalculationMethodOptions";

interface OnboardingProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
  userLocations: LocationsDataObjTypeArr | undefined;
}

const Onboarding = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  setShowOnboarding,
  setShowJoyRideEditIcon,
  userLocations,
}: OnboardingProps) => {
  const swiperRef = useRef<SwiperInstance | null>(null);

  const switchToNextPage = () => {
    swiperRef.current?.slideNext();
  };
  const switchToPreviousPage = () => {
    swiperRef.current?.slidePrev();
  };

  const [segmentOption, setSegmentOption] = useState<"manual" | "country">(
    "country",
  );

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
        padding: 20,
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
        className="absolute text-lg z-10 left-[-5px] top-0"
        onClick={switchToPreviousPage}
      >
        <IonIcon icon={chevronBackOutline} />
      </IonButton>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        style={{ margin: 0 }}
        spaceBetween={50}
        slidesPerView={1}
        allowTouchMove={false}
        // navigation={{
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev",
        // }}
        modules={[Pagination, Navigation]}
        // pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <section className="">
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
            <IonButton className="w-full" onClick={switchToNextPage}>
              <IonIcon slot="end" icon={arrowForwardOutline} />
              Bismillah, Lets Go!
            </IonButton>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="">
            <h1 className="text-4xl">I am a...</h1>
            <IonButton
              className="block my-4"
              onClick={async () => {
                switchToNextPage();
                await updateUserPrefs(
                  dbConnection,
                  "userGender",
                  "male",
                  setUserPreferences,
                );

                localStorage.setItem("appVersion", LATEST_APP_VERSION);
              }}
            >
              Brother
            </IonButton>
            <IonButton
              className="block"
              color="tertiary"
              onClick={async () => {
                switchToNextPage();
                await updateUserPrefs(
                  dbConnection,
                  "userGender",
                  "female",
                  setUserPreferences,
                );

                localStorage.setItem("appVersion", LATEST_APP_VERSION);
              }}
            >
              Sister
            </IonButton>
          </section>
        </SwiperSlide>
        <SwiperSlide>
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
              }}
              className="mb-4"
            >
              Yes
            </IonButton>
            <IonButton
              fill="clear"
              onClick={() => {
                swiperRef.current?.slideTo(6, 0);
              }}
              className="text-white mb-2text-center rounded-2xl"
            >
              No
            </IonButton>
          </section>
        </SwiperSlide>
        {/* {showPrayerTimesOnboarding && ( */}
        <SwiperSlide>
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
          <section className="flex flex-col ">
            <IonButton
              onClick={async () => {
                switchToNextPage();
              }}
              className="mb-4"
            >
              Next
            </IonButton>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="m-4 text-center">
            <h1 className="mb-2 text-2xl font-bold">Madhab</h1>
            <p>Select Madhab</p>
          </section>
          <section className="flex flex-col">
            <MadhabOptions
              dbConnection={dbConnection}
              setUserPreferences={setUserPreferences}
              userPreferences={userPreferences}
            />
            <IonButton
              onClick={async () => {
                switchToNextPage();
              }}
              className="mb-4"
            >
              Next
            </IonButton>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className="m-4 text-center">
            <h1 className="mb-2 text-2xl font-bold">Notifications</h1>
            <p>Per Salah Notifications</p>
          </section>
          <section className="flex flex-col ">
            <IonButton
              onClick={async () => {
                switchToNextPage();
              }}
              className="mb-4"
            >
              Yes
            </IonButton>
            <IonButton
              fill="clear"
              onClick={() => {
                switchToNextPage();
              }}
              className="text-white mb-2text-center rounded-2xl"
            >
              No
            </IonButton>
          </section>
        </SwiperSlide>
        {/* )} */}
        {/* THIS SLIDE BELOW IS THE FINAL SLIDE */}
        <SwiperSlide>
          <section className="m-4 text-center">
            <h1 className="mb-2 text-2xl font-bold">
              Stay Consistent with Your Salah
            </h1>
            <p>
              Get daily reminders to stay consistent with your Salah. You can
              change the notification time later in Settings.
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
              }}
              className="mb-4"
            >
              Allow Daily Notification
            </IonButton>
            <IonButton
              fill="clear"
              onClick={() => {
                setShowOnboarding(false);
                setShowJoyRideEditIcon(true);
              }}
              className="text-white mb-2text-center rounded-2xl"
            >
              Maybe Later
            </IonButton>
          </section>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Onboarding;
