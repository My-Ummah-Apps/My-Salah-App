import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import { changeLogs } from "../../utils/changelog";
import { LATEST_APP_VERSION } from "../../utils/changelog";
import { IonContent, IonModal } from "@ionic/react";

interface BottomSheetChangeLogProps {
  triggerId: string;
}

const BottomSheetChangelog = ({ triggerId }: BottomSheetChangeLogProps) => {
  return (
    <IonModal
      mode="ios"
      className="modal-height"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        <h1 className="mx-6 mt-8 mb-4 text-4xl ">Whats new?</h1>
        {changeLogs.map((item, i) => (
          <section
            key={i}
            className="pb-20 mx-6 mt-4 changelog-individual-log"
            // style={{ borderColor: i === 0 ? "red" : "" }}
          >
            <p>
              {item.versionNum === LATEST_APP_VERSION
                ? `v${item.versionNum} - Latest Version`
                : `v${item.versionNum}`}
            </p>
            {item.changes.map((item) => (
              <section
                key={item.heading}
                // style={{ border: `1px solid ${activeBackgroundColor}` }}
                className="mt-4 mb-4 p-4 border border-[var(--border-form)] rounded-xl
"
              >
                <h2 className="mb-2 text-lg font-medium">{item.heading}</h2>
                <p className="text-sm">{item.text}</p>
              </section>
            ))}
          </section>
        ))}{" "}
        <button className="w-[90%] rounded-xl bg-[#5c6bc0] p-3 text-center fixed bottom-[7%] left-1/2 transform -translate-x-1/2 translate-y-1/2">
          Close
        </button>
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetChangelog;
