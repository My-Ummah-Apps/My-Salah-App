import {
  IonContent,
  IonHeader,
  IonModal,
  IonNav,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

import { useRef, useState } from "react";
import SalahTimesSettingsPage from "../../pages/SalahTimesSettingsPage";

interface BottomSheetSalahTimesSettingsProps {
  triggerId: string;
}

const BottomSheetSalahTimesSettings = ({
  triggerId,
}: BottomSheetSalahTimesSettingsProps) => {
  const [madhab, setMadhab] = useState<"earlier" | "later">("earlier");

  const nav = useRef<HTMLIonNavElement>(null);

  const didPresent = () => {
    if (nav.current) {
      nav.current.setRoot(SalahTimesSettingsPage, {
        nav: nav.current,
        madhab,
        setMadhab,
      });
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
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Salah Times Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonNav ref={nav}></IonNav>
        </IonContent>
      </IonPage>
    </IonModal>
  );
};

export default BottomSheetSalahTimesSettings;
