import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { SalahByDateObjType, userPreferencesType } from "../../types/types";

import { salahStatusColorsHexCodes } from "../../utils/constants";
import Joyride, { CallBackProps } from "react-joyride";
import { getMissedSalahCount, updateUserPrefs } from "../../utils/helpers";

interface MissedSalahCounterProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  isMultiEditMode: boolean;
  setShowMissedSalahsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  missedSalahList: SalahByDateObjType;
  userPreferences: userPreferencesType;
}

const MissedSalahCounter = ({
  dbConnection,
  isMultiEditMode,
  setShowMissedSalahsSheet,
  missedSalahList,
  setUserPreferences,
  userPreferences,
}: MissedSalahCounterProps) => {
  const joyRideMissedSalahCounterToolTip = [
    {
      target: ".missed-salah-counter",
      content: "Tap this circle to see all your missed salah and complete them",
      disableBeacon: true,
    },
  ];

  const handleJoyRideCompletion = async (data: CallBackProps) => {
    if (data.status === "ready") {
      await updateUserPrefs(
        dbConnection,
        "isMissedSalahToolTipShown",
        "1",
        setUserPreferences,
      );
    }
  };

  return (
    <>
      <Joyride
        disableOverlay={true}
        disableOverlayClose={true}
        run={userPreferences.isMissedSalahToolTipShown === "0"}
        locale={{
          last: "Done",
          next: "Next",
          back: "Back",
        }}
        hideCloseButton={true}
        disableScrolling={true}
        callback={handleJoyRideCompletion}
        styles={{
          options: {
            backgroundColor: "#27272a",
            arrowColor: "#27272a",
            textColor: "#fff",
            zIndex: 10000,
          },
          buttonNext: {
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 12px",
          },
          buttonBack: {
            backgroundColor: "#f44336",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 12px",
          },
        }}
        steps={joyRideMissedSalahCounterToolTip}
        continuous
      />
      <div
        onClick={() => {
          if (isMultiEditMode) {
            return;
          }
          setShowMissedSalahsSheet(true);
        }}
        style={{ position: "relative", display: "inline-block" }}
      >
        <div
          className="missed-salah-counter numberCircle flex items-center justify-center min-w-[16px] h-[30px] aspect-square rounded-full border-[1.5px] border-[#c11414]"
          style={{ borderColor: salahStatusColorsHexCodes["missed"] }}
        >
          {/* <p className="text-xs text-white">99</p> */}
          <p className="text-xs text-white">
            {getMissedSalahCount(missedSalahList) < 100
              ? getMissedSalahCount(missedSalahList)
              : "99+"}
          </p>
        </div>
      </div>
    </>
  );
};

export default MissedSalahCounter;
