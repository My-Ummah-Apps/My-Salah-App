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
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import {
  LocationsDataObjTypeArr,
  userPreferencesType,
} from "../../types/types";

interface BottomSheetSalahTimesSettingsProps {
  triggerId: string;
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  setUserLocations: React.Dispatch<
    React.SetStateAction<LocationsDataObjTypeArr | undefined>
  >;
}

const BottomSheetSalahTimesSettings = ({
  triggerId,
  dbConnection,
  setUserPreferences,
  setUserLocations,
}: BottomSheetSalahTimesSettingsProps) => {
  const [madhab, setMadhab] = useState<"earlier" | "later">("earlier");

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
                className="flex items-center mx-5 border border-gray-500 rounded-md"
              >
                <p>Select location</p>
                <p>
                  <MdOutlineChevronRight />
                </p>
              </IonButton>
              <BottomSheetLocationSettings
                triggerId="open-location-settings"
                dbConnection={dbConnection}
                setUserLocations={setUserLocations}
                // setUserPreferences={setUserPreferences}
              />
            </section>
            <h5>Calculation Method</h5>
            <IonButton
              style={{
                "--background": "transparent",
              }}
              onClick={() => {}}
              className="flex items-center mx-5 border border-gray-500 rounded-md"
            >
              <p>Select calculation method</p>
              <p>
                <MdOutlineChevronRight />
              </p>
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
                    ? "bg-green-800 rounded-md"
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
                    ? "bg-green-800 rounded-md"
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
