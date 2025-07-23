import { PreferenceType, userPreferencesType } from "../../types/types";
import {
  defaultReasons,
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  showAlert,
  showConfirmMsg,
  showToast,
} from "../../utils/constants";

import { TiDelete } from "react-icons/ti";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VscDebugRestart } from "react-icons/vsc";
import { IonContent, IonModal } from "@ionic/react";

interface BottomSheetStartDateProps {
  triggerId: string;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string | string[]
  ) => Promise<void>;
  userPreferences: userPreferencesType;
}

const BottomSheetEditReasons = ({
  triggerId,
  modifyDataInUserPreferencesTable,
  userPreferences,
}: BottomSheetStartDateProps) => {
  const CHAR_LIMIT = 20;
  const [charCount, setCharCount] = useState(CHAR_LIMIT);
  const [newReasonInput, setNewReasonInput] = useState("");

  return (
    <IonModal
      mode="ios"
      className="modal-height"
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onWillDismiss={() => {
        setNewReasonInput("");
      }}
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        <section className="mx-4 mt-10 mb-10">
          <section className="flex justify-between w-full">
            {" "}
            <section className="flex">
              <input
                className="p-1 rounded-md bg-zinc-800"
                onChange={(e) => {
                  if (e.target.value.length > CHAR_LIMIT) return;
                  setNewReasonInput(e.target.value);
                  setCharCount(CHAR_LIMIT - e.target.value.length);
                }}
                type="text"
                dir="auto"
                maxLength={CHAR_LIMIT}
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
                    showAlert("Duplicate Reason", "This reason already exists");
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
                  setCharCount(CHAR_LIMIT);
                  showToast(`${newReasonInput} added`, "short");
                }}
              >
                Add
              </button>
            </section>
            <button
              onClick={async () => {
                const reasonConfirmMsgRes = await showConfirmMsg(
                  "Reset Reasons?",
                  "This will reset all reasons to the app’s default reasons. Are you sure you want to proceed?"
                );
                if (!reasonConfirmMsgRes) return;
                await modifyDataInUserPreferencesTable(
                  "reasons",
                  defaultReasons.split(",")
                );
                showToast("Default Reasons Restored", "short");
              }}
            >
              <VscDebugRestart className="text-2xl" />
            </button>
          </section>

          {newReasonInput.length > 0 && (
            <motion.p
              layout
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                color: charCount === 0 ? "red" : "white",
              }}
              className="mt-1 text-xs"
            >
              {`${charCount} characters left`}
            </motion.p>
          )}

          <ul className="mt-3">
            <AnimatePresence>
              {userPreferences.reasons
                .sort((a, b) => a.localeCompare(b))
                .map((reason) => (
                  <motion.li
                    className={`flex justify-between items-center bg-[color:var(--card-bg-color)] px-2 py-4 my-3 rounded-lg`}
                    layout
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{
                      // delay: 0.1,
                      duration: 0.3,
                      layout: { duration: 0.2 },
                    }}
                    key={reason}
                  >
                    <p>{reason}</p>
                    <p
                      onClick={async () => {
                        const modifiedReasons = userPreferences.reasons.filter(
                          (item) => item !== reason
                        );
                        await modifyDataInUserPreferencesTable(
                          "reasons",
                          modifiedReasons
                        );
                      }}
                    >
                      <TiDelete className="text-2xl" />
                    </p>
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetEditReasons;
