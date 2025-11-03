import {
  IonContent,
  IonHeader,
  IonModal,
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import BottomSheetLocationSettings from "./BottomSheetLocationSettings";

interface BottomSheetSalahTimesSettingsProps {
  triggerId: string;
}

const BottomSheetSalahTimesSettings = ({
  triggerId,
}: BottomSheetSalahTimesSettingsProps) => {
  const [madhab, setMadhab] = useState<"earlier" | "later">("earlier");

  // useEffect(() => {
  //   console.log("madhab is: ", madhab);
  // }, [madhab]);

  return (
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
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Salah Times Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <section className="mt-10 text-center">
            <section className="text-center">
              <h5>Location</h5>
              <IonButton
                id="open-location-settings"
                style={{
                  "--background": "transparent",
                }}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-500 rounded-md"
              >
                {/* <section className=""> */}
                <p>Select location</p>

                {/* </section> */}
              </IonButton>
              <BottomSheetLocationSettings triggerId="open-location-settings" />
            </section>
            <h5>Calculation Method</h5>
            <IonButton
              style={{
                "--background": "transparent",
              }}
              onClick={() => {}}
              className="w-full"
            >
              <section className="flex items-center justify-between w-full px-4 py-2 border border-gray-500 rounded-md">
                <p>Select calculation method</p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </section>
            </IonButton>
          </section>
          <section className="mt-10 text-center">
            <h5 className="mb-5">Madhab / Asr Time</h5>
            <section className="flex justify-center gap-2 m-3">
              <IonButton
                style={{
                  "--background": "transparent",
                }}
                onClick={() => {
                  setMadhab("earlier");
                }}
                className={`${
                  madhab === "earlier"
                    ? "bg-blue-500 rounded-md"
                    : "border rounded-md"
                }`}
              >
                <section className="text-sm text-white">
                  <p className="mb-2">
                    <strong>Earlier Asr Time</strong>
                  </p>
                  <p className="text-xs">Shafi'i, Maliki & Hanbali</p>
                </section>
              </IonButton>
              <IonButton
                style={{
                  "--background": "transparent",
                }}
                onClick={() => {
                  setMadhab("later");
                }}
                className={` ${
                  madhab === "later"
                    ? "bg-blue-500 rounded-md"
                    : "border rounded-md"
                }`}
              >
                <section className="text-sm text-white">
                  <p className="mb-2">
                    <strong>Later Asr Time </strong>
                  </p>
                  <p className="text-xs">Hanafi</p>
                </section>
              </IonButton>
            </section>
          </section>
        </IonContent>
      </IonPage>
    </IonModal>
  );
};

export default BottomSheetSalahTimesSettings;
