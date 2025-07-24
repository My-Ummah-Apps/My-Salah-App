import {
  SalahByDateObjType,
  PreferenceType,
  userPreferencesType,
} from "../../types/types";

import {
  getMissedSalahCount,
  salahStatusColorsHexCodes,
} from "../../utils/constants";
import Joyride, { CallBackProps } from "react-joyride";

interface MissedSalahCounterProps {
  isMultiEditMode: boolean;
  setShowMissedSalahsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  missedSalahList: SalahByDateObjType;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  userPreferences: userPreferencesType;
}

const MissedSalahCounter = ({
  isMultiEditMode,
  setShowMissedSalahsSheet,
  missedSalahList,
  modifyDataInUserPreferencesTable,
  userPreferences,
}: MissedSalahCounterProps) => {
  const joyRideMissedSalahCounterToolTip = [
    {
      target: ".missed-salah-counter",
      content: "Tap this icon to see all your missed salah and complete them",
      disableBeacon: true,
    },
  ];

  const handleJoyRideCompletion = async (data: CallBackProps) => {
    if (data.status === "ready") {
      await modifyDataInUserPreferencesTable("isMissedSalahToolTipShown", "1");
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
          className="numberCircle flex items-center justify-center min-w-[16px] h-[30px] aspect-square rounded-full border-[1.5px] border-[#c11414]"
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
