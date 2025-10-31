import {
  IonContent,
  IonHeader,
  IonModal,
  IonNav,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

import { useRef } from "react";
import SalahTimesSettings from "../Settings/SalahTimesSettings";

interface BottomSheetSalahTimesSettingsProps {
  triggerId: string;
}

const BottomSheetSalahTimesSettings = ({
  triggerId,
}: BottomSheetSalahTimesSettingsProps) => {
  const nav = useRef<HTMLIonNavElement>(null);

  const didPresent = () => {
    if (nav.current) {
      nav.current.setRoot(SalahTimesSettings, { nav: nav.current });
    }
  };

  return (
    <IonModal
      mode="ios"
      trigger={triggerId}
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      onDidPresent={didPresent}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onWillDismiss={() => {
        // setNewReasonInput("");
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Salah Times Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonNav ref={nav}></IonNav>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetSalahTimesSettings;
