import { useRef } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { LATEST_APP_VERSION } from "../utils/changelog";
import { userPreferencesType } from "../types/types";
import { updateUserPrefs, scheduleDailyNotification } from "../utils/constants";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface OnboardingProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  setShowJoyRideEditIcon: React.Dispatch<React.SetStateAction<boolean>>;
}

const Onboarding = ({
  dbConnection,
  setUserPreferences,
  setShowOnboarding,
  setShowJoyRideEditIcon,
}: OnboardingProps) => {
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handleGenderSelect = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgb(36, 36, 36)",
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
          <section className="p-5">
            <h1 className="text-4xl">I am a...</h1>
            <p
              className="py-2 my-4 text-2xl text-center text-white bg-blue-800 rounded-2xl"
              onClick={async () => {
                handleGenderSelect();
                await updateUserPrefs(
                  dbConnection,
                  "userGender",
                  "male",
                  setUserPreferences
                );

                localStorage.setItem("appVersion", LATEST_APP_VERSION);
              }}
            >
              Brother
            </p>
            <p
              className="py-2 text-2xl text-center text-white bg-purple-900 rounded-2xl"
              onClick={async () => {
                handleGenderSelect();
                await updateUserPrefs(
                  dbConnection,
                  "userGender",
                  "female",
                  setUserPreferences
                );

                localStorage.setItem("appVersion", LATEST_APP_VERSION);
              }}
            >
              Sister
            </p>
          </section>
        </SwiperSlide>
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
          <section className="flex flex-col p-5">
            <button
              onClick={async () => {
                const permission =
                  await LocalNotifications.requestPermissions();
                if (permission.display === "granted") {
                  //   setShowIntroModal(false);
                  setShowOnboarding(false);
                  setShowJoyRideEditIcon(true);
                  scheduleDailyNotification(21, 0);
                  await updateUserPrefs(
                    dbConnection,
                    "dailyNotification",
                    "1",
                    setUserPreferences
                  );
                  await updateUserPrefs(
                    dbConnection,
                    "dailyNotificationTime",
                    "21:00",
                    setUserPreferences
                  );
                } else {
                  //   setShowIntroModal(false);
                  setShowOnboarding(false);
                  setShowJoyRideEditIcon(true);
                }
              }}
              className="py-3 m-2 text-center text-white bg-blue-600 rounded-2xl"
            >
              Allow Daily Notification
            </button>
            <button
              onClick={() => {
                // setShowIntroModal(false);
                setShowOnboarding(false);
                setShowJoyRideEditIcon(true);
              }}
              className="py-3 m-2 text-center text-white rounded-2xl"
            >
              Maybe Later
            </button>
          </section>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Onboarding;
