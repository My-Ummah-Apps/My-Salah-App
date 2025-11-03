import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

interface BottomSheetLocationSettingsProps {
  triggerId: string;
}

const BottomSheetLocationSettings = ({
  triggerId,
}: BottomSheetLocationSettingsProps) => {
  return (
    <IonModal
      mode="ios"
      className={`${isPlatform("ios") ? "" : "modal-height"}`}
      // presentingElement={presentingElement!}
      // style={{ "--height": "95vh" }}
      // expandToScroll={false}
      // className="modal-fit-content"
      onWillDismiss={() => {
        // setNewReasonInput("");
      }}
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {/* <IonButton onClick={() => nav.pop()}>Back</IonButton> */}
          </IonButtons>
          <IonTitle>Location</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="flex justify-center gap-2">
          <IonButton
            onClick={async () => {
              const location = await Geolocation.getCurrentPosition();
              console.log(location.coords.latitude);
              console.log(location.coords.longitude);
              alert(location.coords.latitude + location.coords.longitude);
            }}
          >
            Auto-Detect
          </IonButton>
          <IonButton>Select Manually</IonButton>
        </section>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetLocationSettings;
