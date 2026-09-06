import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";
import {
  reasonsToShowType,
  ReasonCountsByStatusType,
} from "../../types/types";
import ReasonsList from "../Stats/ReasonsList";
import { IonContent, IonModal } from "@ionic/react";

interface BottomSheetReasonsProps {
  // triggerId: string;
  setShowReasonsSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showReasonsSheet: boolean;
  reasonCountsByStatus: ReasonCountsByStatusType;
  status: reasonsToShowType;
}

const BottomSheetReasons = ({
  // triggerId,
  reasonCountsByStatus,
  status,
  setShowReasonsSheet,
  showReasonsSheet,
}: BottomSheetReasonsProps) => {
  return (
    <IonModal
      mode="ios"
      className="modal-height"
      isOpen={showReasonsSheet}
      onDidDismiss={() => {
        setShowReasonsSheet(false);
      }}
      // trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonContent>
        {status && (
          <section className="mt-10 mb-10">
            <h1 className="px-10 my-4 text-2xl text-center">
              {`Reasons For ${
                status === "male-alone"
                  ? "Praying Salah Alone"
                  : status === "late"
                    ? "Praying Salah Late"
                    : status === "missed"
                      ? "Missing Salah"
                      : ""
              }`}
            </h1>
            <ReasonsList
              reasonCountsByStatus={reasonCountsByStatus}
              status={status}
              partialOrFull="full"
            />
          </section>
        )}
      </IonContent>
    </IonModal>
  );
};

export default BottomSheetReasons;
