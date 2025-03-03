import { PreferenceType, userPreferencesType } from "../../types/types";
import {
  bottomSheetContainerStyles,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import Sheet from "react-modal-sheet";
// import { MdEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { useState } from "react";

interface BottomSheetStartDateProps {
  showEditReasonsSheet: boolean;
  setShowEditReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string | string[]
  ) => Promise<void>;
  userPreferences: userPreferencesType;
}

const BottomSheetEditReasons = ({
  setShowEditReasonsSheet,
  showEditReasonsSheet,
  modifyDataInUserPreferencesTable,
  userPreferences,
}: BottomSheetStartDateProps) => {
  const handleNewReasonInput = (e) => {
    setHandleNewReason(e.target.value);
  };
  const [handleNewReason, setHandleNewReason] = useState("");

  return (
    <>
      {" "}
      <Sheet
        detent="content-height"
        tweenConfig={TWEEN_CONFIG}
        isOpen={showEditReasonsSheet}
        onClose={() => setShowEditReasonsSheet(false)}
      >
        <Sheet.Container style={bottomSheetContainerStyles}>
          <Sheet.Header style={sheetHeaderHeight} />
          <Sheet.Content>
            <Sheet.Scroller>
              <section className="m-4">
                <section className="mb-4 text-center">
                  {" "}
                  <input
                    onChange={(e) => {
                      handleNewReasonInput(e);
                    }}
                    className="p-1 bg-black rounded-md"
                    type="text"
                  ></input>
                  <button
                    onClick={() => {
                      const updatedReasons = [
                        ...userPreferences.reasons,
                        handleNewReason,
                      ];
                      modifyDataInUserPreferencesTable(
                        "reasons",
                        updatedReasons
                      );
                      console.log("UPDATED REASONS: ", updatedReasons.join(""));
                    }}
                    className="px-2 py-1 ml-2 bg-blue-600 rounded-md "
                  >
                    Add
                  </button>
                </section>
                <ul>
                  {userPreferences.reasons
                    .sort((a, b) => a.localeCompare(b))
                    .map((reason) => (
                      <li className="flex items-center justify-between p-2 my-2 rounded-md bg-stone-900">
                        <p>{reason}</p>
                        {/* <section className=""> */}
                        {/* <p className="mr-2">
                          <MdEdit />
                        </p> */}
                        <p>
                          <TiDelete className="text-lg" />
                        </p>
                        {/* </section> */}
                      </li>
                    ))}
                </ul>
              </section>
              <section className="flex justify-between w-full px-4 py-4">
                <button
                // className={`text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3 mx-auto mb-[7%] ${
                //   selectedStartDate ? "opacity-100" : "opacity-20"
                // }`}
                // onClick={async () => {
                //   if (selectedStartDate) {
                //     await handleStartDateChange();
                //   }
                // }}
                >
                  Reset To Defaults
                </button>
                <button
                  onClick={() => {}}
                  // className={`text-base border-none rounded-xl bg-[#5c6bc0] text-white w-[90%] p-3 mx-auto mb-[7%] ${
                  //   selectedStartDate ? "opacity-100" : "opacity-20"
                  // }`}
                >
                  Close
                </button>
              </section>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          style={sheetBackdropColor}
          onTap={() => setShowEditReasonsSheet(false)}
        />
      </Sheet>
    </>
  );
};

export default BottomSheetEditReasons;
