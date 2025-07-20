import {
  SalahByDateObjType,
  PreferenceType,
  userPreferencesType,
} from "../../types/types";
import { motion } from "framer-motion";
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
        className="missed-salah-counter absolute top-1/2 left-0 px-2 py-1 -translate-y-1/2 flex items-center bg-[#252525] rounded-lg"
        onClick={() => {
          if (isMultiEditMode) {
            return;
          }
          setShowMissedSalahsSheet(true);
        }}
      >
        <p
          style={{
            backgroundColor: salahStatusColorsHexCodes["missed"],
          }}
          className={`w-[1.1rem] h-[1.1rem] rounded-md mr-2`}
        ></p>
        <motion.p className="text-xs">
          {getMissedSalahCount(missedSalahList)}
        </motion.p>
      </div>
    </>
  );
};

export default MissedSalahCounter;
