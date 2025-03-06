import { PreferenceType, userPreferencesType } from "../../types/types";
import {
  bottomSheetContainerStyles,
  defaultReasons,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";
import Sheet from "react-modal-sheet";
// import { MdEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VscDebugRestart } from "react-icons/vsc";

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
              <section className="mx-4 my-4">
                <section className="flex justify-between w-full mb-4">
                  {" "}
                  <section className="flex">
                    <input
                      className="p-1 rounded-md bg-zinc-800"
                      onChange={(e) => {
                        setNewReasonInput(e.target.value);
                      }}
                      type="text"
                      value={newReasonInput}
                    ></input>
                    <button
                      className="px-2 ml-2 bg-blue-600 rounded-md"
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
                    >
                      Add
                    </button>
                  </section>
                  <button
                    onClick={async () => {
                      await modifyDataInUserPreferencesTable(
                        "reasons",
                        defaultReasons.split(",")
                      );
                    }}
                  >
                    <VscDebugRestart className="text-2xl" />
                  </button>
                </section>

                <ul>
                  <AnimatePresence>
                    {userPreferences.reasons
                      .sort((a, b) => a.localeCompare(b))
                      .map((reason) => (
                        <motion.li
                          className={`flex justify-between items-center bg-[color:var(--card-bg-color)] px-4 py-4 my-3 rounded-lg`}
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
