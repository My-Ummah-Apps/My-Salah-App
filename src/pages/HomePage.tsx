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
import { getMissedSalahCount, pageTransitionStyles } from "../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

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
  pageStyles: string;
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
  pageStyles,
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
  const prevActiveStreakCount = useRef<number | undefined>();

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
    console.log("Active streak count: ", activeStreakCount);
    console.log("prevActiveStreakCount: ", prevActiveStreakCount.current);

    // if (!prevActiveStreakCount.current) return;

    if (activeStreakCount > prevActiveStreakCount.current) {
      setAnimateStreakCounter(true);
      console.log("ANIMATION SET TO TRUE");
    }
    prevActiveStreakCount.current = activeStreakCount;
  }, [activeStreakCount]);

  return (
    <motion.section
      {...pageTransitionStyles}
      className={`${pageStyles} home-page-wrap`}
    >
      <header className="home-page-header">
        <section className="header-wrapper">
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

          <p className="home-page-header-p">{"Home"}</p>
          <div
            onClick={showStreakInfoHomePage}
            className={`absolute top-1/2 right-[-7px] py-1 -translate-y-1/2`}
          >
            <div className="relative flex items-center justify-center w-full py-10">
              <img
                style={{ width: "30px", height: "100%", marginRight: "-2rem" }}
                src={wreathLeft}
                alt=""
                srcSet=""
              />
              {/* <div className="bg-slate-600">
                <svg
                  width="50%"
                  height="50%"
                  className=""
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  style={{
                    fillRule: "evenodd",
                    textRendering: "geometricPrecision",
                    imageRendering: "crisp-edges",
                    clipRule: "evenodd",
                    shapeRendering: "geometricPrecision",
                  }}
                  viewBox="0 0 9687 15065"
                  // {...props}
                >
                  <path
                    d="M5290 48c125 138-115 557-535 936-316 286-693 414-877 440-263 204-501 420-716 647l-23 27c154-85 549-208 989-154 561 68 998 273 976 458s-496 279-1057 211c-522-63-923-353-971-441l-258 298c-45 57-88 114-130 171l-117 166c-116 172-222 347-317 527 127-121 478-341 917-403 560-78 1035 8 1061 192s-408 397-968 475c-525 73-990-107-1053-179-215 423-372 866-477 1319 103-155 380-439 771-603 522-218 1003-256 1075-84s-293 487-815 705c-475 198-957 151-1057 99-82 394-125 795-132 1199 0 480 48 960 134 1429l79 288c8-178 106-576 375-922 346-447 747-717 894-603s-15 569-361 1016c-326 420-786 616-880 607l237 862c241 659 554 1285 953 1859-60-132-133-578 9-1039 167-540 447-934 624-879 178 55 186 538 19 1078s-567 897-624 879c-1 0-2-1-2-1 71 100 144 199 220 296l643 697c-73-193-145-521-100-877 70-561 277-997 462-974 184 23 277 497 206 1058-61 482-313 860-421 952l82 89 922 758c-109-174-247-490-269-859-34-564 89-1031 275-1042s363 438 397 1002c29 484-150 901-239 1013 358 233 732 422 1126 578-138-156-313-421-402-749-147-546-121-1028 58-1076 180-48 444 355 592 901 118 438 46 855-16 1012 70 25 141 49 213 73l985 230c-167-123-384-336-538-623-266-499-350-974-186-1062s513 246 779 745c219 409 239 843 210 1001l773 148c254 73 509 205 692 399l172 228c35 75 3 164-72 200-75 35-164 3-200-72-63-130-129-244-255-327-354-232-757-309-1163-380-51 149-284 519-681 768-479 301-947 417-1046 259-99-157 209-529 688-829 239-150 493-228 690-261-95-19-190-40-283-65-293-79-580-171-861-278-35 102-364 463-855 632-534 185-1017 192-1078 17-61-176 323-468 858-653 322-112 641-115 847-88-398-168-781-371-1142-614-63 96-455 376-963 443-561 73-1035-17-1059-202-24-184 411-393 972-466 351-46 674 21 869 93l-897-761c-33-32-67-65-100-97-48 75-501 298-1037 269-565-31-1014-207-1004-393s476-311 1041-280c372 21 691 158 865 267-312-321-605-666-861-1033-109 69-563 184-1049 70-551-129-963-380-920-561 42-181 523-223 1074-94 323 76 588 235 749 366-1-1-1-2-2-3l-579-1135c-53 54-567 117-1070-99-520-223-882-542-809-713s554-129 1074 94c390 167 663 454 765 610l-400-1106c-21-78-40-157-58-236-73 41-582 5-1031-296-470-314-767-695-664-849 103-155 568-25 1038 290 328 219 538 522 623 701-94-454-145-918-154-1382-1 5-3 9-5 11-43 42-562-91-958-494s-610-836-478-966c133-130 562 91 958 494 315 320 458 715 482 885-5-476 33-953 115-1420 130-743 447-1466 899-2070l43-49c152-226 322-460 469-626 148-167 307-307 438-421l8-9 268-259c-40-46 115-557 535-936s861-574 986-436zm-2164 2c186 9 313 475 284 1040s-328 1009-388 1006-313-475-284-1040S2941 41 3126 50zM1717 1357c182-38 424 379 541 932s-59 1059-118 1071-424-379-541-932-64-1033 118-1071zM699 2983c166-83 507 259 760 764 254 505 212 1039 159 1066-54 27-507-259-760-764-254-505-325-983-159-1066zm2461 2047c121 141-130 554-560 921s-958 455-997 409 130-554 560-921 876-550 997-409zm68 2450c165 85 90 562-169 1065-258 503-714 784-767 757s-90-562 169-1065c258-503 602-842 767-757z"
                    style={{
                      fill: "#000",
                      stroke: "#2b2a29",
                      strokeWidth: 7.62,
                    }}
                  />
                </svg>
              </div> */}

              <div className="absolute -translate-x-1/2 -translate-y-[53%] top-[53%] left-1/2">
                <AnimatePresence mode="wait">
                  <motion.p
                    className="text-xs"
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
                              delay: 0.2,
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
                style={{ width: "30px", height: "100%", marginLeft: "2rem" }}
                src={wreathRight}
                alt=""
                srcSet=""
              />
              {/* <div className="bg-slate-600">
                <svg
                  width="50%"
                  height="50%"
                  className=""
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  style={{
                    fillRule: "evenodd",
                    textRendering: "geometricPrecision",
                    imageRendering: "crisp-edges",
                    clipRule: "evenodd",
                    shapeRendering: "geometricPrecision",
                    transform: "scaleX(-1)",
                  }}
                  viewBox="0 0 9687 15065"
                >
                  <path
                    d="M5290 48c125 138-115 557-535 936-316 286-693 414-877 440-263 204-501 420-716 647l-23 27c154-85 549-208 989-154 561 68 998 273 976 458s-496 279-1057 211c-522-63-923-353-971-441l-258 298c-45 57-88 114-130 171l-117 166c-116 172-222 347-317 527 127-121 478-341 917-403 560-78 1035 8 1061 192s-408 397-968 475c-525 73-990-107-1053-179-215 423-372 866-477 1319 103-155 380-439 771-603 522-218 1003-256 1075-84s-293 487-815 705c-475 198-957 151-1057 99-82 394-125 795-132 1199 0 480 48 960 134 1429l79 288c8-178 106-576 375-922 346-447 747-717 894-603s-15 569-361 1016c-326 420-786 616-880 607l237 862c241 659 554 1285 953 1859-60-132-133-578 9-1039 167-540 447-934 624-879 178 55 186 538 19 1078s-567 897-624 879c-1 0-2-1-2-1 71 100 144 199 220 296l643 697c-73-193-145-521-100-877 70-561 277-997 462-974 184 23 277 497 206 1058-61 482-313 860-421 952l82 89 922 758c-109-174-247-490-269-859-34-564 89-1031 275-1042s363 438 397 1002c29 484-150 901-239 1013 358 233 732 422 1126 578-138-156-313-421-402-749-147-546-121-1028 58-1076 180-48 444 355 592 901 118 438 46 855-16 1012 70 25 141 49 213 73l985 230c-167-123-384-336-538-623-266-499-350-974-186-1062s513 246 779 745c219 409 239 843 210 1001l773 148c254 73 509 205 692 399l172 228c35 75 3 164-72 200-75 35-164 3-200-72-63-130-129-244-255-327-354-232-757-309-1163-380-51 149-284 519-681 768-479 301-947 417-1046 259-99-157 209-529 688-829 239-150 493-228 690-261-95-19-190-40-283-65-293-79-580-171-861-278-35 102-364 463-855 632-534 185-1017 192-1078 17-61-176 323-468 858-653 322-112 641-115 847-88-398-168-781-371-1142-614-63 96-455 376-963 443-561 73-1035-17-1059-202-24-184 411-393 972-466 351-46 674 21 869 93l-897-761c-33-32-67-65-100-97-48 75-501 298-1037 269-565-31-1014-207-1004-393s476-311 1041-280c372 21 691 158 865 267-312-321-605-666-861-1033-109 69-563 184-1049 70-551-129-963-380-920-561 42-181 523-223 1074-94 323 76 588 235 749 366-1-1-1-2-2-3l-579-1135c-53 54-567 117-1070-99-520-223-882-542-809-713s554-129 1074 94c390 167 663 454 765 610l-400-1106c-21-78-40-157-58-236-73 41-582 5-1031-296-470-314-767-695-664-849 103-155 568-25 1038 290 328 219 538 522 623 701-94-454-145-918-154-1382-1 5-3 9-5 11-43 42-562-91-958-494s-610-836-478-966c133-130 562 91 958 494 315 320 458 715 482 885-5-476 33-953 115-1420 130-743 447-1466 899-2070l43-49c152-226 322-460 469-626 148-167 307-307 438-421l8-9 268-259c-40-46 115-557 535-936s861-574 986-436zm-2164 2c186 9 313 475 284 1040s-328 1009-388 1006-313-475-284-1040S2941 41 3126 50zM1717 1357c182-38 424 379 541 932s-59 1059-118 1071-424-379-541-932-64-1033 118-1071zM699 2983c166-83 507 259 760 764 254 505 212 1039 159 1066-54 27-507-259-760-764-254-505-325-983-159-1066zm2461 2047c121 141-130 554-560 921s-958 455-997 409 130-554 560-921 876-550 997-409zm68 2450c165 85 90 562-169 1065-258 503-714 784-767 757s-90-562 169-1065c258-503 602-842 767-757z"
                    style={{
                      fill: "#000",
                      stroke: "#2b2a29",
                      strokeWidth: 7.62,
                    }}
                  />
                </svg>
              </div> */}
            </div>
          </div>
          {/* <div
            className="missed-salah-counter absolute top-1/2 right-0 w-10 py-1 -translate-y-1/2 flex justify-between items-center bg-[#252525] rounded-lg"
            onClick={() => {}}
          >
            <div className={`w-[1.1rem] h-[1.1rem] rounded-md flex`}>
              {" "}
              <img
                style={{ width: "40px", height: "100%", marginRight: "0rem" }}
                src={wreathLeft}
                alt=""
                srcSet=""
              />
              <img
                style={{ width: "40px", height: "100%", marginLeft: "-0.5rem" }}
                src={wreathRight}
                alt=""
                srcSet=""
              />
            </div>
            <p className="text-xs">{getMissedSalahCount(missedSalahList)}</p>
          </div> */}
          {/* <StreakCount styles={{ backgroundColor: "grey" }} /> */}
        </section>
      </header>
      <section className="home-page-components-wrap">
        {/* <header className="home-page-header">
          <p>Home</p>
        </header> */}

        <SalahTable
          dbConnection={dbConnection}
          checkAndOpenOrCloseDBConnection={checkAndOpenOrCloseDBConnection}
          modifyDataInUserPreferencesTable={modifyDataInUserPreferencesTable}
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
          fetchedSalahData={fetchedSalahData}
          setShowMissedSalahsSheet={setShowMissedSalahsSheet}
          showMissedSalahsSheet={showMissedSalahsSheet}
          missedSalahList={missedSalahList}
          // setSelectedSalahAndDate={setSelectedSalahAndDate}
          // setShowUpdateStatusModal={setShowUpdateStatusModal}
        />
      </section>
    </motion.section>
  );
};

export default HomePage;
