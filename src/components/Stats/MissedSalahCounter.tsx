import { MissedSalahObjType } from "../../types/types";
import {
  getMissedSalahCount,
  prayerStatusColorsHexCodes,
} from "../../utils/constants";

interface MissedSalahCounterProps {
  isMultiEditMode: boolean;
  setShowMissedPrayersSheet: React.Dispatch<React.SetStateAction<boolean>>;
  missedSalahList: MissedSalahObjType;
}

const MissedSalahCounter = ({
  isMultiEditMode,
  setShowMissedPrayersSheet,
  missedSalahList,
}: MissedSalahCounterProps) => {
  return (
    <div
      className="absolute flex items-center p-1 ml-2 bg-[#313131] rounded-lg"
      onClick={() => {
        if (isMultiEditMode) {
          return;
        }
        setShowMissedPrayersSheet(true);
      }}
    >
      <p
        style={{
          backgroundColor: prayerStatusColorsHexCodes["missed"],
        }}
        className={`w-[1.1rem] h-[1.1rem] rounded-md mr-2`}
      ></p>
      <p className="text-xs">{getMissedSalahCount(missedSalahList)}</p>
    </div>
  );
};

export default MissedSalahCounter;
