import {
  SalahByDateObjType,
  PreferenceType,
  userPreferencesType,
} from "../../types/types";

import { getMissedSalahCount } from "../../utils/constants";
import Joyride, { CallBackProps } from "react-joyride";
import { IonBadge } from "@ionic/react";

import { GoSkip } from "react-icons/go";

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
        <GoSkip className="text-2xl text-white" />
        <IonBadge
          color="danger"
          style={{
            position: "absolute",
            top: "-4px",
            right: "-8px",
            fontSize: "10px",
            borderRadius: "50%",
            padding: "4px",
          }}
        >
          {getMissedSalahCount(missedSalahList)}
        </IonBadge>
      </div>
    </>
  );
};

export default MissedSalahCounter;
