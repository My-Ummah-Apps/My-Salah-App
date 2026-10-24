import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import { changeLogs } from "../../utils/changelog";
import { LATEST_APP_VERSION } from "../../utils/changelog";
import { IonButton, IonContent, IonFooter, IonModal } from "@ionic/react";
import { useRef } from "react";

interface BottomSheetChangeLogProps {
  setShowChangelogSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showChangelogSheet: boolean;
}

const BottomSheetChangelog = ({
  setShowChangelogSheet,
  showChangelogSheet,
}: BottomSheetChangeLogProps) => {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      ref={modal}
      mode="ios"
      className="modal-height"
      isOpen={showChangelogSheet}
      onDidDismiss={() => {
        setShowChangelogSheet(false);
      }}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent className="[--background:var(--sheet-bg-color)]">
        <section className="px-5 pt-8 pb-8">
          <h1 className="font-bold leading-tight">What's new?</h1>
          {changeLogs.map((item, i) => (
            <section
              key={i}
              className="mt-3 rounded-2xl border border-[color:var(--sheet-group-border)] bg-[var(--sheet-group-bg)] p-4 first-of-type:mt-5"
            >
              <p className="flex items-center justify-between gap-3 text-[0.9375rem] font-semibold">
                v{item.versionNum}
                {item.versionNum === LATEST_APP_VERSION && (
                  <span className="rounded-full bg-[var(--tag-blue-bg)] px-2 py-px text-[11px] font-semibold text-[var(--current-salah-color)]">
                    Latest
                  </span>
                )}
              </p>
              {item.changes.map((item) => (
                <section
                  key={item.heading}
                  className="mt-4 border-t border-[color:var(--sheet-divider-color)] pt-4"
                >
                  <h2 className="mb-2 mt-0 text-[0.9375rem] font-semibold leading-snug">
                    {item.heading}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--secondary-text-color)]">
                    {item.text}
                  </p>
                </section>
              ))}
            </section>
          ))}
        </section>
      </IonContent>
      <IonFooter className="ion-no-border">
        <div className="border-t border-[color:var(--sheet-divider-color)] bg-[var(--sheet-bg-color)] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <IonButton
            expand="block"
            onClick={() => modal.current?.dismiss()}
            className="m-0 text-[0.9375rem] font-semibold"
          >
            Close
          </IonButton>
        </div>
      </IonFooter>
    </IonModal>
  );
};

export default BottomSheetChangelog;
