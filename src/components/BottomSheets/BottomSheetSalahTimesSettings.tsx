import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

interface BottomSheetSalahTimesSettingsProps {
  triggerId: string;
}

const BottomSheetSalahTimesSettings = ({
  triggerId,
}: BottomSheetSalahTimesSettingsProps) => {
  return (
    <>
      <IonModal
        mode="ios"
        trigger={triggerId}
        className={`${isPlatform("ios") ? "" : "modal-height"}`}
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
          <section className="text-center">
            <h5>Select Location</h5>
            <section className="flex justify-center gap-2">
              <IonButton>Auto-Detect</IonButton>
              <IonButton>Select Manually</IonButton>
            </section>
          </section>
          <section className="mt-10 text-center">
            <h5>Calculation Method</h5>
            <IonList>
              <IonItem>
                <IonSelect
                  aria-label="Calculation Method"
                  interface="modal"
                  placeholder="Select a calculation method"
                >
                  <IonSelectOption value="apples">
                    Muslim World League
                  </IonSelectOption>
                  <IonSelectOption value="oranges">ISNA</IonSelectOption>
                  <IonSelectOption value="bananas">
                    Moonsighting Committee
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
          </section>
        </IonContent>
      </IonModal>
    </>
  );
};

export default BottomSheetSalahTimesSettings;
