import { IonModal } from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
  setStatusAndNavBarBGColor,
} from "../../utils/constants";
import { PreferenceType, userPreferencesType } from "../../types/types";
import { MdCheck } from "react-icons/md";
import { Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

interface BottomSheetAboutUsProps {
  triggerId: string;
  modifyDataInUserPreferencesTable: (
    preference: PreferenceType,
    value: string
  ) => Promise<void>;
  userPreferences: userPreferencesType;
}

const BottomSheetThemeOptions = ({
  triggerId,
  modifyDataInUserPreferencesTable,
  userPreferences,
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
      <section className="pb-10 theme-sheet-content-wrap">
        <h1 className="modal-header-text">Themes</h1>
        <ul className="my-5 notification-ul-wrap">
          {/* // TODO: May need to add aria-pressed to each button */}
          <li className="flex justify-between p-2 ">
            <button
              aria-pressed={userPreferences.theme === "light"}
              className="w-full text-left"
              onClick={async () => {
                if (userPreferences.theme !== "light") {
                  if (Capacitor.isNativePlatform()) {
                    setStatusAndNavBarBGColor("#EDEDED", Style.Light);
                  }

                  await modifyDataInUserPreferencesTable("theme", "light");
                }
              }}
            >
              Light
            </button>
            {userPreferences.theme === "light" && <MdCheck />}
          </li>
          <li className="flex justify-between p-2 ">
            <button
              aria-pressed={userPreferences.theme === "dark"}
              onClick={async () => {
                if (userPreferences.theme !== "dark") {
                  if (Capacitor.isNativePlatform()) {
                    setStatusAndNavBarBGColor("#242424", Style.Dark);
                  }
                  await modifyDataInUserPreferencesTable("theme", "dark");
                }
              }}
              className="w-full text-left"
            >
              Dark
            </button>
            {userPreferences.theme === "dark" && <MdCheck />}
          </li>
          <li className="flex justify-between p-2 ">
            <button
              aria-pressed={userPreferences.theme === "system"}
              onClick={async () => {
                if (userPreferences.theme !== "system") {
                  if (Capacitor.isNativePlatform()) {
                    setStatusAndNavBarBGColor("#242424", Style.Dark);
                  }
                  await modifyDataInUserPreferencesTable("theme", "system");
                }
              }}
              className="w-full text-left"
            >
              System
            </button>
            {userPreferences.theme === "system" && <MdCheck />}
          </li>
        </ul>
      </section>
    </IonModal>
  );
};

export default BottomSheetThemeOptions;
