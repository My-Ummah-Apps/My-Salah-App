import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import MyUmmahAppsLogo from "/src/assets/images/My-Ummah-Apps-72ppi.png";
import { IonModal } from "@ionic/react";

interface BottomSheetAboutUsProps {
  triggerId: string;
}

const BottomSheetAboutUs = ({ triggerId }: BottomSheetAboutUsProps) => {
  return (
    <IonModal
      mode="ios"
      expandToScroll={false}
      className="modal-fit-content"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <div className="pb-6 mt-10 rounded-lg">
        <div className="text-center">
          <img
            className="block mx-auto mb-2"
            src={MyUmmahAppsLogo}
            height="50"
            width="40%"
            alt=""
          />

          <p className="p-4 text-sm leading-5">
            MyUmmahApps Ltd is an organization driven by a passionate commitment
            to empower the Muslim community through privacy friendly Open Source
            Mobile Applications.{" "}
          </p>
        </div>

        <div className="mx-4 mt-5 text-xs text-center">
          <p className="mb-[0.2rem]">App Icon by: </p>
          <a
            className="text-xs underline text-inherit"
            href="https://www.flaticon.com/authors/zane-priedite"
            title="number icons"
          >
            Zane Priedite - Flaticon
          </a>
        </div>
      </div>
    </IonModal>
  );
};

export default BottomSheetAboutUs;
