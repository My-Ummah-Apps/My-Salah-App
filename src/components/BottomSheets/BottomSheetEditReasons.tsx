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
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [newReasonInput, setNewReasonInput] = useState("");
  useEffect(() => {
    console.log("userPreferences.reasons: ", userPreferences.reasons);
  }, [userPreferences]);

  return (
    <>
      {" "}
      <Sheet
        detent="full-height"
        tweenConfig={TWEEN_CONFIG}
        isOpen={showEditReasonsSheet}
        onClose={() => setShowEditReasonsSheet(false)}
      >
        <Sheet.Container style={bottomSheetContainerStyles}>
          <Sheet.Header style={sheetHeaderHeight} />
          <Sheet.Content>
            <Sheet.Scroller>
              <section className="m-4">
                <section className="flex justify-between w-full mb-4">
                  {" "}
                  <section className="flex">
                    <input
                      onChange={(e) => {
                        setNewReasonInput(e.target.value);
                      }}
                      className="p-1 bg-black rounded-md"
                      type="text"
                      value={newReasonInput}
                    ></input>
                    <button
                      onClick={async () => {
                        if (
                          userPreferences.reasons.some(
                            (item) =>
                              item.toLocaleLowerCase() ===
                              newReasonInput.toLocaleLowerCase()
                          )
                        ) {
                          alert(`${newReasonInput} already exists`);
                          return;
                        }
                        const updatedReasons = [
                          ...userPreferences.reasons,
                          newReasonInput,
                        ];
                        await modifyDataInUserPreferencesTable(
                          "reasons",
                          updatedReasons
                        );
                        setNewReasonInput("");
                        // console.log("UPDATED REASONS: ", updatedReasons);
                      }}
                      className="px-2 py-1 ml-2 bg-blue-600 rounded-md "
                    >
                      Add
                    </button>
                  </section>
                  <button>Reset To Defaults</button>
                </section>

                <ul>
                  <AnimatePresence>
                    {userPreferences.reasons
                      .sort((a, b) => a.localeCompare(b))
                      .map((reason) => (
                        <motion.li
                          className={`flex justify-between items-center bg-[color:var(--card-bg-color)] px-4 py-4 mx-3 my-3 rounded-lg`}
                          layout
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{
                            delay: 0.1,
                            duration: 0.5,
                            layout: { duration: 0.2 },
                          }}
                          key={reason}
                        >
                          <p>{reason}</p>
                          <p
                            onClick={async () => {
                              const modifiedReasons =
                                userPreferences.reasons.filter(
                                  (item) => item !== reason
                                );
                              await modifyDataInUserPreferencesTable(
                                "reasons",
                                modifiedReasons
                              );
                            }}
                          >
                            <TiDelete className="text-lg" />
                          </p>
                        </motion.li>
                      ))}
                  </AnimatePresence>
                </ul>
              </section>
              <section className="flex justify-between w-full px-4 py-4"></section>
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
