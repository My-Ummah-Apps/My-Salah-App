// import { parse } from "date-fns";
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
  // selectedDay,
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
  // selectedDay: Date;
  startDate: Date;
}) => {
  //   const dateString = selectedDate;
  //   const startDate = parse(dateString, "dd.MM.yy", new Date());

  return (
    <ReactModal
      style={{ content: { background: "rgb(33, 36, 38)" } }}
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
          // selectedDay={selectedDay}
          startDate={startDate}
        />
      </div>{" "}
    </ReactModal>
  );
};

export default Modal;
