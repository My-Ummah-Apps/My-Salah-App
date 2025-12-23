import {
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
} from "@ionic/react";
import {
  INITIAL_MODAL_BREAKPOINT,
  MODAL_BREAKPOINTS,
} from "../../utils/constants";

interface BottomSheetSalahTimeCustomAdjustmentsProps {
  triggerId: string;
}

const BottomSheetSalahTimeCustomAdjustments = ({
  triggerId,
}: BottomSheetSalahTimeCustomAdjustmentsProps) => {
  const arr = [];
  for (let i = -60; i <= 60; i++) {
    arr.push(i);
  }

  console.log(arr);

  return (
    <IonModal
      className="modal-fit-content"
      mode="ios"
      trigger={triggerId}
      initialBreakpoint={INITIAL_MODAL_BREAKPOINT}
      breakpoints={MODAL_BREAKPOINTS}
    >
      <IonPicker className="my-5">
        <IonPickerColumn value={0}>
          {arr.map((item) => {
            return (
              <IonPickerColumnOption key={item} value={item}>
                {item}
              </IonPickerColumnOption>
            );
          })}
        </IonPickerColumn>
      </IonPicker>
    </IonModal>
  );
};

export default BottomSheetSalahTimeCustomAdjustments;
