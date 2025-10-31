import { IonButton } from "@ionic/react";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";

const SalahTimesSettings = () => {
  const [madhab, setMadhab] = useState<"earlier" | "later">("earlier");

  return (
    <>
      <section className="text-center">
        <h5>Location</h5>
        <IonButton
          style={{
            "--background": "transparent",
          }}
          onClick={() => {}}
          className="w-full"
        >
          <section className="flex items-center justify-between w-full px-4 py-2 border border-gray-500 rounded-md">
            <p>Select location</p>
            <p>
              <MdOutlineChevronRight />
            </p>
          </section>
        </IonButton>
        {/* <section className="flex justify-center gap-2">
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
          </section> */}
      </section>
      <section className="mt-10 text-center">
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
    </>
  );
};

export default SalahTimesSettings;
