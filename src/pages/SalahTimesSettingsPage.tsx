import { IonButton, IonContent } from "@ionic/react";
import { MdOutlineChevronRight } from "react-icons/md";
import LocationSettingsPage from "./LocationSettingsPage";

interface SalahTimesSettingsPageProps {
  nav: HTMLIonNavElement;
  madhab: string | null;
  setMadhab: React.Dispatch<React.SetStateAction<"earlier" | "later">>;
}

const SalahTimesSettingsPage = ({
  nav,
  setMadhab,
  madhab,
}: SalahTimesSettingsPageProps) => {
  const navigateToLocationSettingsPage = () =>
    nav.push(LocationSettingsPage, { nav });

  return (
    <IonContent>
      <section className="mt-10 text-center">
        <section className="text-center">
          <h5>Location</h5>
          <IonButton
            style={{
              "--background": "transparent",
            }}
            onClick={navigateToLocationSettingsPage}
            className="flex items-center justify-between w-full px-4 py-2 border border-gray-500 rounded-md"
          >
            {/* <section className=""> */}
            <p>Select location</p>
            <p>
              <MdOutlineChevronRight />
            </p>
            {/* </section> */}
          </IonButton>
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
  );
};

export default SalahTimesSettingsPage;
