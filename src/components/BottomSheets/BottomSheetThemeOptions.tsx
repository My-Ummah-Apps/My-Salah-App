import { IonModal } from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import { PreferenceType, themeType } from "../../types/types";
import { MdCheck } from "react-icons/md";

interface BottomSheetAboutUsProps {
  triggerId: string;
  theme: themeType;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  handleTheme: (theme?: themeType) => string;
}

const BottomSheetThemeOptions = ({
  triggerId,
  theme,
  modifyDataInUserPreferencesTable,
}: BottomSheetAboutUsProps) => {
  return (
    <IonModal
      mode="ios"
      expandToScroll={false}
      className="modal-fit-content"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <section className="py-10 theme-sheet-content-wrap">
        {/* <h1 className="modal-header-text">Themes</h1> */}
        <ul className="mx-2 my-5 rounded-lg notification-ul-wrap">
          {/* // TODO: May need to add aria-pressed to each button */}
          <li className="flex justify-between p-3 border-b border-[var(--table-row-border-color)]">
            <button
              aria-pressed={theme === "light"}
              className="w-full text-left"
              onClick={async () => {
                await modifyDataInUserPreferencesTable("theme", "light");
              }}
            >
              Light
            </button>
            {theme === "light" && <MdCheck />}
          </li>
          <li className="flex justify-between p-3 border-b border-[var(--table-row-border-color)]">
            <button
              aria-pressed={theme === "dark"}
              onClick={async () => {
                await modifyDataInUserPreferencesTable("theme", "dark");
              }}
              className="w-full text-left"
            >
              Dark
            </button>
            {theme === "dark" && <MdCheck />}
          </li>
          <li className="flex justify-between p-3 ">
            <button
              aria-pressed={theme === "system"}
              onClick={async () => {
                await modifyDataInUserPreferencesTable("theme", "system");
              }}
              className="w-full text-left"
            >
              System
            </button>
            {theme === "system" && <MdCheck />}
          </li>
        </ul>
      </section>
    </IonModal>
  );
};

export default BottomSheetThemeOptions;
