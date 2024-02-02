import { parse } from "date-fns";
import PrayerMainView from "../PrayerMainView/PrayerMainView";
import { salahTrackingEntryType } from "../../types/types";

import ReactModal from "react-modal";

const Modal = ({
  setShowModal,
  showModal,
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentStartDate,
  // currentStartDate,
  startDate,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  setSalahTrackingArray: React.Dispatch<
    React.SetStateAction<salahTrackingEntryType[]>
  >;
  salahTrackingArray: salahTrackingEntryType[];
  setCurrentStartDate: React.Dispatch<React.SetStateAction<number>>;
  currentStartDate: number;
  startDate: Date;
}) => {
  //   const dateString = selectedDate;
  //   const startDate = parse(dateString, "dd.MM.yy", new Date());

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <div>
        <PrayerMainView
          setSalahTrackingArray={setSalahTrackingArray}
          salahTrackingArray={salahTrackingArray}
          setCurrentStartDate={setCurrentStartDate}
          // currentStartDate={currentStartDate}
          startDate={startDate}
        />
      </div>{" "}
    </ReactModal>
  );
};

export default Modal;
