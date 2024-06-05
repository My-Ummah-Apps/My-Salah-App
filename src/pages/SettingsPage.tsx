import { useState, useEffect } from "react";
// import { Capacitor } from "@capacitor/core";
// @ts-ignore
import Switch from "react-ios-switch";
import Modal from "react-modal";
// import { Share } from "@capacitor/share";
import SettingIndividual from "../components/Settings/SettingIndividual";
import Sheet from "react-modal-sheet";
import {
  checkNotificationPermissions,
  requestPermissionFunction,
} from "../utils/notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { MdOutlineChevronRight } from "react-icons/md";
// import Switch from "rc-switch";
// import { StatusBar, Style } from "@capacitor/status-bar";

const SettingsPage = ({
  // title,
  setHeading,
  pageStyles,
}: {
  // title: React.ReactNode;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
}) => {
  useEffect(() => {
    setHeading("Settings");
  }, []);

  const [handleNotificationsModal, setHandleNotificationsModal] =
    useState(false);
  const [dailyNotification, setDailyNotification] = useState<string>(
    localStorage.getItem("daily-notification") || "false"
  );
  const defaultDailyNotificationTime = "21:00";
  const [dailyNotificationTime, setDailyNotificationTime] = useState<string>(
    localStorage.getItem("dailyNotificationTime") ||
      defaultDailyNotificationTime
  );

  useEffect(() => {
    if (localStorage.getItem("dailyNotificationTime") === null) {
      localStorage.setItem(
        "dailyNotificationTime",
        defaultDailyNotificationTime
      );
    }
  }, []);

  const handleTimeChange = (e: any) => {
    setDailyNotificationTime(e.target.value);
    const [hour, minute] = e.target.value.split(":").map(Number);
    scheduleDailyNotification(hour, minute);
    localStorage.setItem("dailyNotificationTime", e.target.value);
  };

  useEffect(() => {
    if (dailyNotification !== null) {
      localStorage.setItem("daily-notification", dailyNotification);
    }
  }, [dailyNotification]);

  const scheduleDailyNotification = async (hour: number, minute: number) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Daily Reminder",
          body: `Did you log your prayers today?`,
          id: 1,
          schedule: {
            on: {
              hour: hour,
              minute: minute,
            }, // THIS WORKS ON IOS
            allowWhileIdle: true,
            // foreground: true, // iOS only
            repeats: true,
          },
        },
      ],
    });
  };

  async function checkNotificationPermissions() {
    const checkPermission = await LocalNotifications.checkPermissions();
    const userNotificationPermission = checkPermission.display;
    if (userNotificationPermission === "denied") {
      alert("Please turn notifications back on from within system settings");
      setDailyNotification("false");
      return;
    } else if (userNotificationPermission === "granted") {
      setDailyNotification("true");
      // const notificationTime = dailyNotificationTime.split(":").map(Number);
      // scheduleDailyNotification(notificationTime[0], notificationTime[1]);
    } else if (
      userNotificationPermission === "prompt" ||
      userNotificationPermission === "prompt-with-rationale"
    ) {
      setDailyNotification("false");
      requestPermissionFunction();
    }
  }

  const requestPermissionFunction = async () => {
    const requestPermission = await LocalNotifications.requestPermissions();
    if (requestPermission.display == "granted") {
      setDailyNotification("true");
    } else if (
      requestPermission.display == "prompt" ||
      requestPermission.display == "denied"
    ) {
      setDailyNotification("false");
    }
  };

  const link = (url: string) => {
    window.location.href = url;
  };

  const [showModal, setShowModal] = useState(false);
  setShowModal;

  return (
    <section className={pageStyles}>
      <div className="text-center settings-page-header ">
        {/* <h1>{title}</h1> */}
      </div>
      <div className="settings-page-options-wrap">
        <div
          // style={{ display: "none" }}
          className={` flex items-center justify-between  shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto py-3 px-1 mb-[1rem] rounded-md`}
          onClick={() => {
            setHandleNotificationsModal(true);
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
        </div>{" "}
        <Sheet
          detent="content-height"
          tweenConfig={{ ease: "easeOut", duration: 0.3 }}
          isOpen={handleNotificationsModal}
          onClose={() => setHandleNotificationsModal(false)}
        >
          <Sheet.Container style={{ backgroundColor: "rgb(33, 36, 38)" }}>
            <Sheet.Header />
            <Sheet.Content>
              <div className="h-[50vh]">
                <div className="flex items-center justify-between p-3 notification-text-and-toggle-wrap">
                  <p>Turn on Daily Notification</p>{" "}
                  <Switch
                    checked={dailyNotification === "true" ? true : false}
                    className={undefined}
                    disabled={undefined}
                    handleColor="white"
                    name={undefined}
                    offColor="white"
                    onChange={() => {
                      if (
                        localStorage.getItem("daily-notification") === "true"
                      ) {
                        setDailyNotification("false");
                      } else if (
                        localStorage.getItem("daily-notification") === "false"
                      ) {
                        setDailyNotification("true");
                        checkNotificationPermissions();
                      }
                    }}
                    onColor="lightblue"
                    pendingOffColor={undefined}
                    pendingOnColor={undefined}
                    readOnly={undefined}
                    style={undefined}
                  />
                </div>
                {dailyNotification === "true" ? (
                  <div className="flex items-center justify-between p-3">
                    <p>Set Time</p>
                    {/* <p> */}
                    <input
                      onChange={(e) => {
                        handleTimeChange(e);
                        // console.log(e.currentTarget);
                      }}
                      style={{ backgroundColor: "transparent" }}
                      className={`${
                        dailyNotification ? "slideUp" : ""
                      } focus:outline-none focus:ring-0 focus:border-transparent w-[auto] `}
                      type="time"
                      id="appt"
                      name="appt"
                      min="09:00"
                      max="18:00"
                      value={dailyNotificationTime}
                      required
                    />
                    {/* </p> */}
                  </div>
                ) : null}
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
        {/* <SettingIndividual
          indvidualStyles={"my-[1rem] rounded-md"}
          headingText={"Notifications"}
          subText={"Set Notifications"}
          onClick={() => {
            // checkNotificationPermissions();
            // handleOpenModal2();
            alert("Notifications clicked");
          }}
        /> */}
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
        {/* <SettingIndividual
          headingText={"Website"}
          subText={"Visit our website"}
          onClick={() => {
            link("https://myummahapps.com/");
          }}
        /> */}
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
